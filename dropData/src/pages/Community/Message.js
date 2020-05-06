import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Image} from 'react-native-elements';
import FlatScroll from '@/component/FlatScroll';
import MsgBox from '@/component/MsgBox';
import {connect} from 'react-redux';
import {change_num} from '@/store/actions';
import message from '@/apis/message';
import Nav from '@/navigators/NavigationService';
import {Color, setSize} from '@/utils/global.js';
import moment from 'moment';
class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgData: props.msglist,
      flag: false,
      delUid: 0, //长按删除的uid
      delUnread: 0, //长按删除的未读消息
    };
  }
  static getDerivedStateFromProps(props, state) {
    return {
      msgData: props.msglist,
    };
  }
  //   长按删除
  longPressItem = item => {
    if (item.userId === -1 || item.userId === -2) return;
    this.msgbox && this.msgbox.open(4000);
    this.setState({
      delUid: item.userId,
      delUnread: item.unread,
    });
  };
  //   点击删除
  _delItem = () => {
    let {delUnread, delUid} = this.state;
    delUnread !== 0 && this.props.dispatch(change_num(-delUnread));
    message.finUserIdEdit('del', delUid);
  };
  //   点击静茹聊天
  clickItem = item => {
    if (item.userId === -1 || item.userId === -2) {
      Nav.navigate('NewsStateList', {
        uid: item.userId,
        callback: this.changeRead,
        cleanMsg: this.cleanSystem,
      });
    } else {
      // 移除小红点
      item.unread !== 0 && this.props.dispatch(change_num(-item.unread));
      message.finUserIdEdit('unread', item.userId);
      let modelType = {
        model: 0,
      };
      if (item.userId === -3) {
        let len = item.messages.length;
        for (let i = len - 1; i >= 0; i--) {
          if (item.messages[i].sendOriginId) {
            modelType.model = 1;
            modelType.exId = item.messages[i].sendOriginId;
            break;
          }
        }
      }
      Nav.navigate('MsgDetial', {
        item:
          item.userId === -3
            ? {type: true, username: item.username, ...modelType, userId: -3}
            : item,
        changeList: () => {
          this.setState(state => ({flag: !state.flag}));
        },
      });
    }
  };
  //  评论 赞 消除红点
  changeRead = (userId, index) => {
    let newarr = [...this.state.msgData];
    if (userId === -1) {
      newarr[0].unread > 0 && newarr[0].unread--;
    } else if (userId === -2) {
      newarr[1].unread > 0 && newarr[1].unread--;
    }
    // 消除小红点
    this.props.dispatch(change_num(-1));
    message.finUserIdEdit('systemMsg', userId, index);
    this.setState({
      msgData: newarr,
    });
  };
  //   清空系统消息
  cleanSystem = userId => {
    let newarr = [...this.state.msgData];
    let len = 0;
    if (userId === -1) {
      len = newarr[0].unread;
      newarr[0].unread = 0;
    } else if (userId === -2) {
      len = newarr[1].unread;
      newarr[1].unread = 0;
    }
    // 消除小红点
    this.props.dispatch(change_num(-len));
    message.finUserIdEdit('cleanSystem', userId);
  };
  //   过滤时间
  showTime = msg => {
    if (!msg || !msg.length) {
      return '';
    }
    let timeData = msg[msg.length - 1].createTime;
    let oldTime = moment(timeData).unix();
    let newTime = moment(moment().format('YYYY-MM-DD 00:00:00')).unix();
    if (oldTime > newTime) {
      return moment(timeData).format('HH:mm');
    }
    if (oldTime < newTime && newTime - oldTime > 86400) {
      //86400
      return moment(timeData).format('M月D日');
    } else {
      return moment(timeData).calendar();
    }
  };
  _downRefresh = callback => {
    message.request(callback);
  };
  //   自定义bage
  myBage = num => {
    if (!num || num <= 0) {
      return null;
    }
    let flag = num > 99;
    return (
      <View
        style={{
          height: setSize(8),
          minWidth: setSize(8),
          borderRadius: setSize(4),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Color.danger,
          paddingHorizontal: flag ? 2 : 0,
          position: 'absolute',
          right: setSize(4),
          bottom: 0,
        }}>
        <Text style={{fontSize: setSize(5), color: '#fff'}}>
          {flag ? '99+' : num}
        </Text>
      </View>
    );
  };
  //   渲染子组件
  renderItem = item => {
    // 过滤消息  显示最后一条消息
    let nowMsg =
      item.messages && item.messages.length
        ? item.messages[item.messages.length - 1].message
        : '';

    return (
      <TouchableOpacity
        style={styles.item}
        onLongPress={this.longPressItem.bind(this, item)}
        onPress={this.clickItem.bind(this, item)}>
        <Image
          source={item.userId > 0 ? {uri: item.avator} : item.avator}
          placeholderStyle={{
            backgroundColor: 'transparent',
          }}
          style={{width: setSize(23), height: setSize(23)}}
        />
        <View style={{marginLeft: setSize(5), flex: 1}}>
          <View style={styles.titleRow}>
            <Text
              style={{color: Color.mainText, maxWidth: '70%'}}
              numberOfLines={1}
              ellipsizeMode="tail">
              {item.username}
            </Text>
            <Text style={{color: Color.minText}}>
              {this.showTime(item.messages)}
            </Text>
          </View>
          <Text
            style={{
              color: Color.infoText,
              marginTop: setSize(2),
              maxWidth: '80%',
            }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {nowMsg}
          </Text>
          {this.myBage(item.unread)}
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    let {msgData} = this.state;
    return (
      <View style={styles.container}>
        <FlatScroll
          data={msgData}
          dropDown
          borderStyle={{height: 1, backgroundColor: Color.downBorder}}
          renderItem={this.renderItem}
          downRefresh={this._downRefresh}
          containerStyle={{paddingHorizontal: 0}}
        />
        {/* 消息弹出框 */}
        <MsgBox ref={e => (this.msgbox = e)} itemPress={this._delItem} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bgColor,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
  },
  item: {
    height: setSize(36),

    backgroundColor: '#fff',
    paddingHorizontal: setSize(6),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

function filter(state) {
  return {
    msglist: state.MsgList,
  };
}

export default connect(filter)(Message);
