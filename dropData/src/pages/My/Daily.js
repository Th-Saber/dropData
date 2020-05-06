import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import FlatScroll from '@/component/FlatScroll';
import {Color, setSize} from '@/utils/global.js';
import {scoreType} from '@/utils/common.js';
import {Icon, Avatar, Badge, Image} from 'react-native-elements';
import Icomoon from 'react-native-vector-icons/Icomoon';
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {listUser, dailyList} from '@/apis/api';
export default class Daily extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actList: [
        {name: 'urine', title: '尿常规检测'},
        {name: 'life', title: '生命体征检测'},
      ],
      actName: 'urine',
      loading: false, // 数据加载状态  true为加载中
      opened: false, // 弹窗框打开状态
      userdata: {
        imageUrl: '',
        age: 0,
        uid: 0,
        tel: 18888888888,
        score: -1,
        sex: 1,
        name: '',
        homeUserId: -1,
        machineId: 0,
      },

      listdata: [], //详细数据相关
      userList: [], //用户列表
      userPages: {
        page: 1,
        size: 10,
      },
      isNextPage: false, //是否刷新
    };
  }
  componentDidMount() {
    // console.log(this.props.data.userdata);
    this.setState(
      {
        userdata: Object.assign({}, this.props.userdata, {
          uid: this.props.data.userdata.userId,
          age: this.props.data.userdata.age,
          sex: this.props.data.userdata.sex,
          tel: this.props.data.userdata.tel,
          name: this.props.data.userdata.name,
          imageUrl: this.props.data.userdata.imageUrl,
          homeUserId: this.props.data.userdata.homeUserId,
        }),
      },
      () => {
        this.searchUser();
        this.searchFn();
      },
    );
  }
  //   搜索用户数据列表
  searchUser = async callback => {
    let {userPages} = this.state;
    let params = {
      type: 3,
      ...userPages,
    };
    try {
      let res = await listUser(params);
      this.setState({
        userList: res.data.records,
        isNextPage: res.data.current === res.data.pages,
      });
      callback && callback(true);
    } catch (error) {
      console.log('error', error);
    }
  };
  //   搜索数据
  searchFn = async () => {
    let {actName, userdata} = this.state;
    let params = {
      uid: userdata.uid,
      machineType: actName === 'urine' ? 2 : 1,
    };
    try {
      let res = await dailyList(params);
      this.setState({
        userdata: Object.assign({}, this.state.userdata, {
          score: res.data.score,
          machineId: res.data.machineId,
        }),
        loading: false,
        listdata: res.data.abnormal,
      });
    } catch (error) {
      console.log(error);
    }
  };
  //   上拉刷新函数
  _pullRefresh = callback => {
    if (this.state.isNextPage) {
      callback();
      return;
    }
    this.setState(
      state => ({
        userPages: Object.assign({}, this.state.userPages, {
          page: ++state.userPages.page,
        }),
      }),
      () => {
        this.searchUser(callback);
      },
    );
  };
  //   点击跳转到数据详情页
  pressItem = item => {
    let {actName, userdata} = this.state;
    // console.log('数据详情', item);
    let data = {
      name: item.name,
      rangeMax: item.rangeMax,
      rangeMin: item.rangeMin,
      phName: item.phName,
      uid: userdata.uid,
      result: item.result ? item.result : 0,
      machineType: actName === 'urine' ? 2 : 1,
      machineId: userdata.machineId,
    };
    Nav.navigate('IndexDetail', {data});
  };
  //   选项卡改变函数
  actChange = val => {
    let {actName, loading} = this.state;
    if (loading || actName === val) {
      return;
    }
    this.setState(
      {
        actName: val,
        loading: true,
      },
      () => {
        this.searchFn();
      },
    );
  };
  //   选中的用户列表
  selectItem = item => {
    if (item.uid === this.state.userdata.uid) {
      this.setState({
        opened: false,
      });
      return;
    }
    let userdata = {
      imageUrl: item.imageUrl,
      age: item.age,
      uid: item.uid,
      tel: item.tel,
      sex: item.sex,
      name: item.name,
      homeUserId: item.isMaster ? -1 : 0,
    };
    this.setState(
      {
        opened: false,
        userdata: Object.assign({}, this.state.userdata, userdata),
      },
      () => {
        this.searchFn();
      },
    );
  };
  //   列表循环数据
  renderItem = () => {
    let {listdata} = this.state;
    let item = listdata.map((v, i) => {
      return (
        <TouchableOpacity
          key={i + 'liise'}
          activeOpacity={0.8}
          onPress={() => this.pressItem(v)}
          style={{
            flexDirection: 'row',
            paddingHorizontal: setSize(7),
            height: setSize(24),
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomColor: Color.downBorder,
            borderBottomWidth: i === listdata - 1 ? 0 : 1,
          }}>
          <Text
            style={{
              color: Color.infoText,
              fontSize: setSize(8),
              maxWidth: setSize(80),
            }}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {v.name}
          </Text>
          <Text
            style={{
              color: Color.infoText,
              fontSize: setSize(6),
            }}>
            {v.result ? v.result : 0}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: Color.mainText,
                fontSize: setSize(7),
              }}>
              {v.score}
              <Text
                style={{
                  color: Color.infoText,
                  fontSize: setSize(6),
                }}>
                分
              </Text>
            </Text>
            <View
              style={{
                marginRight: setSize(5),
                marginLeft: setSize(3),
              }}>
              <Icon
                type="ionicon"
                name={
                  v.compare > 0 ? 'ios-arrow-round-up' : 'ios-arrow-round-down'
                }
                size={setSize(12)}
                color={v.compare > 0 ? Color.danger : Color.success}
              />
            </View>
            <Icon
              type="antdesign"
              color={Color.minText}
              size={setSize(6)}
              name="right"
            />
          </View>
        </TouchableOpacity>
      );
    });
    return item;
  };
  // 循环列表用户
  _renderList = (item, index) => {
    let {userdata} = this.state;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => this.selectItem(item)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: setSize(4),
          backgroundColor:
            userdata.uid === item.uid ? Color.deepPrimary : 'tansprent',
        }}>
        <Avatar
          rounded
          icon={{name: 'user', type: 'antdesign'}}
          size={setSize(16)}
          containerStyle={{
            borderColor: '#fff',
          }}
        />
        <Text
          style={{
            marginLeft: setSize(10),
            color: Color.mainText,
            fontSize: setSize(6),
          }}>
          {item.name}
        </Text>
        <Badge
          value={item.isMaster ? '主账号' : '成员'}
          textStyle={{
            color: Color.primary,
            fontSize: setSize(5),
          }}
          badgeStyle={{
            backgroundColor: Color.downPrimary,
            height: 'auto',
            marginLeft: setSize(4),
            paddingHorizontal: setSize(2),
            paddingVertical: 1,
          }}
        />
      </TouchableOpacity>
    );
  };
  //   弹出窗口数据展示
  menuWindow = () => {
    let {opened, userList, userPages} = this.state;
    return (
      <Menu
        opened={opened}
        onBackdropPress={() => this.setState({opened: false})}>
        <MenuTrigger>
          <TouchableOpacity
            hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
            onPress={() => this.setState(state => ({opened: !state.opened}))}
            style={{alignItems: 'center'}}>
            <Image
              source={require('@/assets/icon/icon_change.png')}
              style={{width: setSize(9), height: setSize(9)}}
              resizeMode="contain"
              placeholderStyle={{backgroundColor: 'transparent'}}
            />
            <Text
              style={{
                color: Color.infoText,
                fontSize: setSize(5),
              }}>
              切换
            </Text>
          </TouchableOpacity>
        </MenuTrigger>
        <MenuOptions
          optionsContainerStyle={{
            marginTop: setSize(10),
            paddingVertical: setSize(4),
            width: '80%',
            borderRadius: 8,
          }}>
          <FlatScroll
            data={userList}
            containerStyle={{maxHeight: setSize(100)}}
            borderStyle={{
              height: 1,
              backgroundColor: Color.downBorder,
              paddingHorizontal: 0,
            }}
            pull={userList.length > userPages.size}
            pullRefresh={this._pullRefresh}
            renderItem={this._renderList}
          />
        </MenuOptions>
      </Menu>
    );
  };
  //   顶级render组件
  render() {
    let {actList, actName, loading, userdata, listdata} = this.state;
    let newAvatar = {};
    if (userdata.imageUrl) {
      newAvatar.source = {
        uri: userdata.imageUrl,
      };
    } else {
      newAvatar.icon = {name: 'user', type: 'antdesign'};
    }
    return (
      <MenuProvider>
        <View style={styles.container}>
          <Header back centerComponent="健康日报" />
          {/* 顶部选项卡功能 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            {actList.map((v, i) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={i + 'actList'}
                  style={{
                    marginRight: i === 0 ? setSize(32) : 0,
                    paddingTop: setSize(6),
                    paddingBottom: setSize(3),
                  }}
                  onPress={() => this.actChange(v.name)}>
                  <Text
                    style={{
                      fontSize: setSize(8),
                      color:
                        actName === v.name ? Color.primary : Color.mainText,
                    }}>
                    {v.title}
                  </Text>
                  {actName === v.name && (
                    <View
                      style={{
                        width: setSize(18),
                        height: 2,
                        backgroundColor: Color.primary,
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}></View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          <View
            style={{
              paddingHorizontal: setSize(6),
              marginTop: setSize(6),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: setSize(6),
                borderRadius: 8,
                backgroundColor: '#fff',
                height: setSize(35),
              }}>
              {/* 头像 */}
              <Avatar rounded {...newAvatar} size={setSize(25)} />
              {/* 头像右侧用户相关信息 */}

              <View style={{marginLeft: setSize(5), flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: Color.mainText,
                      fontSize: setSize(7.5),
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
                      fontSize: setSize(4),
                      color: Color.infoText,
                      alignSelf: 'center',
                      marginLeft: setSize(4),
                    }}>
                    {userdata.age}岁
                  </Text>
                </View>
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
                      borderRadius: 20,
                      height: 'auto',
                      paddingHorizontal: setSize(2),
                      paddingVertical: 1,
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: setSize(8),
                    color: Color.mainText,
                  }}>
                  {userdata.score}
                  <Text
                    style={{
                      color: Color.infoText,
                      fontSize: setSize(6),
                    }}>
                    &nbsp;分
                  </Text>
                  <Text style={{color: scoreType(userdata.score).color}}>
                    &emsp;{scoreType(userdata.score).name}
                  </Text>
                </Text>
                {this.menuWindow()}
              </View>
            </View>
            {/* 内容标题 */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: setSize(8),
                paddingHorizontal: setSize(6),
              }}>
              <Text
                style={{
                  fontSize: setSize(7),
                  color: Color.mainText,
                }}>
                需重点观察的指标
              </Text>
              <Text
                style={{
                  color: Color.danger,
                  fontSize: setSize(7),
                }}>
                {listdata.length}项
              </Text>
            </View>
            {/* 数据列表渲染 */}
            <ScrollView
              style={{
                backgroundColor: '#fff',
                borderRadius: 6,
              }}>
              {loading ? (
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: setSize(4),
                  }}>
                  <ActivityIndicator color="#f60" />
                  <Text
                    style={{
                      color: Color.minText,
                      fontSize: setSize(6),
                    }}>
                    加载中...
                  </Text>
                </View>
              ) : (
                this.renderItem()
              )}
            </ScrollView>
            {/* 加载状态 */}
          </View>
        </View>
      </MenuProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bgColor,
  },
});
