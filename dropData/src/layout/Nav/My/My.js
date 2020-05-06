import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Badge, Icon, Image} from 'react-native-elements';
import {connect} from 'react-redux';
import * as Animatable from 'react-native-animatable';
import Icomoon from 'react-native-vector-icons/Icomoon';
import Header from '@/component/Header';
import Nav from '@/navigators/NavigationService';
import {Color, setSize} from '@/utils/global.js';

class My extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userdata: props.userdata,
      avatarList: [
        {
          title: '积分明细',
          path: 'ScoreInfo',
        },
        {
          title: 'border',
        },
        {
          title: '0元兑换',
          path: 'Exchange',
        },
      ],
      list: [
        {
          icon: require('@/assets/icon/icon_daily.png'),
          title: '我的健康日报',
          path: 'Daily',
        },
        {
          icon: require('@/assets/icon/icon_equipment.png'),
          title: '人员设备管理',
          path: 'Equipment',
        },
        {
          icon: require('@/assets/icon/icon_consulting.png'),
          title: '健康咨询',
          path: 'MsgDetial',
          //   path: 'Consulting',
        },
        {
          icon: require('@/assets/icon/icon_address.png'),
          title: '地址管理',
          path: 'Address',
        },
        {
          icon: require('@/assets/icon/lianxiren.png'),
          title: '紧急联系人',
          path: 'Contact',
        },
        {
          icon: require('@/assets/icon/icon_setting.png'),
          title: '设置',
          path: 'Setting',
        },
      ],
    };
  }
  static getDerivedStateFromProps(props, state) {
    return {
      userdata: props.userdata,
    };
  }
  componentDidMount() {
    //   this.setState({
    //     userdata: this.props.userdata,
    //   });
  }
  _jumpTo = id => {
    Nav.navigate('HisHome', {id});
  };
  jumpItem = path => {
    let params = {};
    if (path === 'MsgDetial') {
      params.item = {
        type: true, //显示聊天界面顶部提示消息
        username: '健康咨询', //名字
        model: 0, //模式 0为机器人模式，1为专家模式
        userId: -3,
      };
    }
    Nav.navigate(path, {...params});
  };
  //   判断用户信息是否完善
  isPerfect = () => {
    let {userdata} = this.state;
    let keyArr = [
      'imageUrl',
      'name',
      'birthday',
      'sex',
      'height',
      'weight',
      'bloodType',
      'city',
      'county',
      'province',
      'wasSmoke',
      'wasWine',
      'sportsTime',
    ];
    for (const v of keyArr) {
      if (userdata[v] == undefined) {
        return true;
      }
    }
    return false;
  };
  render() {
    let {list, avatarList, userdata} = this.state;
    let userInfo = this.isPerfect();
    return (
      <View style={styles.container}>
        <Header centerComponent="我的" />
        <View
          style={{
            height: setSize(86),
          }}>
          <View
            style={{
              width: '120%',
              borderBottomLeftRadius: 70,
              backgroundColor: Color.primary,
              borderBottomRightRadius: 70,
              height: setSize(55),
              alignSelf: 'center',
            }}></View>
          <View
            style={{
              height: setSize(75),
              width: '94%',
              backgroundColor: '#fff',
              borderRadius: 8,
              alignSelf: 'center',
              position: 'absolute',
              bottom: 0,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            {/* 用户头像信息 */}
            <View style={{flexDirection: 'row'}}>
              <Avatar
                rounded
                icon={{name: 'user', type: 'antdesign'}}
                source={{uri: userdata.imageUrl}}
                size={setSize(29)}
                onPress={this._jumpTo.bind(this, userdata.userId)}
                containerStyle={{
                  marginTop: -setSize(13),
                  borderWidth: 3,
                  borderColor: '#fff',
                }}
              />
              <View
                style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <View
                  style={{
                    marginLeft: setSize(2),
                    marginTop: setSize(2),
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        color: Color.mainText,
                        fontSize: setSize(8),
                        maxWidth: setSize(50),
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      &nbsp;{userdata.name}&nbsp;
                    </Text>
                    <Icomoon
                      size={setSize(7)}
                      name={userdata.sex === 1 ? 'man' : 'woman'}
                      color={userdata.sex === 1 ? '#75C4EF' : '#FF768D'}
                    />
                    <Text
                      style={{
                        fontSize: setSize(5),
                        color: Color.infoText,
                        alignSelf: 'center',
                        marginLeft: setSize(5),
                      }}>
                      {userdata.age ? userdata.age : 0}岁
                    </Text>
                  </View>
                  {/* badge */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: setSize(2.5),
                    }}>
                    <Badge
                      value={userdata.homeUserId === -1 ? '主账号' : '成员'}
                      textStyle={{
                        color: Color.primary,
                        fontSize: setSize(5),
                      }}
                      badgeStyle={{
                        backgroundColor: Color.downPrimary,
                        height: 'auto',
                        paddingHorizontal: setSize(2),
                        paddingVertical: 1,
                      }}
                    />
                    <Text
                      style={{
                        color: Color.primary,
                        fontSize: setSize(5),
                        marginLeft: setSize(6),
                      }}>
                      {userdata.tel}
                    </Text>
                  </View>
                </View>
                {userInfo && (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => Nav.navigate('AddUser', {type: 'user'})}>
                    <ImageBackground
                      source={require('@/assets/icon/bg_noMsg.png')}
                      style={{
                        width: setSize(36),
                        height: setSize(9),
                        marginRight: setSize(7),
                      }}
                      resizeMode="stretch">
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: setSize(6),
                          textAlign: 'center',
                        }}>
                        &nbsp;信息未完善
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {/* 积分详情 */}
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  color: Color.primary,
                  fontSize: setSize(12),
                  fontWeight: '600',
                }}>
                {userdata.integral}
              </Text>
              <Text
                style={{
                  color: Color.minText,
                  fontSize: setSize(4.5),
                }}>
                我的积分
              </Text>
              {/* 数字滚动 */}
              {/* <Animatable.Text
                animation={{
                  from: {
                    opacity: 1,
                    transform: [{scale: 1}],
                    translateY: 30,
                  },
                  to: {
                    opacity: 0,
                    transform: [{scale: 1.5}],
                    translateY: 0,
                  },
                }}
                duration={1000}
                delay={0}
                useNativeDriver>
                滚动我
              </Animatable.Text> */}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                marginHorizontal: setSize(6),
                borderTopColor: Color.downBorder,
                borderTopWidth: 1,
              }}>
              {/* {['账户提现']} */}
              {avatarList.map((v, i) => {
                if (v.title === 'border') {
                  return (
                    <View
                      key={i + 'avit'}
                      style={{
                        backgroundColor: Color.minBorder,
                        width: 2,
                        height: setSize(8.5),
                      }}></View>
                  );
                } else {
                  return (
                    <TouchableOpacity
                      style={{
                        flex: 1,
                      }}
                      key={i + 'avit'}
                      activeOpacity={0.6}
                      onPress={() => Nav.navigate(v.path)}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: Color.infoText,
                          fontSize: setSize(8.5),
                        }}>
                        {v.title}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              })}
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: setSize(9),
            backgroundColor: '#fff',
          }}>
          {list.map((v, i) => (
            <TouchableOpacity
              key={i + 'weRec'}
              activeOpacity={0.5}
              onPress={() => this.jumpItem(v.path)}
              style={{
                height: setSize(22.5),
                flexDirection: 'row',
                marginHorizontal: 10,
                alignItems: 'center',
              }}>
              <View style={{marginHorizontal: 8}}>
                <Image
                  source={v.icon}
                  style={{
                    width: setSize(7.5),
                    height: setSize(7.5),
                  }}
                  placeholderStyle={{backgroundColor: 'transparent'}}
                  resizeMode="contain"
                />
              </View>
              <View
                style={{
                  flex: 1,
                  borderBottomWidth: i === list.length - 1 ? 0 : 1,
                  borderBottomColor: Color.minBorder,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: setSize(6.5),
                    color: Color.mainText,
                  }}>
                  {v.title}
                </Text>
                <Icon
                  name="right"
                  type="antdesign"
                  color={Color.minText}
                  size={setSize(8)}
                />
              </View>
            </TouchableOpacity>
          ))}
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
});
function filter(state) {
  return {
    userdata: state.userdata,
  };
}
export default connect(filter)(My);
