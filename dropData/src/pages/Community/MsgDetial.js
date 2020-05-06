import React, {Component} from 'react';
import {Text, StyleSheet, View, TextInput} from 'react-native';
import {Avatar, Button} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import FlatScroll from '@/component/FlatScroll';
import {Color, setSize} from '@/utils/global.js';
import moment from 'moment';
import message from '@/apis/message';
import {save_uid, del_uid} from '@/store/actions';
import {sendMsg, getExpertsInfo, getRobot} from '@/apis/api';
import toast from '@/utils/toastMsg';
export default class MsgDetial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgList: [],
      nowMsgList: [],
      navTitle: '聊天',
      robotList: [], //机器人默认问题 （专家答疑模式用）
      robotAct: [], //机器人选中的问题索引 （专家答疑模式用）
      model: 0, //聊天模式 0为机器人 1为专家 （专家答疑模式用）
      lastQustion: [], //当前机器人的最后一个问题 （专家答疑模式用）
      avator: '', //聊天对象头像
      sendAvator: props.data.userdata.imageUrl, //发送对象头像
      userId: 0, //发送对象id
      sendId: 0, //发送人的id （本机用户id）
      pages: {
        page: 1,
        size: 10,
      },
      text: '',
      showTopTips: false,
      btnLoading: false, //发送按钮等待中
      isScorll: true, //是否list长度改变自动滚动到底部  false时加载历史数据
    };
  }
  static getDerivedStateFromProps(props, state) {
    for (const v of props.data.MsgList) {
      if (state.showTopTips ? v.userId === -3 : state.userId === v.userId) {
        let sendOriginId = v.messages[v.messages.length - 1].sendOriginId;
        if (v.userId === -3 && sendOriginId) {
          return {
            userId: sendOriginId, //修改专家id
            navTitle: v.username, //显示专家名字
            model: 1, //切换为专家模式
            msgList: v.messages,
          };
        } else {
          return {
            msgList: v.messages,
          };
        }
      }
    }
    return null;
  }
  componentDidMount() {
    let item = this.props.navigation.getParam('item');
    //   进入页面储存uid
    this.props.dispatch(save_uid(item.userId));
    if (item.type) {
      this.initExpertsFn(item);
    } else {
      this.initUserPage(item);
    }
  }
  componentWillUnmount() {
    //   跳出页面移除储存的uid
    this.props.dispatch(del_uid());
  }
  //--------------------用户页面方法------------//
  //   初始化页面数据
  initUserPage = item => {
    this.setState({
      navTitle: item.username,
      avator: item.avator,
      userId: item.userId,
      // sendAvator:this.props.data.userdata.userId,
      sendId: this.props.data.userdata.userId,
    });
  };
  //   ----------点击切换医师------------//
  // 初始化专家信息
  initExpertsFn = item => {
    this.setState(
      {
        navTitle: item.username,
        avator: require('@/assets/icon/icon_doctor.png'),
        sendId: this.props.data.userdata.userId,
        userId: item.model === 0 ? 0 : item.exId,
        showTopTips: item.type,
        model: item.model,
      },
      () => {
        if (item.model === 0) {
          //机器人模式自动提示问题
          this.getRobotFn();
        }
      },
    );
  };
  //   获取机器人问题列表
  getRobotFn = async () => {
    try {
      let res = await getRobot();
      this.setState(
        {
          robotList: res.data,
        },
        () => {
          this.robotListFn();
        },
      );
    } catch (error) {
      console.log('机器人', error);
    }
  };
  //   获取专家id
  changeDoctor = async () => {
    try {
      let res = await getExpertsInfo();
      this.setState({
        userId: res.data.userId,
        navTitle: res.data.username,
        model: 1,
      });
      toast.show(`${res.data.username}在线为您解答`);
    } catch (error) {
      console.log('医师不在线', error);
    }
  };
  //   渲染机器人数据
  robotListFn = () => {
    let {robotList, robotAct, navTitle, avator} = this.state;
    let params = {
      sendId: 0,
      createTime: moment().toISOString(),
      receiveId: -3,
    };
    let arr = [...robotList];
    let flag = robotAct.length > 0;
    if (flag) {
      robotAct.forEach(v => {
        params.text = arr[v].text ? arr[v].text : '';
        arr = arr[v].child;
      });
    }
    message.sendMsg(
      {...params, robotList: arr, showPhone: flag},
      {
        username: navTitle,
        saveId: -3,
        avator: avator,
      },
    );
    // 储存最后一条消息
    this.setState({
      lastQustion: arr,
    });
  };
  //激活问题
  pushQustion = (type, i) => {
    let arr = [...this.state.robotAct];
    if (type === 'add') {
      arr.push(i);
    } else {
      arr.pop();
    }
    this.setState(
      {
        robotAct: arr,
      },
      () => {
        this.robotListFn();
      },
    );
  };
  //--------------系统方法---------------//
  //  分页  加载更多数据
  searchFn = ({page, size}) => {
    let {msgList} = this.state;
    let len = msgList.length;
    let allPage = Math.ceil((page * size) / len);
    if (page > allPage) {
      this.callback && this.callback();
      page = allPage;
    }
    let start = len - page * size;
    let arr = msgList.slice(start > 0 ? start : 0, len);
    this.callback && this.callback();
    return arr;
  };
  //  提交修改
  submitFn = async () => {
    let {
      text,
      userId,
      showTopTips,
      sendId,
      navTitle,
      avator,
      lastQustion,
    } = this.state;
    // 判断userId 是否等于0 如果不等于0就正常发送消息  等于0就是机器人消息
    if (userId !== 0) {
      let params = {
        receiveId: userId,
        message: text,
        type: 1,
        receiveType: showTopTips ? 2 : 1,
      };
      this.setState({
        btnLoading: true,
      });
      try {
        await sendMsg(params);
        let sendData = Object.assign({}, params, {
          createTime: moment().toISOString(),
          self: true, //本地特殊标识符  判断显示位置是否在右侧
          sendId,
          sendType: 1,
        });
        message.sendMsg(sendData, {
          username: navTitle,
          saveId: showTopTips ? -3 : userId,
          avator: avator,
        });
        this.setState(
          {
            text: '',
            btnLoading: false,
            isScorll: true,
          },
          () => {
            let changeList = this.props.navigation.getParam('changeList');
            changeList && changeList();
          },
        );
      } catch (error) {
        this.setState({
          btnLoading: false,
        });
      }
    } else {
      let params = {
        receiveId: -3,
        message: text,
        type: 1,
        self: true,
        receiveType: showTopTips ? 2 : 1,
        createTime: moment().toISOString(),
        sendId,
        sendType: 1,
      };
      message.sendMsg(params, {
        username: navTitle,
        saveId: -3,
        avator: avator,
      });
      this.setState(
        {
          text: '',
          isScorll: true,
        },
        () => {
          var regPos = /^\d+$/; // 非负整数
          if (regPos.test(text)) {
            let numIndex = parseInt(text);
            let len = lastQustion.length;
            if (numIndex > 0 && numIndex <= len) {
              this.pushQustion('add', numIndex - 1);
            } else if (numIndex === len + 1) {
              this.pushQustion('pre');
            } else {
              toast.show('亲，没有该问题哦！');
            }
          }
          let changeList = this.props.navigation.getParam('changeList');
          changeList && changeList();
        },
      );
    }
  };
  //  下拉刷新
  _downRefresh = callback => {
    this.callback = callback;
    this.setState(state => ({
      pages: Object.assign({}, this.state.pages, {
        page: ++state.pages.page,
      }),
      isScorll: false,
    }));
  };
  //是否显示聊天时间
  isSHowTime = (time, index) => {
    let {msgList} = this.state;
    let nowTime = moment(time).unix();
    let newTime = moment(moment().format('YYYY-MM-DD 00:00:00')).unix();
    let strTime = '';
    if (index > 0) {
      let oldTime = moment(msgList[index - 1].createTime).unix();
      // 如果两次发消息间隔超过2分钟  就显示时间
      if (nowTime - oldTime > 120) {
        if (nowTime > newTime) {
          strTime = moment(time).format('HH:mm');
        } else {
          strTime = moment(time).calendar();
        }
      }
    } else {
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
  };
  //根据类型判断头像地址
  showAvator = item => {
    let {showTopTips, sendAvator, avator} = this.state;
    if (!item.self) {
      if (showTopTips) {
        return avator;
      } else {
        return avator && {uri: avator};
      }
    } else {
      return sendAvator && {uri: sendAvator};
    }
  };
  renderItem = (item, index) => {
    let avator = this.showAvator(item);
    return (
      <View style={{marginBottom: setSize(4)}}>
        {/* 是否显示时间 */}
        {this.isSHowTime(item.createTime, index)}
        <View style={item.self ? styles.item1 : styles.item}>
          <Avatar
            rounded
            icon={{
              name: 'user',
              type: 'antdesign',
            }}
            source={avator}
            size={setSize(21)}
            containerStyle={{
              borderWidth: 2,
              borderColor: '#fff',
            }}
          />
          <View
            style={[
              {
                maxWidth: item.sendId === 0 ? '70%' : '80%',
                paddingHorizontal: setSize(4),
                paddingVertical: setSize(2),
                borderRadius: 4,
                justifyContent: 'center',
              },
              item.self ? styles.text : styles.text1,
            ]}>
            {item.sendId === 0 ? (
              <View>
                <Text>
                  {item.text
                    ? item.text
                    : '您好，欢迎使用智能哨兵，回复数字查看相关问题答案'}
                </Text>
                <View
                  style={{
                    marginVertical: setSize(6),
                    marginLeft: setSize(6),
                  }}>
                  {item.robotList.map((v, i) => {
                    return (
                      <Text
                        key={i + 'sex'}
                        style={{
                          color: Color.primary,
                        }}>
                        {i + 1}&emsp;{v.title}
                      </Text>
                    );
                  })}
                  {item.showPhone && (
                    <Text
                      style={{
                        color: Color.primary,
                      }}>
                      {item.robotList.length + 1}
                      &emsp;返回上一级
                    </Text>
                  )}
                </View>
                {item.showPhone && (
                  <Text>
                    没有找到满意的答案？您可以进入
                    <Text
                      style={{
                        color: Color.primary,
                      }}
                      onPress={this.changeDoctor}>
                      专家答疑
                    </Text>
                    ，或直接致电：
                    <Text
                      style={{
                        color: Color.primary,
                      }}>
                      028-262626
                    </Text>
                  </Text>
                )}
              </View>
            ) : (
              <Text
                style={{
                  color: Color.infoText,
                  letterSpacing: 1,
                }}>
                {item.message}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };
  //头部组件
  _listHeader = () => {
    let {showTopTips} = this.state;
    return (
      <View>
        {showTopTips && (
          <View
            style={{
              backgroundColor: '#d5d5d5',
              borderRadius: 6,
              paddingHorizontal: setSize(5),
              marginTop: setSize(2),
              paddingVertical: setSize(3),
            }}>
            <Text style={{fontSize: setSize(6), color: '#fff'}}>
              回答仅供参考，具体诊疗请前往医院咨询医生。
            </Text>
          </View>
        )}
      </View>
    );
  };
  render() {
    let {msgList, text, navTitle, btnLoading, isScorll, pages} = this.state;
    return (
      <View style={styles.container}>
        <Header back centerComponent={navTitle} />
        <FlatScroll
          data={this.searchFn(pages)}
          dropDown
          scrollEnd={isScorll}
          header={this._listHeader}
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
            multiline
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
    justifyContent: 'flex-start',
    // alignItems: 'center',
    paddingLeft: setSize(2),
    paddingRight: setSize(2),
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
    // alignItems: 'center',
    paddingLeft: setSize(2),
    paddingRight: setSize(2),
  },
});
