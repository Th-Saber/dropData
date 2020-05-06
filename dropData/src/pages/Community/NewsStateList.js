import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import Nav from '@/navigators/NavigationService';
import MsgBox from '@/component/MsgBox';
import Header from '@/component/Header';
import FlatScroll from '@/component/FlatScroll';
import moment from 'moment';
import {Color, setSize} from '@/utils/global.js';
export default class NewsStateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgList: [],
      userId: props.navigation.getParam('uid'),
      flag: false,
      pages: {
        page: 1,
        size: 15,
      },
      isNextPage: false,
    };
  }
  static getDerivedStateFromProps(props, state) {
    for (const v of props.data.MsgList) {
      if (state.userId === v.userId) {
        let arr = [...v.messages];
        return {
          msgList: arr.reverse(),
        };
      }
    }
    return null;
  }
  componentDidMount = () => {};
  searchFn = callback => {
    let {msgList, pages} = this.state;
    let arr = msgList.slice(0, pages.size * pages.page);
    callback && callback(arr.length > pages.size * pages.page);
    return arr;
  };
  //  点击子项消除红点跳转到品论详情
  itemPress = (item, index) => {
    if (item.isread) return;
    this.props.navigation.getParam('callback')(this.state.userId, index);
    if (this.state.userId === -2) return;
    Nav.navigate('Comments', {communityId: item.id});
  };
  //清空记录
  cleanItem = () => {
    if (this.state.msgList.length === 0) return;
    this.msgbox && this.msgbox.open(4000);
  };
  //  点击删除
  _delItem = () => {
    // 移除小红点
    this.props.navigation.getParam('cleanMsg')(this.state.userId);
    this.setState(state => ({
      flag: !state.flag,
    }));
  };
  //  下拉刷新
  _downRefresh = callback => {
    this.setState(
      {
        pages: Object.assign({}, this.state.pages, {page: 1}),
      },
      () => {
        this.searchFn(callback);
      },
    );
  };
  //   上拉刷新函数
  _pullRefresh = callback => {
    // if (this.state.isNextPage) {
    //   callback();
    //   return;
    // }
    this.setState(
      state => ({
        pages: Object.assign({}, this.state.pages, {
          page: ++state.pages.page,
        }),
      }),
      () => {
        this.searchFn(callback);
      },
    );
  };
  //是否显示聊天时间
  isSHowTime(time, index) {
    let {msgList} = this.state;
    let nowTime = moment(time).unix();
    let newTime = moment(moment().format('YYYY-MM-DD 00:00:00')).unix();
    let strTime = '';
    if (index > 0) {
      let oldTime = moment(msgList[index - 1].createTime).unix();
      // 如果两次发消息间隔超过2分钟  就显示时间
      if (oldTime - nowTime > 120) {
        if (newTime < nowTime) {
          strTime = moment(time).format('HH:mm');
        } else {
          strTime = moment(time).calendar();
        }
      }
    } else {
      if (newTime < nowTime) {
        strTime = moment(time).format('HH:mm');
      } else {
        strTime = moment(time).calendar();
      }
    }
    return strTime ? (
      <Text
        style={{
          textAlign: 'center',
          marginVertical: setSize(3),
          fontSize: setSize(5),
          color: Color.minText,
        }}>
        {strTime}
      </Text>
    ) : null;
  }
  renderItem = (item, index) => {
    let {userId} = this.state;
    return (
      <View style={{marginBottom: setSize(4)}}>
        {/* 是否显示时间 */}
        {this.isSHowTime(item.createTime, index)}
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            backgroundColor: '#fff',
            borderRadius: 6,
            width: '80%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            height: setSize(20),
          }}
          onPress={this.itemPress.bind(this, item, index)}>
          <Text style={{color: Color.mainText}}>
            {userId === -1 ? '您有一条新的评论信息' : '有人赞了你一下'}
          </Text>
          {!item.isread && (
            <View
              style={{
                width: setSize(5),
                height: setSize(5),
                borderRadius: setSize(3),
                backgroundColor: Color.danger,
                position: 'absolute',
                right: setSize(-2.5),
                top: setSize(-2.5),
              }}></View>
          )}
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    let {userId, msgList, pages} = this.state;
    let listArr = this.searchFn();
    return (
      <View style={styles.container}>
        <Header
          back
          centerComponent={userId === -1 ? '评论' : '点赞'}
          rightComponent={() => {
            if (msgList.length) {
              return (
                <Text style={{color: '#fff', fontSize: setSize(7)}}>清空</Text>
              );
            } else {
              return null;
            }
          }}
          RightOnPress={this.cleanItem.bind(this)}
        />
        {/* 这是一个示例demo */}
        <FlatScroll
          data={msgList}
          //   dropDown
          //   scrollEnd
          renderItem={this.renderItem}
          //   downRefresh={this._downRefresh}
          pull={msgList.length > pages.size}
          pullRefresh={this._pullRefresh}
        />
        {/* 消息弹出框 */}
        <MsgBox
          ref={e => (this.msgbox = e)}
          title="点击清空"
          itemPress={this._delItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bgColor,
  },
});
