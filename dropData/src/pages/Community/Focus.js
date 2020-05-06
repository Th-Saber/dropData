import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import {Avatar, Image, Badge, Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import Nav from '@/navigators/NavigationService';
import FlatScroll from '@/component/FlatScroll';
import moment from 'moment';
import Spinkit from 'react-native-spinkit';
import {Color, setSize} from '@/utils/global.js';
import {getFocus, likeNewsZan} from '@/apis/api';
export default class Focus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      //   顶部距离搜索
      loading: false, //加载状态
      pages: {
        //分页
        page: 1,
        size: 10,
      },
      isNextPage: false,
      fullText: [], //（全文/收起）状态列表
    };
  }
  // 数据
  componentDidMount() {
    this.searchFn();
  }
  //   搜索数据
  searchFn = async callback => {
    let {pages} = this.state;
    try {
      let res = await getFocus(pages);
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
  focusFn = id => {
    console.log('id', id);
    // this.viewAnima
    //   .animate(
    //     {
    //       0: {
    //         opacity: 0,
    //         translateY: 5,
    //       },
    //       1: {
    //         opacity: 1,
    //         translateY: -10,
    //       },
    //     },
    //     1000,
    //   )
    //   .then(endState =>
    //     console.log(endState.finished ? '动画完成了' : 'bounce cancelled'),
    //   );
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
  //   跳转到页面
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
    let newImgs = item.imgs ? item.imgs.split(',') : [];
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: setSize(5),
          //   marginTop: setSize(8),
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
            params: {id: item.createBy},
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
                !item.focus && this.focusFn(item.id);
              }}
            />
            {/* <Animatable.Text
              ref={ref => {
                this.viewAnima = ref;
              }}
              style={{
                position: 'absolute',
                right: setSize(12),
                top: 0,
                color: Color.primary,
              }}
              duration={1000}
              delay={0}
              useNativeDriver>
              +1
            </Animatable.Text> */}
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
          {newImgs.length > 0 && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={this._jumpTo.bind(this, {
                path: 'ImgZoom',
                params: {imgArr: newImgs},
              })}
              style={{
                borderRadius: 6,
                marginVertical: setSize(6),
                overflow: 'hidden',
              }}>
              <Image
                source={{uri: newImgs[0]}}
                containerStyle={{
                  height: setSize(150),
                  width: '100%',
                }}
                imageStyle={{borderRadius: 6}}
              />
              {newImgs.length > 1 && (
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
                  <Text style={{color: '#fff'}}>{newImgs.length}张</Text>
                </View>
              )}
            </TouchableOpacity>
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
      </View>
    );
  };
  render() {
    let {data, pages, loading} = this.state;
    return (
      <View style={styles.container}>
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
