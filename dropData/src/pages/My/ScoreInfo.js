import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Image, Icon, ListItem} from 'react-native-elements';
import moment from 'moment';
import Nav from '@/navigators/NavigationService';
import FlatScroll from '@/component/FlatScroll';
import Picker from 'react-native-picker';
import Header from '@/component/Header';
import {Color, setSize} from '@/utils/global.js';
import {getDate} from '@/utils/pikerSetting';
import {storage} from '@/storage';
import {scoreInfoData} from '@/apis/api';
export default class ScoreInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 4200,
      time: moment(new Date()).format('YYYY-MM-DD'),
      loading: false,
      setions: [
        //选项卡数组
        {
          title: '积分获取',
          name: 'income',
          num: 14,
        },
        {
          title: '积分支出',
          name: 'spending',
          num: -1600,
        },
      ],
      actName: 'income', //激活选项卡
      data: [],
      pages: {
        page: 1,
        size: 10,
      },
      isNextPage: false, //是否有下一页
    };
  }
  componentDidMount() {
    let {userdata} = this.props.data;
    let arr = [...this.state.setions];
    storage.load('scoreInfo', info => {
      arr[0].num = info.addScore;
      arr[1].num = info.addIntegral;
      this.setState({
        setions: arr,
        score: userdata.integralTotal,
      });
    });
    this.searchFn();
    this.viewDidAppear2 = this.props.navigation.addListener('willBlur', obj => {
      //   Picker && Picker.hide();
      Picker.isPickerShow(isShow => {
        isShow && Picker.hide();
      });
    });
  }
  //   消除异步操作
  componentWillUnmount = () => {
    this.viewDidAppear2.remove();
    this.setState = (state, callback) => {
      return;
    };
  };
  sectionFn = name => {
    let {loading, actName} = this.state;
    if (loading || name === actName) {
      return;
    }
    this.setState(
      {
        actName: name,
      },
      () => {
        // 异步请求
        this._downRefresh();
      },
    );
  };
  //请求数据
  searchFn = async callback => {
    let {pages, actName, time} = this.state;
    this.setState({
      loading: true,
    });
    try {
      let res = await scoreInfoData({
        ...pages,
        type: actName === 'income' ? 1 : 0,
        date: time,
      });
      console.log('积分详情', res);
      this.setState(state => ({
        data:
          pages.page === 1
            ? res.data.records
            : [...state.data, ...res.data.records],

        isNextPage: res.data.current === res.data.paload,
        loading: false,
      }));
      callback && callback(true);
    } catch (error) {
      console.log('error', error);
      this.setState({
        loading: false,
      });
    }
  };
  //显示piker框
  pickType = () => {
    let {time, loading} = this.state;
    // 数据是否加载中
    if (loading) {
      return;
    }
    let data = getDate();
    let slectTime = time.split('-');
    Picker.init({
      pickerData: data,
      selectedValue: slectTime,
      pickerTitleText: '',
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerConfirmBtnColor: [111, 110, 115, 1],
      pickerCancelBtnColor: [111, 110, 115, 1],
      pickerToolBarFontSize: setSize(7),
      pickerTitleColor: [111, 110, 115, 0.5], //选择器标题颜色
      pickerToolBarBg: [247, 247, 247, 1], //选择器顶部条背景色
      pickerBg: [229, 228, 233, 1], //选择器背景色
      //确定
      onPickerConfirm: data => {
        let selTime = data.join('-');
        if (time === selTime) {
          return;
        }
        this.setState(
          {
            time: selTime,
          },
          () => {
            this._downRefresh();
          },
        );
      },
      //取消
      onPickerCancel: data => {
        // console.log('取消', data);
      },
      //选择
      onPickerSelect: data => {
        // console.log('选择', data);
      },
    });
    Picker.show();
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
  //  数据格式筛选
  msgType = val => {
    switch (val) {
      //  1、设备上线 2尿检 3、绑定设备 4、用户信息完成5、积分兑换
      case 1:
        return '设备上线';
      case 2:
        return '尿检';
      case 3:
        return '绑定设备';
      case 4:
        return '用户信息完成';
      case 5:
        return '积分兑换';
      default:
        return '';
    }
  };
  //循环子项
  renderItem = (item, index) => {
    let {data} = this.state;
    let msg = this.msgType(item.mode);
    return (
      <ListItem
        title={msg}
        containerStyle={{
          backgroundColor: 'transparent',
          height: setSize(22),
          padding: 0,
          margin: 0,
          borderColor: Color.minBorder,
          //   borderBottomWidth: index === data.length - 1 ? 0 : 1,
        }}
        titleStyle={{
          fontSize: setSize(7),
          color: Color.infoText,
        }}
        bottomDivider
        rightTitle={
          <Text
            style={{
              fontSize: setSize(7),
              color: Color.infoText,
            }}>
            {item.changeIntegral}
          </Text>
        }
      />
    );
  };
  render() {
    let {score, time, setions, actName, data, loading, pages} = this.state;
    return (
      <View style={styles.container}>
        <Header back centerComponent="积分明细" />
        {/* 头部积分展示 */}
        <View
          style={{
            height: setSize(70),
            backgroundColor: Color.primary,
            borderTopWidth: 0.5,
            borderTopColor: Color.minBorder,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              height: setSize(11),
              width: setSize(62),
              backgroundColor: '#fff',
              marginTop: 5,
              borderRadius: setSize(6),
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
            onPress={this.pickType}>
            <Text
              style={{
                fontSize: setSize(6),
                color: Color.primary,
              }}>
              {moment(time).format('ll')}
            </Text>
            <Icon
              name="up" //up down
              type="antdesign"
              color={Color.primary}
              size={setSize(5)}
            />
          </TouchableOpacity>
          <View style={{marginTop: setSize(14)}}>
            <Text style={{fontSize: setSize(17), color: '#fff'}}>
              {score}
              <Text style={{fontSize: setSize(8)}}>&nbsp;分</Text>
            </Text>
          </View>
        </View>
        {/* 选项 */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {setions.map((v, i) => {
            return (
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderRightWidth: i === 0 ? 1 : 0,
                  borderRightColor: Color.minBorder,
                  alignItems: 'center',
                  //   justifyContent: 'space-evenly',
                  height: setSize(30),
                  paddingVertical: setSize(5),
                  borderBottomWidth: 1,
                  borderBottomColor:
                    actName === v.name ? Color.primary : Color.minBorder,
                }}
                key={i + 'section'}
                activeOpacity={1}
                onPress={this.sectionFn.bind(this, v.name)}>
                <Text
                  style={{
                    color: actName === v.name ? Color.primary : Color.infoText,
                  }}>
                  {v.num > 0 ? '+' + v.num : v.num}
                </Text>
                <Text
                  style={{
                    color: actName === v.name ? Color.primary : Color.infoText,
                  }}>
                  {v.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
          <FlatScroll
            data={data}
            renderItem={this.renderItem}
            dropDown
            pull={data.length > pages.size}
            downRefresh={this._downRefresh}
            pullRefresh={this._pullRefresh}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
