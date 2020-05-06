import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Image, Avatar, Icon, Badge} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import MsgBox from '@/component/MsgBox';
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import FlatScroll from '@/component/FlatScroll';
import {Color, setSize} from '@/utils/global.js';
import Icomoon from 'react-native-vector-icons/Icomoon';
import moment from 'moment';
import {
  getFocusUserInfo,
  getNewsInfoTwo,
  likeNewsZan,
  delNews,
} from '@/apis/api';
import toast from '@/utils/toastMsg';
const {width} = Dimensions.get('window');
export default class HisHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userdata: {
        resembleProductName: [],
        userSize: 0,
        followSize: 0,
      },
      data: [], //分页数据
      isNextPage: false, //是否为最后一页
      isSelf: false, //是否是自己的主页
      fullText: [], //（全文/收起）状态列表
      pages: {
        page: 1,
        size: 10,
      },
      opened: false, //信息框打开状态
      delId: 0, //动态删除的id
    };
  }
  componentDidMount() {
    let id = this.props.navigation.getParam('id');
    if (id === this.props.data.userdata.userId) {
      this.setState({
        isSelf: true,
      });
    }
    this.searchFn();
  }
  //   进入页面搜索数据
  searchFn = async callback => {
    let {page, size} = this.state.pages;
    let params = {
      userId: this.props.navigation.getParam('id'),
      page,
      size,
    };
    try {
      let res = await getFocusUserInfo(params);
      //   console.log('res，', res.data);
      let listData = res.data.communitys;
      let isNextPage = listData.current === listData.pages;
      delete res.data.communitys;
      this.setState({
        userdata: res.data,
        data: listData.records,
        isNextPage,
      });
      callback && callback(true);
    } catch (error) {
      console.log('请求失败', error);
    }
  };
  //  搜索发布的动态
  searchNews = async callback => {
    let {pages} = this.state;
    let params = {
      ...pages,
      userId: this.props.navigation.getParam('id'),
    };
    try {
      let res = await getNewsInfoTwo(params);
      //   console.log('书韩剧', res);
      this.setState(state => ({
        data:
          pages.page === 1
            ? res.data.records
            : [...state.data, ...res.data.records],
        isNextPage: res.data.current === res.data.pages,
      }));
      callback && callback(true);
    } catch (error) {
      console.log('二级请求出错', error);
    }
  };
  //   显示ph值名称
  showType = val => {
    switch (val) {
      case 'ph01':
        return '白细胞';
      case 'ph02':
        return '亚硝酸盐';
      case 'ph03':
        return '尿胆原';
      case 'ph04':
        return '蛋白质';
      case 'ph05':
        return '酸碱度';
      case 'ph06':
        return '潜血';
      case 'ph07':
        return '比重';
      case 'ph08':
        return '酮体';
      case 'ph09':
        return '胆红素';
      case 'ph10':
        return '葡萄糖';
      case 'ph11':
        return '抗坏血酸';
      case 'ph12':
        return '钙';
      case 'ph13':
        return '肌酐';
      case 'ph14':
        return '微量白蛋白';
      case 'ph17':
        return '血氧';
      case 'ph18':
        return '心率';
      default:
        return '';
    }
  };
  //   跳转到预览图片
  _jumpImg = (imgs, index) => {
    Nav.navigate('ImgZoom', {imgArr: imgs, index});
  };
  //   跳转到图片预览
  _jumpTo = obj => {
    const {path, params} = obj;
    Nav.navigate(path, params);
  };
  //   上拉刷新函数
  _pullRefresh = callback => {
    if (this.state.isNextPage) {
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
        this.searchNews(callback);
      },
    );
  };
  //  显示msgBox
  showMsgBox = id => {
    if (!this.state.isSelf) return;
    this.setState(
      {
        delId: id,
      },
      () => {
        this.msgbox && this.msgbox.open(4000);
      },
    );
  };
  //   删除动态
  _delItem = async () => {
    let {data, delId} = this.state;
    try {
      await delNews({communityId: delId});
      let arr = [...data];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === delId) {
          arr.splice(i, 1);
          break;
        }
      }
      this.setState(
        {
          data: arr,
        },
        () => {
          let reload = this.props.navigation.getParam('reload');
          reload && reload();
          toast.show('删除动态成功');
        },
      );
    } catch (error) {
      console.log('删除动态失败', error);
    }
  };
  //  下拉刷新
  _downRefresh = callback => {
    this.setState(
      {
        pages: Object.assign({}, this.state.pages, {page: 1}),
      },
      () => {
        this.searchNews(callback);
      },
    );
  };
  //   喜欢
  likeIt = async id => {
    try {
      await likeNewsZan({communityId: id});
      this.setState(state => ({
        data: [...state.data].map(v =>
          v.id === id ? {...v, like: !v.like} : v,
        ),
      }));
    } catch (error) {
      console.log('点赞失败', error);
    }
  };
  //  关注 取消关注
  focusFn = () => {
    let {userdata} = this.state;
    let callback = this.props.navigation.getParam('callback');
    if (userdata.wasFollow) {
      unFocusTA({uid: userdata.userId}).then(res => {
        this.setState(
          {
            userdata: Object.assign({}, this.state.userdata, {
              wasFollow: !userSize.wasFollow,
              userSize: userdata.userSize--,
            }),
          },
          () => {
            callback && callback();
          },
        );
      });
    } else {
      focusTA({uid: userdata.userId}).then(res => {
        this.setState(
          {
            userdata: Object.assign({}, this.state.userdata, {
              wasFollow: !userdata.wasFollow,
              userSize: userdata.userSize++,
            }),
          },
          () => {
            callback && callback();
          },
        );
      });
    }
  };
  // 渲染子项
  renderItem = item => {
    let {fullText} = this.state;
    let newImgs = item.imgs ? item.imgs.split(',') : 0;
    return (
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={this.showMsgBox.bind(this, item.id)}
        style={{
          padding: setSize(5),
          marginBottom: setSize(6),
          backgroundColor: '#fff',
          borderRadius: 8,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: setSize(7),
              color: Color.infoText,
            }}>
            {moment(item.time).format('LL')}
          </Text>
          <Text
            style={{
              fontSize: setSize(6),
              color: Color.infoText,
            }}>
            {moment(item.time).format('HH:mm')}
          </Text>
        </View>
        <View style={{flex: 1, marginLeft: setSize(2)}}>
          {/* 姓名  发布时间 是否关注 */}
          <View
            style={{
              paddingRight: setSize(5),
              marginTop: setSize(6),
            }}>
            <Text
              style={{
                fontSize: setSize(7),
                lineHeight: setSize(10),
                color: Color.mainText,
              }}
              numberOfLines={fullText.indexOf(item.id) !== -1 ? 0 : 3}
              onLayout={e => {
                if (e.nativeEvent.layout.height > setSize(10) * 2) {
                  //多于三行时全文按钮显示
                  item.flag = true;
                }
              }}
              ellipsizeMode="tail">
              {item.title}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{width: setSize(18)}}
              hitSlop={{
                top: 20,
                left: 20,
                right: 20,
                bottom: 20,
              }}
              onPress={() => {
                const listData = [...fullText]; //复制数组--浅拷贝
                let isIndex = listData.indexOf(item.id);
                isIndex !== -1
                  ? listData.splice(isIndex, 1)
                  : listData.splice(0, 0, item.id);
                this.setState({
                  fullText: listData,
                });
              }}>
              {item.flag && (
                <Text
                  style={{
                    fontSize: setSize(7),
                    color: Color.danger,
                    width: setSize(30),
                  }}>
                  {fullText.indexOf(item.id) !== -1 ? '收起' : '全文'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {newImgs.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                marginLeft: setSize(-2),
              }}>
              {[0, 1, 2].map(v => {
                if (v + 1 > newImgs.length) {
                  return null;
                }
                return (
                  <View
                    key={v + 'test'}
                    style={{
                      borderRadius: 6,
                      height: (width - setSize(12) * 2) / 3,
                      width: (width - setSize(12) * 2) / 3,
                      padding: 6,
                      paddingRight: 0,
                      overflow: 'hidden',
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={this._jumpImg.bind(this, newImgs, v)}>
                      <Image
                        source={{uri: newImgs[v]}}
                        //   source={require('@/assets/imgs/goods.jpg')}
                        containerStyle={{
                          height: '100%',
                          width: '100%',
                        }}
                        imageStyle={{borderRadius: 6}}
                      />
                      {newImgs.length > 3 && v === 2 && (
                        <View
                          style={{
                            width: setSize(15),
                            height: setSize(15),
                            borderBottomRightRadius: 6,
                            borderTopLeftRadius: 6,
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                          }}>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: setSize(6),
                            }}>
                            {newImgs.length - 3}张
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: setSize(2),
              paddingBottom: setSize(10),
              marginTop: newImgs.length ? 0 : setSize(6),
            }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={this._jumpTo.bind(this, {
                path: 'Comments',
                params: {communityId: item.id},
              })}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon
                name="message1"
                type="antdesign"
                color={Color.infoText}
                size={setSize(7)}
              />
              <Text
                style={{
                  color: Color.infoText,
                  fontSize: setSize(7),
                }}>
                &nbsp;{item.commendCount}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: setSize(8),
              }}
              onPress={() => this.likeIt(item.id)}>
              <Icon
                name={item.like ? 'heart' : 'hearto'}
                type="antdesign"
                color={item.like ? Color.danger : Color.infoText}
                size={setSize(7)}
              />
              <Text
                style={{
                  color: Color.infoText,
                  fontSize: setSize(7),
                }}>
                &nbsp;赞
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  //跳转到消息
  jumpMsg = () => {
    let {isSelf, userdata} = this.state;
    if (isSelf) return;
    let params = {
      username: userdata.name,
      avator: userdata.avator,
      userId: userdata.userId,
    };
    Nav.navigate('MsgDetial', {item: params});
  };
  //   近四十
  jumpBook = val => {
    let {isSelf} = this.state;
    if (!isSelf) return;
    Nav.navigate('AddressBook', {active: val});
  };
  _renderList = item => {
    return (
      <View style={{padding: setSize(4), alignItems: 'center'}}>
        <Text style={{color: Color.mainText, fontSize: setSize(6)}}>
          {this.showType(item)}
        </Text>
      </View>
    );
  };
  //   弹出窗口数据展示
  menuWindow = data => {
    let {opened} = this.state;
    return (
      <Menu
        opened={opened}
        onBackdropPress={() => this.setState({opened: false})}>
        <MenuTrigger>
          <TouchableOpacity
            hitSlop={{
              left: 20,
              right: 20,
              top: 20,
              bottom: 20,
            }}
            onPress={() =>
              this.setState(state => ({
                opened: !state.opened,
              }))
            }>
            <Text
              style={{
                fontSize: setSize(7),
                color: Color.primary,
                marginTop: setSize(6),
                marginLeft: setSize(4),
              }}>
              {data.length > 0
                ? this.showType(data[0]) + `等${data.length}项匹配相似`
                : '暂无匹配项'}
            </Text>
          </TouchableOpacity>
        </MenuTrigger>
        <MenuOptions
          optionsContainerStyle={{
            marginTop: setSize(10),
            paddingVertical: setSize(4),
            width: '40%',
            borderRadius: 8,
          }}>
          <FlatScroll
            data={data}
            containerStyle={{
              maxHeight: setSize(100),
              backgroundColor: Color.deepPrimary,
            }}
            borderStyle={{
              height: 1,
              backgroundColor: Color.downBorder,
              paddingHorizontal: 0,
            }}
            renderItem={this._renderList}
          />
        </MenuOptions>
      </Menu>
    );
  };
  render() {
    let {userdata, pages, data, isSelf} = this.state;
    return (
      <MenuProvider>
        <View style={styles.container}>
          <Header
            back
            centerComponent={isSelf ? '我的主页' : 'TA主页'}
            rightComponent={() => {
              if (isSelf) {
                return null;
              } else {
                return (
                  <Icon
                    type="octicon"
                    name="comment-discussion"
                    color="#fff"
                    size={20}
                  />
                );
              }
            }}
            RightOnPress={this.jumpMsg}
          />
          {/* 头部 */}
          <View
            style={{
              height: setSize(58),
              width: '100%',
            }}>
            <View
              style={{
                height: setSize(27),
                backgroundColor: Color.primary,
                width: '120%',
                alignSelf: 'center',
                borderBottomRightRadius: 90,
                borderBottomLeftRadius: 90,
              }}></View>
            <View
              style={{
                width: '94%',
                backgroundColor: '#fff',
                borderRadius: 8,
                alignSelf: 'center',
                position: 'absolute',
                marginTop: setSize(4),
                padding: setSize(4),
                top: 0,
              }}>
              {/* 用户头像信息 */}
              <View style={{flexDirection: 'row'}}>
                <Avatar
                  rounded
                  icon={{name: 'user', type: 'antdesign'}}
                  source={{uri: userdata.avator}}
                  size={setSize(27)}
                  containerStyle={{}}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
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
                    </View>
                    <Text
                      style={{
                        fontSize: setSize(5),
                        color: Color.infoText,
                        alignSelf: 'center',
                        width: setSize(16),
                        marginLeft: setSize(5),
                        alignSelf: 'flex-start',
                      }}>
                      {userdata.age ? userdata.age : 0}岁
                    </Text>
                  </View>
                </View>
                {/* 关注粉丝 */}

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => this.jumpBook('focus')}
                  style={{
                    width: setSize(35),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: Color.mainText,
                      fontSize: setSize(7),
                    }}>
                    {userdata.followSize}
                  </Text>
                  <Text
                    style={{
                      color: Color.infoText,
                      fontSize: setSize(7),
                    }}>
                    关注
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => this.jumpBook('fans')}
                  style={{
                    width: setSize(35),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: Color.mainText,
                      fontSize: setSize(7),
                    }}>
                    {userdata.userSize}
                  </Text>
                  <Text
                    style={{
                      color: Color.infoText,
                      fontSize: setSize(7),
                    }}>
                    粉丝
                  </Text>
                </TouchableOpacity>
              </View>
              {!isSelf && this.menuWindow(userdata.resembleProductName)}
            </View>
          </View>
          {/* 动态列表 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: setSize(6),
              marginBottom: setSize(3),
            }}>
            <Text
              style={{
                fontSize: setSize(8),
                color: Color.mainText,
              }}>
              &nbsp;动态
            </Text>
            {!isSelf && (
              <Badge
                value={userdata.wasFollow ? '已关注' : '点击关注'}
                textStyle={{
                  color: Color.primary,
                  fontSize: setSize(6),
                }}
                badgeStyle={{
                  borderColor: Color.primary,
                  height: 'auto',
                  backgroundColor: '#fff',
                  borderRadius: 4,
                  width: setSize(29),
                  paddingHorizontal: setSize(2),
                  paddingVertical: 1,
                }}
                onPress={this.focusFn}
              />
            )}
          </View>
          {/* 列表数据 */}
          <FlatScroll
            data={data}
            dropDown
            pull={data.length > pages.size}
            renderItem={this.renderItem}
            downRefresh={this._downRefresh}
            pullRefresh={this._pullRefresh}
          />
          {/* 发布按钮 */}
          {isSelf && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.news}
              onPress={() => {
                Nav.navigate('ReleaseNews', {
                  reload: this._downRefresh,
                });
              }}>
              <Text
                style={{
                  fontSize: setSize(8),
                  color: '#fff',
                  marginLeft: 10,
                }}>
                发布
              </Text>
            </TouchableOpacity>
          )}
          {/* 消息弹出框 */}
          <MsgBox ref={e => (this.msgbox = e)} itemPress={this._delItem} />
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
  news: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: setSize(23),
    width: setSize(30),
    right: 0,
    bottom: setSize(26),
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: Color.primary,
  },
});
