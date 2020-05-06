import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  PanResponder,
} from 'react-native';
// import Swiper from 'react-native-swiper';
import SwiperFlatList from 'react-native-swiper-flatlist';
import {Icon, Image} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import {
  indexInfo,
  indexTipInfo,
  indexInfoHistory,
  findSlideImg,
} from '@/apis/api';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import {Color, setSize, getBarHeight} from '@/utils/global.js';
import {storage} from '@/storage';
import toast from '@/utils/toastMsg';
const {width} = Dimensions.get('window');
class Home extends Component {
  constructor(props) {
    super(props);
    this.show = true; //是否显示=
    this.spaceHeight = setSize(204.5); //手势响应盒子高度 //setSize(204.5)
    this.layoutHeight = getBarHeight(); //距离顶部偏移距离
    this.minDistance = 40; //响应最小距离  低于这个距离直接回弹
    this._spaceStyles = {};
    this.state = {
      swiperList: [
        // {uri: require('@/assets/imgs/3.jpg')},
        // {uri: require('@/assets/imgs/3.jpg')},
        // {uri: require('@/assets/imgs/3.jpg')},
      ],
      //   首页分数
      scoreArr: [
        {
          name: '综合指数',
          score: 0,
          subScore: 0,
          icon: require('@/assets/icon/trend.png'),
        },
        {
          name: '我的积分',
          score: 0,
          subScore: 0,
          icon: require('@/assets/icon/integration.png'),
        },
      ],
      //   按钮组
      btnGroup: [
        {
          name: 'location',
          title: '实时位置',
        },
        {
          name: 'track',
          title: '历史轨迹',
        },
      ],
      tipList: [],
      btnAct: 'location', //按钮组激活索引
      showDown: false, //是否显示
      webViewData: '',
    };
  }
  componentWillMount() {
    this.PanResponderFns();
  }
  componentDidMount() {
    this.search();
    this.searchInfo();
    this.findSlideFn();
  }
  //   首页数据搜索
  searchInfo = async () => {
    try {
      let res = await indexTipInfo();
      this.setState({
        tipList: res.data,
      });
    } catch (error) {
      console.log('error', error);
    }
  };
  //   动态调整高度
  updateNativeStyles = () => {
    this.space && this.space.setNativeProps(this._spaceStyles);
  };
  //   获取轮播图
  findSlideFn = async () => {
    try {
      let res = await findSlideImg();
      this.setState({
        swiperList: res.data,
      });
    } catch (error) {
      console.log('轮播获取失败', error);
    }
  };
  //   手势
  PanResponderFns = () => {
    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (Math.abs(gestureState.dy) < 10) {
          return false;
        } else {
          return true;
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        // 最近一次的移动距离为gestureState.move{X,Y}
        if (
          (this.show && gestureState.dy < 0) ||
          (!this.show && gestureState.dy > 0)
        ) {
          let layoutHeight =
            gestureState.dy < 0 ? this.spaceHeight : this.layoutHeight;
          this._spaceStyles.style.height = layoutHeight + gestureState.dy;
          this._spaceStyles.style.opacity =
            this._spaceStyles.style.height / this.spaceHeight;
          if (
            this._spaceStyles.style.height >= 0 &&
            this._spaceStyles.style.height <= this.spaceHeight
          ) {
            this.updateNativeStyles();
          }
        }
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
      },
      //是否可以释放响应者角色让给其他组件
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        // 一般来说这意味着一个手势操作已经成功完成。
        if (gestureState.dy <= -1 * this.minDistance && this.show) {
          this._spaceStyles.style.height = this.layoutHeight;
          this._spaceStyles.style.opacity = 0.3;
          this.show = false;
          this.setState({
            showDown: true,
          });
          this.updateNativeStyles();
        } else if (gestureState.dy >= this.minDistance && !this.show) {
          this._spaceStyles.style.height = this.spaceHeight;
          this._spaceStyles.style.opacity = 1;
          this.show = true;
          this.setState({
            showDown: false,
          });
          this.updateNativeStyles();
        } else {
          this._spaceStyles.style.height = this.show
            ? this.spaceHeight
            : this.layoutHeight;
          this._spaceStyles.style.opacity = this.show ? 1 : 0.3;
          this.updateNativeStyles();
        }
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
        // 默认返回true。目前暂时只支持android。
        return true;
      },
    });
    this._spaceStyles = {
      style: {
        height: this.spaceHeight,
      },
    };
  };
  search = async () => {
    try {
      let res = await indexInfo();
      const listData = [...this.state.scoreArr]; //复制数组--浅拷贝
      let params = {
        type: 'initialData',
        data: {
          familyArr: res.data.family,
          historyArr: res.data.historyRoute,
          userId: this.props.userId,
        },
      };
      //   console.log('data', params.data);
      //   this.webview.postMessage(JSON.stringify(params));
      this.setState({
        webViewData: params,
        scoreArr: listData.map((v, i) => {
          if (i === 0) {
            return {
              ...v,
              score: res.data.score,
              subScore: res.data.addScore,
            };
          } else {
            return {
              ...v,
              score: res.data.integral,
              subScore: res.data.addIntegral,
            };
          }
        }),
      });
      //   存储积分支出详情
      storage.save('scoreInfo', {
        addScore: res.data.addScore,
        addIntegral: res.data.addIntegral,
      });
    } catch (error) {
      console.log('错误', error);
    }
  };
  //   根据id搜索历史记录
  searchHistory = async params => {
    console.log('params', params);
    try {
      let res = await indexInfoHistory(params);
      let obj = {
        type: 'searchHistory',
        data: res.data,
      };
      //   console.log(obj);
      this.webview.postMessage(JSON.stringify(obj));
    } catch (error) {
      console.log('搜索错误', error);
    }
  };
  //  改变激活状态
  changeBtn = name => {
    let params = {
      type: 'change',
      data: name,
    };
    this.webview.postMessage(JSON.stringify(params));
    this.setState({
      btnAct: name,
    });
  };
  _onMessage = event => {
    let {type, data} = JSON.parse(event.nativeEvent.data);
    switch (type) {
      case 'searchHistory': //搜索历史记录
        this.searchHistory(data);
        break;
      case 'toast': //搜索历史记录
        toast.show(data, 2000);
        break;
      case 'inputFocus':
        console.log('上海市', this.show);
        if (this.show) {
          this._spaceStyles.style.height = this.layoutHeight;
          this._spaceStyles.style.opacity = 0.3;
          this.show = false;
          this.setState({
            showDown: true,
          });
          this.updateNativeStyles();
        }
        break;
      default:
        break;
    }
  };

  render() {
    let {swiperList, btnGroup, btnAct, scoreArr, tipList} = this.state;
    return (
      <View style={{flex: 1}}>
        <View {...this._panResponder.panHandlers}>
          <View
            ref={space => (this.space = space)}
            style={{height: this.spaceHeight}}>
            <View style={{height: setSize(116), width}}>
              <SwiperFlatList
                autoplay={swiperList.length > 1}
                autoplayLoop={swiperList.length > 1}
                autoplayDelay={2}>
                {swiperList.map((v, i) => {
                  return (
                    <View
                      style={{flex: 1, height: setSize(116)}}
                      key={i + 'img'}>
                      <Image
                        key={i + 'swiper'}
                        source={{uri: v.uri}}
                        style={{width, height: setSize(116)}}
                        resizeMode="stretch"
                        placeholderStyle={{
                          backgroundColor: 'transparent',
                        }}
                      />
                    </View>
                  );
                })}
              </SwiperFlatList>
            </View>
            {/* 首页统计数据 */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: setSize(8),
              }}>
              {scoreArr.map((v, i) => {
                return (
                  <View
                    key={i + 'score'}
                    style={[
                      styles.baner,
                      {
                        backgroundColor: i === 0 ? '#55B569' : '#38A9FC',
                        marginLeft: i === 0 ? 0 : setSize(4),
                        justifyContent: 'space-between',
                      },
                    ]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: setSize(7),
                        }}>
                        {v.name}
                      </Text>
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: setSize(5),
                        }}>
                        {v.subScore > 0 ? `+${v.subScore}` : v.subScore}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingLeft: 10,
                      }}>
                      <Image
                        source={v.icon}
                        style={{
                          width: setSize(14.5),
                          height: setSize(14.5),
                        }}
                        placeholderStyle={{
                          backgroundColor: 'transparent',
                        }}
                      />
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: setSize(13),
                        }}>
                        {v.score}
                        &nbsp;
                        <Text style={{fontSize: setSize(6)}}>分</Text>
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            {/* 通告 */}
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: setSize(6),
                marginVertical: setSize(8),
                paddingVertical: setSize(3),
                borderColor: Color.downBorder,
                borderBottomWidth: 1,
                borderTopWidth: 1,
              }}>
              <Icon
                type="antdesign"
                name="sound"
                size={setSize(8)}
                color={Color.minText}
              />
              <View style={{height: setSize(8), marginLeft: setSize(6)}}>
                <SwiperFlatList
                  vertical
                  autoplay={tipList.length > 1}
                  autoplayLoop={tipList.length > 1}
                  autoplayDelay={2}
                  disableGesture={false}>
                  {tipList.map((v, i) => {
                    return (
                      <Text
                        key={i + 'tip'}
                        style={{
                          height: setSize(8),
                          fontSize: setSize(7),
                          lineHeight: setSize(8),
                          color: Color.infoText,
                          width: width - setSize(26),
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {v}
                      </Text>
                    );
                  })}
                </SwiperFlatList>
              </View>

              {/* <Swiper
            autoplay
            horizontal={false}
            height={setSize(16)}
            showsPagination={false}>
            {swiperList.map((v, i) => {
              return <Text>鸟是导师倒是</Text>;
            })}
          </Swiper> */}
            </View>
          </View>
          {/*华东下拉按钮 */}
          {this.state.showDown && (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Icon type="antdesign" name="down" size={20} color={'#999'} />
            </View>
          )}

          {/* 地图按钮 */}
          <View
            style={{
              flexDirection: 'row',
            }}>
            {btnGroup.map((v, i) => {
              return (
                <TouchableOpacity
                  key={i + 'btn'}
                  activeOpacity={0.5}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      btnAct === v.name ? Color.downPrimary : '#fff',
                    borderColor: '#F8F8F8',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                  }}
                  onPress={() => {
                    this.changeBtn(v.name);
                  }}>
                  <Text
                    style={{
                      color: btnAct === v.name ? Color.primary : Color.infoText,
                      borderBottomColor: Color.primary,
                      fontSize: setSize(6.98),
                      borderBottomWidth: btnAct === v.name ? 1 : 0,
                      height: setSize(15.95),
                      lineHeight: setSize(15.95),
                    }}>
                    {v.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {/* 地图插件 */}
        <WebView
          ref={w => (this.webview = w)}
          style={{flex: 1}}
          originWhitelist={['*']}
          geolocationEnabled
          javaScriptEnabled
          onLoadEnd={() => {
            let str = JSON.stringify(this.state.webViewData);
            this.webview.postMessage(str);
          }}
          automaticallyAdjustContentInsets
          onMessage={this._onMessage}
          source={
            Platform.OS === 'ios'
              ? require('./maps/index.html')
              : {uri: 'file:///android_asset/maps/index.html'}
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  baner: {
    width: setSize(87),
    height: setSize(47),
    borderRadius: 6,
    padding: setSize(6),
  },
  map_box: {},
});
function filter(state) {
  return {
    userId: state.userdata.userId,
  };
}
export default connect(filter)(Home);
