import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import {Badge, Image, Button} from 'react-native-elements';
import FlatScroll from '@/component/FlatScroll';
import {connect} from 'react-redux';
import {Color, setSize} from '@/utils/global.js';
import {getProduct} from '@/apis/api';
class Exchange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      //   我的分数
      myScore: props.userdata.integral,
      pages: {
        page: 1,
        size: 10,
      },
      isNextPage: false, //判断是否有下一页
    };
  }
  componentDidMount = () => {
    // console.log('数据', this.props.userdata);
    this.searchFn();
  };
  searchFn = async callback => {
    let {pages} = this.state;
    try {
      let res = await getProduct(pages);
      this.setState(state => ({
        data:
          pages.page === 1
            ? res.data.records
            : [...state.data, ...res.data.records],
        isNextPage: res.data.current === res.data.pages,
      }));
      //   判断当前页是否为最后一页
      callback && callback(true);
    } catch (error) {
      console.log('请求错误', error);
    }
  };
  //   点击兑换
  getItem = id => {
    console.log('对反', id);
  };
  //   点击查看使用演示
  jumpVideo = id => {
    Nav.navigate('VidioDemo', {machineId: id});
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
  //   循环创建每一项子项
  renderItem = (item, index) => {
    let {myScore} = this.state;
    return (
      <View
        style={{
          height: setSize(46),
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: setSize(7),
        }}>
        <Image
          source={{uri: item.imageUrl}}
          style={{width: setSize(35), height: setSize(35)}}
          resizeMode="contain"
        />
        <View
          style={{
            flex: 1,
            height: '100%',
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: Color.minBorder,
            paddingTop: setSize(7),
            paddingBottom: setSize(4),
          }}>
          <View
            style={{
              flex: 1,
              marginLeft: setSize(4),
            }}>
            <Text
              style={{
                color: Color.mainText,
                fontSize: setSize(8),
                maxWidth: setSize(65),
              }}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {item.name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                flex: 1,
                alignContent: 'center',
                alignItems: 'center',
                width: setSize(100),
              }}>
              {item.label.split(',').map((v, i) => {
                return (
                  <Badge
                    value={v}
                    key={i + 'badge'}
                    textStyle={{
                      color: Color.infoText,
                      fontSize: setSize(5),
                    }}
                    badgeStyle={{
                      backgroundColor: Color.mainBorder,
                      height: 'auto',
                      alignSelf: 'center',
                      paddingHorizontal: 2,
                      marginRight: 8,
                      marginTop: i > 3 ? 2 : 0,
                    }}
                  />
                );
              })}
            </View>
            <Text
              style={{
                color: Color.danger,
                fontSize: setSize(7),
              }}>
              {item.integral}
              <Text style={{fontSize: setSize(5)}}>&nbsp;积分</Text>
            </Text>
          </View>
          <View
            style={{
              width: setSize(30),
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              hitSlop={{left: 10, right: 10, top: 10, bottom: 10}}
              onPress={this.jumpVideo.bind(this, item.id)}>
              <Text
                style={{
                  color: Color.primary,
                  fontSize: setSize(5),
                  marginTop: setSize(2),
                  textAlign: 'center',
                }}>
                使用演示
              </Text>
            </TouchableOpacity>
            <Button
              title="马上兑"
              buttonStyle={{
                padding: 0,
                borderRadius: 20,
                backgroundColor: Color.danger,
                paddingTop: 0,
              }}
              disabled={myScore < item.integral}
              onPress={this.getItem.bind(this, item.id)}
              titleStyle={{fontSize: setSize(5)}}
            />
          </View>
        </View>
      </View>
    );
  };
  render() {
    let {data, myScore, pages} = this.state;
    return (
      <View style={{flex: 1}}>
        <Header back centerComponent="产品兑换" />
        <View
          style={{
            height: setSize(21.06),
            paddingHorizontal: setSize(7),
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Color.bgColor,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: setSize(5.01),
              color: Color.infoText,
            }}>
            可用积分：{myScore}
          </Text>
          <Badge
            value="交易记录"
            textStyle={{
              color: Color.primary,
              fontSize: setSize(5),
            }}
            badgeStyle={{
              backgroundColor: Color.downPrimary,
              height: 'auto',
              padding: 2,
            }}
          />
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

const styles = StyleSheet.create({});
function filter(state) {
  return {
    userdata: state.userdata,
  };
}
export default connect(filter)(Exchange);
