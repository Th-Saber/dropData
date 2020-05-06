import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import {Image, Avatar, Icon} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import {Color, setSize} from '@/utils/global.js';
import toast from '@/utils/toastMsg';
import {WebView} from 'react-native-webview';
import moment from 'moment';
import {getIndexInfo, getInfoLine} from '@/apis/api';
import {storage} from '@/storage';
export default class IndexDetail extends Component {
  constructor(props) {
    super(props);
    this.ViewW = setSize(167); //指数盒子宽高  用于算出百分比
    this.state = {
      search: {
        // name: '',
        // rangeMax: 100,
        // rangeMin: 0,
        // phName: '',
        // uid: 0,
        // result:0,
        // machineType: 0,
      },
      //   图标选项
      tabList: [
        {name: '全部数据', val: 'all'},
        // {name: '异常数据', val: 'abnormal'},
      ],
      //  时间选项
      timeList: [
        {name: '年', val: 'years'},
        {name: '月', val: 'months'},
        {name: '周', val: 'weeks'},
      ],
      selTab: 'all', //选中激活tab
      selTime: 'years', //选中时间
      newCardList: [
        {title: '可能存在的风险或疾病:', content: ''},
        {title: '健康建议:', content: ''},
        {title: '临床意义:', content: ''},
      ],
      //   顶部数据范围定位值
      position: 0,
      //   低中高数据列表
      rangeList: [
        {
          text: '低',
          color: Color.warning,
        },
        {
          text: '中',
          color: Color.success,
        },
        {
          text: '高',
          color: Color.danger,
        },
      ],
      //   折线图缓存数据
      lineData: {
        months: [], //月
        weeks: [], //周
        years: [], //年
        urineYears: [], //尿检年数据
      },
      // webView是否加载完成
      //   webLoad: false,
    };
  }
  componentDidMount() {
    let data = this.props.navigation.getParam('data');
    // console.log('data', this.props.navigation.getParam('data'));
    // 获取地址搜索函数
    this.getPosition();
    // 搜索参数评价
    this.setState(
      {
        search: data,
      },
      () => {
        this.serachFn();
        this.getStorage();
      },
    );
  }
  //  指数评价
  serachFn = async () => {
    let {search, newCardList} = this.state;
    let param = {
      phName: search.phName,
      uid: search.uid,
      machineId: search.machineId,
      machineType: search.machineType,
    };
    try {
      let res = await getIndexInfo(param);
      let newCardArr = [...newCardList];
      //   渲染建议列表数据
      newCardArr[0].content = res.data.diseaseInformation;
      newCardArr[1].content = res.data.healthAdvice;
      newCardArr[2].content = res.data.clinicalSignificance;
      this.setState({
        newCardList: newCardArr,
      });
    } catch (error) {
      console.log('请求错误', error);
    }
  };
  //  本地获取折线图数据
  getStorage = () => {
    let data = this.props.navigation.getParam('data');
    storage.load(`${data.uid}-${data.machineId}-equipment`, result => {
      if (result) {
        this.setState({
          lineData: result,
          webLoad: true,
        });
      } else {
        this.getLineFn();
      }
    });
  };
  //   获取折线图数据方法
  getLineFn = async () => {
    let {search} = this.state;
    let params = {
      uid: search.uid,
      machineId: search.machineId,
      machineType: search.machineType,
    };
    try {
      let res = await getInfoLine(params);
      this.setState({
        lineData: res.data,
        webLoad: true,
      });
      //   存入数据
      storage.save(
        `${search.uid}-${search.machineId}-equipment`,
        res.data,
        1000 * 10,
        // 1000 * 60 * 30,
      );
    } catch (error) {
      console.log('请求折线图数据失败', error);
    }
  };
  //  获取指标对应位置
  getPosition = () => {
    let {rangeMax, rangeMin, result} = this.props.navigation.getParam('data');
    let W = this.ViewW;
    let AgeW = W / 3;
    let data = 0;
    let max = parseFloat(rangeMax);
    let min = parseFloat(rangeMin);
    let val = parseFloat(result);
    if (val > max) {
      let range = max ? (val - max) / max : val - max;
      range = range > 1 ? 1 : range;
      let len = AgeW * range;
      data = AgeW * 2 + len;
    } else if (val >= min) {
      let range = min ? (val - min) / min : val - min;
      let len = AgeW * range;
      data = AgeW + len;
    } else {
      let range = min ? (min - val) / min : min - val;
      range = range > 1 ? 1 : range;
      range = 1 * 100 - range * 100;
      data = AgeW * (range / 100);
    }
    this.setState({
      position: parseFloat(data.toFixed(1)),
    });
  };
  //  判断位置位于哪里 显示背景颜色
  showBgColor = val => {
    let age = this.ViewW / 3;
    if (val > age * 2) {
      return {
        position: 'right',
        color: Color.danger,
      };
    } else if (val > age) {
      return {
        position: 'left',
        color: Color.success,
      };
    } else {
      return {
        position: 'left',
        color: Color.warning,
      };
    }
  };
  //   传入webview数据
  webviewData = () => {
    let {selTime, lineData, search} = this.state;
    let str =
      search.machineType === 1
        ? 'oxygenScore'
        : search.phName.toLowerCase() + 'Score'; //转换成小写
    // : search.phName.toUpperCase() + 'Score';//转换成大写
    let mapArr =
      search.machineType === 1 ? lineData[selTime] : lineData.urineYears;
    let params = {
      type: 'initialData',
      data: mapArr.map(v => [
        moment(v.createTime).format('YYYY-MM-DD'),
        v[str],
      ]),
    };
    // console.log('过女后的data', params.data);
    this.webview.postMessage(JSON.stringify(params));
  };
  //  修改tab
  changeTab = obj => {
    let {selTab} = this.state;
    if (selTab === obj.val) {
      return;
    }
    this.setState({
      selTab: obj.val,
    });
  };
  //  修改时间
  changeTime = obj => {
    let {selTime} = this.state;
    if (selTime === obj.val) {
      return;
    }
    this.setState(
      {
        selTime: obj.val,
      },
      () => {
        this.webviewData();
      },
    );
  };
  //   图表tab页面
  _tabView = () => {
    let {tabList, selTab} = this.state;

    let tab = tabList.map((v, i) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{left: 10, top: 10, bottom: 10, right: 10}}
          key={i + 'tab'}
          style={{
            width: setSize(30),
            height: setSize(9),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginRight: setSize(5),
            backgroundColor:
              v.val === selTab ? Color.downPrimary : Color.bgColor,
          }}
          onPress={() => this.changeTab(v)}>
          <Text style={{color: Color.primary, fontSize: setSize(5)}}>
            {v.name}
          </Text>
        </TouchableOpacity>
      );
    });
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: setSize(5),
        }}>
        {tab}
      </View>
    );
  };
  //   时间年月日页面
  _timeView = () => {
    let {timeList, selTime} = this.state;
    let time = timeList.map((v, i) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{left: 10, top: 10, bottom: 10, right: 10}}
          key={i + 'time'}
          style={{
            width: setSize(29),
            height: setSize(9),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            backgroundColor:
              v.val === selTime ? Color.downPrimary : Color.bgColor,
          }}
          onPress={() => this.changeTime(v)}>
          <Text style={{color: Color.primary, fontSize: setSize(6)}}>
            {v.name}
          </Text>
        </TouchableOpacity>
      );
    });
    return (
      <View
        style={{
          flexDirection: 'row',
          marginBottom: setSize(6),
          justifyContent: 'space-evenly',
        }}>
        {time}
      </View>
    );
  };
  //   顶级渲染函数
  render() {
    let {search, rangeList, position, newCardList, webLoad} = this.state;
    let posObj = this.showBgColor(position);
    return (
      <View style={styles.container}>
        <Header back centerComponent="指数解读" />
        {/* 头部基础数据展示 */}
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.mH,
              {
                backgroundColor: '#fff',
                paddingHorizontal: setSize(4),
                paddingVertical: setSize(6),
              },
            ]}>
            {/* 名称 */}
            <Text
              style={{
                color: Color.mainText,
                fontSize: setSize(8),
              }}>
              {search.name}
              <Text
                style={{
                  fontSize: setSize(6),
                  color: Color.primary,
                }}>
                &nbsp;标准检测
              </Text>
            </Text>
            {/* 数据指数 */}
            <View
              style={{
                marginTop: setSize(14),
                width: this.ViewW,
                flexDirection: 'row',
              }}>
              {rangeList.map((v, i) => {
                return (
                  <View
                    key={i + 'range'}
                    style={{
                      flex: 1,
                      backgroundColor: v.color,
                      height: setSize(10),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: '#fff'}}>{v.text}</Text>
                  </View>
                );
              })}
              {/* 指数图标 */}
              <View
                style={[
                  styles.infoMsg,
                  {
                    left:
                      posObj.position === 'left'
                        ? position
                        : position - setSize(3),
                  },
                ]}>
                <View
                  style={[
                    styles.bage,
                    posObj.position === 'left'
                      ? styles.bageLeft
                      : styles.bageRight,
                    {borderTopColor: posObj.color},
                  ]}>
                  <View
                    style={[
                      styles.textBox,
                      posObj.position === 'left' ? {left: -4} : {right: -4},
                      {
                        backgroundColor: posObj.color,
                        width: setSize(20),
                      },
                    ]}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: setSize(5),
                        maxWidth: setSize(20),
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {search.result}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* tip提示信息 */}
            <Text
              style={{
                marginTop: setSize(10),
                fontSize: setSize(6),
                color: Color.minText,
              }}>
              由于检测设备及测量方法等存在差异，判定标准仅供参考
            </Text>
          </View>
          {/* 图表部分 */}
          <View style={[styles.mH]}>
            {this._tabView()}
            {/* 地图插件 */}
            {webLoad ? (
              <WebView
                ref={w => (this.webview = w)}
                style={{
                  height: setSize(112),
                }}
                originWhitelist={['*']}
                startInLoadingState
                renderLoading={() => (
                  <ActivityIndicator color={Color.primary} />
                )}
                geolocationEnabled
                javaScriptEnabled
                onLoadEnd={() => {
                  this.webviewData();
                }}
                automaticallyAdjustContentInsets
                source={
                  Platform.OS === 'ios'
                    ? require('./echats/index.html')
                    : {
                        uri: 'file:///android_asset/echats/index.html',
                      }
                }
              />
            ) : (
              <View style={{height: setSize(112)}}>
                <ActivityIndicator color={Color.primary} />
              </View>
            )}

            {this._timeView()}
          </View>
          {/* 可能存在风险 */}
          {newCardList.map((v, i) => {
            return (
              <View
                style={[
                  styles.mH,
                  {
                    marginBottom: i === newCardList.length - 1 ? setSize(6) : 0,
                  },
                ]}
                key={i + 'newCar'}>
                <Text
                  style={{
                    color: Color.minText,
                    fontSize: setSize(7),
                    letterSpacing: 1,
                    paddingVertical: setSize(5),
                  }}>
                  {v.title}
                </Text>
                <Text
                  style={{
                    fontSize: setSize(5),
                    color: Color.mainText,
                    lineHeight: setSize(8),
                    marginBottom: setSize(4),
                    letterSpacing: 1,
                  }}>
                  {v.content}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bgColor,
  },
  mH: {
    marginHorizontal: setSize(6),
    backgroundColor: '#fff',
    paddingHorizontal: setSize(4),
    borderRadius: 6,
    marginTop: setSize(3),
  },
  infoMsg: {
    position: 'absolute',
    bottom: setSize(10),
    left: 0,
  },
  textBox: {
    backgroundColor: Color.primary,
    paddingHorizontal: setSize(3),
    height: setSize(8),
    borderRadius: 4,
    justifyContent: 'center',
    position: 'absolute',
    bottom: setSize(3),
  },
  bage: {
    position: 'absolute',
    bottom: 0,
    borderTopWidth: setSize(3),
  },
  bageLeft: {
    borderRightWidth: setSize(3),
    borderRightColor: 'transparent',
  },
  bageRight: {
    borderLeftWidth: setSize(3),
    borderLeftColor: 'transparent',
  },
});
