import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import {Avatar, Image, Badge, Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import Nav from '@/navigators/NavigationService';
import FlatScroll from '@/component/FlatScroll';
import moment from 'moment';
import {connect} from 'react-redux';
import Spinkit from 'react-native-spinkit';
import toast from '@/utils/toastMsg';
import {Color, setSize} from '@/utils/global.js';
import {geolocationInit, getCurrentPosition} from '@/utils/location.js';
import {getCommunity, focusTA, unFocusTA, likeNewsZan} from '@/apis/api';
class Recommended extends Component {
  constructor(props) {
    super(props);
    props.onRef(this); //让父组件调用子组件的方法
    this.state = {
      data: [],
      //   顶部距离搜索
      searchGroup: [
        {label: '1公里内', value: 1},
        {label: '5公里内', value: 5},
        {label: '10公里内', value: 10},
      ],
      loading: true, //加载状态
      searchAct: 1, //选中的公里
      longitude: '', //经度
      latitude: '', //维度
      isNextPage: false,
      pages: {
        //分页
        page: 1,
        size: 10,
      },
      fullText: [], //（全文/收起）状态列表
      authorization: false, //是否授权访问地理位置
    };
  }
  // 数据
  async componentDidMount() {
    // 对于 Android 需要自行根据需要申请权限
    let res = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    );
    if (res === 'denied') {
      toast.show('为了您更好的体验，请允许我们访问您的位置');
      this.setState({
        loading: false,
      });
      return;
    }
    geolocationInit(); //初始化
    getCurrentPosition(position => {
      this.setState(
        {
          authorization: true,
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        },
        () => {
          this.searchFn();
        },
      );
    });
  }
  //   搜索数据
  searchFn = async callback => {
    let {longitude, searchAct, latitude, pages, authorization} = this.state;
    if (!authorization) {
      toast.show('为了您更好的体验，请允许我们访问您的位置');
      callback && callback(true);
      this.setState({
        loading: false,
      });
      return;
    }
    let params = {
      page: pages.page,
      size: pages.size,
      data: {
        longitude,
        distance: searchAct,
        latitude,
      },
    };
    try {
      let res = await getCommunity(params);
      //   console.log(res.data);
      this.setState(state => ({
        data:
          pages.page === 1
            ? res.data.records
            : [...state.data, ...res.data.records],
        loading: false,
        isNextPage: res.data.current === res.data.pages,
      }));
      //   判断当前页是否为最后一页
      callback && callback(true);
    } catch (error) {
      console.log('error', error);
    }
  };
  //   关注
  focusFn = (id, focus) => {
    if (focus) {
      unFocusTA({uid: id}).then(res => {
        this.setState(state => ({
          data: [...state.data].map(v =>
            v.userId === id ? {...v, focus: !focus} : v,
          ),
        }));
      });
    } else {
      focusTA({uid: id}).then(res => {
        this.setState(state => ({
          data: [...state.data].map(v =>
            v.userId === id ? {...v, focus: !focus} : v,
          ),
        }));
      });
    }
  };

  //   点赞喜欢
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
  //   跳转到图片预览
  _jumpTo = obj => {
    const {path, params} = obj;
    Nav.navigate(path, params);
  };
  //   上边选项框改变事件
  _onChange = value => {
    this.setState(
      {
        searchAct: value,
        loading: true,
        pages: Object.assign({}, this.state.pages, {page: 1}),
      },
      () => {
        this.searchFn();
      },
    );
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
        this.searchFn(callback);
      },
    );
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
  //   过滤时间
  showTime = time => {
    if (!time) {
      return '';
    }
    let oldTime = moment(time).unix();
    let newTime = moment(moment().format('YYYY-MM-DD 00:00:00')).unix();
    if (oldTime > newTime) {
      return moment(time).format('HH:mm');
    }
    if (oldTime < newTime && newTime - oldTime > 86400) {
      //86400
      return moment(time).format('M月D日');
    } else {
      return moment(time).calendar();
    }
  };
  // 渲染子项
  renderItem = item => {
    let {fullText} = this.state;
    let imgs = item.imgs ? item.imgs.split(',') : [];
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: setSize(5),
          marginVertical: setSize(4),
          backgroundColor: '#fff',
          borderRadius: 8,
        }}>
        <Avatar
          rounded
          icon={{name: 'user', type: 'antdesign'}}
          source={{uri: item.avator}}
          size={setSize(20)}
          onPress={this._jumpTo.bind(this, {
            path: 'HisHome',
            params: {id: item.userId, reload: this.searchFn},
          })}
        />
        <View style={{flex: 1, marginLeft: setSize(2)}}>
          {/* 姓名  发布时间 是否关注 */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: setSize(20),
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Text
                style={{
                  fontSize: setSize(8),
                  color: Color.danger,
                  maxWidth: setSize(50),
                }}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.name}
              </Text>
              <Text
                style={{
                  fontSize: setSize(6),
                  color: Color.minText,
                }}>
                {this.showTime(item.time)}
              </Text>
            </View>
            {item.userId !== this.props.userdata.userId && (
              <Badge
                value={
                  item.focus ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Icon
                        name="checkcircle"
                        type="antdesign"
                        color={Color.primary}
                        size={setSize(7)}
                      />
                      <Text
                        style={{
                          color: Color.primary,
                          fontSize: setSize(6),
                        }}>
                        &nbsp;已关注
                      </Text>
                    </View>
                  ) : (
                    '关注TA'
                  )
                }
                textStyle={{
                  color: Color.primary,
                  fontSize: setSize(6),
                }}
                badgeStyle={{
                  backgroundColor: Color.downPrimary,
                  height: 'auto',
                  paddingHorizontal: 6,
                  paddingVertical: 3,
                  borderRadius: 4,
                }}
                activeOpacity={0.6}
                onPress={() => {
                  this.focusFn(item.userId, item.focus);
                }}
              />
            )}
          </View>
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
                  //多于一行时改为红色
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
          {imgs.length > 0 && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={this._jumpTo.bind(this, {
                path: 'ImgZoom',
                params: {imgArr: imgs},
              })}
              style={{
                borderRadius: 6,
                marginVertical: setSize(6),
                overflow: 'hidden',
              }}>
              <Image
                source={{uri: imgs[0]}}
                containerStyle={{
                  height: setSize(150),
                  width: '100%',
                }}
                imageStyle={{borderRadius: 6}}
              />

              {imgs.length > 1 && (
                <View
                  style={{
                    width: setSize(23),
                    height: setSize(23),
                    borderBottomRightRadius: 6,
                    borderTopLeftRadius: 6,
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                  }}>
                  <Text style={{color: '#fff'}}>{imgs.length}张</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: setSize(2),
              paddingBottom: setSize(10),
              marginTop: imgs.length ? 0 : setSize(6),
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
                &nbsp;评论
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: setSize(8),
              }}
              onPress={this.likeIt.bind(this, item.id)}>
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
      </View>
    );
  };
  render() {
    let {data, searchGroup, searchAct, pages, loading} = this.state;
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingVertical: setSize(5),
          }}>
          {searchGroup.map((v, i) => {
            return (
              <TouchableOpacity
                activeOpacity={0.5}
                key={i + 'searchS'}
                style={{
                  height: setSize(14),
                  width: setSize(40),
                  borderRadius: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                  marginHorizontal: i === 1 ? setSize(5) : 0,
                  borderColor: Color.downPrimary,
                  borderWidth: searchAct === v.value ? 1 : 0,
                }}
                onPress={() => this._onChange(v.value)}>
                <Text
                  style={{
                    fontSize: setSize(7),
                    color:
                      searchAct === v.value ? Color.primary : Color.infoText,
                  }}>
                  {v.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{alignItems: 'center'}}>
          <Spinkit isVisible={loading} color={Color.primary} type="Wave" />
        </View>
        <FlatScroll
          data={data}
          dropDown
          pull={data.length > pages.size}
          renderItem={this.renderItem}
          downRefresh={this._downRefresh}
          pullRefresh={this._pullRefresh}
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
function filter(state) {
  return {
    userdata: state.userdata,
  };
}
export default connect(filter)(Recommended);
