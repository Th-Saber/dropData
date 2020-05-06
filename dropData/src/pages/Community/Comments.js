import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Button} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import {connect} from 'react-redux';
import FlatScroll from '@/component/FlatScroll';
import {getComments, sendComments, delComments} from '@/apis/api';
import MsgBox from '@/component/MsgBox';
import moment from 'moment';
import {Color, setSize} from '@/utils/global.js';
import toast from '@/utils/toastMsg';
class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgList: [],
      userdata: props.userdata, //userdata
      communityId: 0, //动态id
      delId: 0, //删除动态id
      text: '', //输入框数据
      btnLoading: false, //发送按钮是否禁用
      pages: {
        //评论数据分页
        page: 1,
        size: 15,
      },
      isNextPage: false, //是否有下一页
      isEnd: true, //是否滚动到最底部
    };
  }
  componentDidMount = () => {
    let communityId = this.props.navigation.getParam('communityId');
    this.setState(
      {
        communityId,
      },
      () => {
        this.searchFn();
      },
    );
  };
  //   请求评论数据
  searchFn = async callback => {
    const {pages, communityId} = this.state;
    let params = {
      ...pages,
      communityId,
    };
    try {
      let res = await getComments(params);
      this.setState(state => ({
        msgList:
          pages.page === 1
            ? res.data.records
            : [...res.data.records, ...state.msgList],
        isNextPage: res.data.current === res.data.pages,
        isEnd: pages.page === 1,
      }));
      callback && callback(true);
    } catch (error) {
      console.log('请求失败', error);
    }
  };
  //   发送评论
  submitFn = async () => {
    let {text, communityId, userdata} = this.state;
    let params = {
      communityId,
      content: text,
    };
    this.setState({
      btnLoading: true,
    });
    try {
      let res = await sendComments(params);
      let result = {
        content: text,
        userId: userdata.userId,
        id: res.data,
        createTime: moment().toISOString(),
      };
      this.setState(state => ({
        msgList: [...state.msgList, result],
        btnLoading: false,
        isEnd: true,
        text: '',
      }));
    } catch (error) {
      console.log('评论失败', error);
      this.setState({
        btnLoading: false,
      });
    }
  };
  //启动消息框
  itemLongPress = item => {
    if (this.state.userdata.userId !== item.userId) return;
    this.setState(
      {
        delId: item.id,
      },
      () => {
        this.msgbox && this.msgbox.open(4000);
      },
    );
  };
  //   删除评论
  _delItem = async () => {
    let {delId, msgList} = this.state;
    try {
      await delComments({commentId: delId});
      toast.show('操作成功');
      let arr = JSON.parse(JSON.stringify(msgList));
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === delId) {
          arr.splice(i, 1);
          break;
        }
      }
      this.setState({
        msgList: arr,
      });
    } catch (error) {
      console.log('评论删除失败', error);
    }
  };
  //  下拉刷新
  _downRefresh = callback => {
    let {msgList, pages} = this.state;
    if (msgList.length < pages.size * pages.page) {
      toast.show('没有更多的评论了');
      callback();
      return;
    }
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
    if (index === 0) {
      return (
        <Text
          style={{
            textAlign: 'center',
            marginVertical: setSize(3),
            fontSize: setSize(5),
            color: Color.minText,
          }}>
          {moment(time).calendar()}
        </Text>
      );
    }
    let oldTime = moment(msgList[index - 1].createTime).unix();
    let newTime = moment(moment().format('YYYY-MM-DD 00:00:00')).unix();
    let strTime = '';
    // 如果两次发消息间隔超过2分钟  就显示时间
    if (nowTime - oldTime > 120) {
      if (nowTime > newTime) {
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
    let {userdata} = this.state;
    let flag = item.userId === userdata.userId;
    return (
      <View style={{marginVertical: setSize(2)}}>
        {/* 是否显示时间 */}
        {this.isSHowTime(item.createTime, index)}
        <View style={flag ? styles.item1 : styles.item}>
          <Avatar
            rounded
            icon={{name: 'user', type: 'antdesign'}}
            source={
              flag
                ? userdata.imageUrl && {uri: userdata.imageUrl}
                : item.avator && {uri: item.avator}
            }
            size={setSize(21)}
            containerStyle={{
              borderWidth: 2,
              borderColor: '#fff',
            }}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onLongPress={this.itemLongPress.bind(this, item)}
            style={{flex: 1, alignItems: flag ? 'flex-end' : 'flex-start'}}>
            {!flag && (
              <Text
                style={{
                  color: Color.infoText,
                  maxWidth: setSize(100),
                  marginBottom: 4,
                }}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.name}
              </Text>
            )}

            <View
              style={[
                {
                  maxWidth: '80%',
                  paddingHorizontal: setSize(4),
                  paddingVertical: setSize(2),
                  borderRadius: 4,
                  justifyContent: 'center',
                },
                flag ? styles.text : styles.text1,
              ]}>
              <Text
                style={{
                  color: Color.mainText,
                  letterSpacing: 1,
                }}>
                {item.content}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  render() {
    let {msgList, text, btnLoading, isEnd} = this.state;
    return (
      <View style={styles.container}>
        <Header back centerComponent="评论" />
        <FlatScroll
          data={msgList}
          dropDown
          scrollEnd={isEnd}
          renderItem={this.renderItem}
          downRefresh={this._downRefresh}
        />
        <View
          style={{
            backgroundColor: '#fff',
            flexDirection: 'row',
            paddingHorizontal: setSize(5),
            paddingVertical: setSize(7),
            alignItems: 'center',
          }}>
          <TextInput
            style={[styles.input, {maxHeight: setSize(30)}]}
            maxLength={400}
            multiline={true}
            selectionColor={Color.primary}
            keyboardType="default"
            value={text}
            onChangeText={text => this.setState({text})}
          />
          <Button
            title={'发送'}
            buttonStyle={{
              marginLeft: setSize(5),
              backgroundColor: Color.primary,
            }}
            disabledStyle={{backgroundColor: Color.downPrimary}}
            titleStyle={{fontSize: setSize(7)}}
            disabled={!text || btnLoading}
            disabledTitleStyle={{color: '#fff'}}
            onPress={this.submitFn}
          />
        </View>
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
  input: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Color.mainBorder,
    color: Color.mainText,
    fontSize: setSize(7),
    paddingVertical: setSize(2),
  },
  item: {
    flexDirection: 'row',
  },
  text: {
    backgroundColor: '#fff',
    marginRight: setSize(2),
  },
  text1: {
    backgroundColor: '#fff',
    marginLeft: setSize(2),
  },
  item1: {
    flexDirection: 'row-reverse',
  },
});

function filter(state) {
  return {
    userdata: state.userdata,
  };
}

export default connect(filter)(Comments);
