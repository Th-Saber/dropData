import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import {Icon, Badge} from 'react-native-elements';
import FlatScroll from '@/component/FlatScroll';
import {Color, setSize} from '@/utils/global.js';
import {getAddressPage} from '@/apis/api.js';
export default class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pages: {
        page: 1,
        size: 10,
      },
      isNextPage: false, //是否是最后页
    };
  }
  componentDidMount() {
    this.searchFn();
  }
  //   分页获取数据
  searchFn = async callback => {
    try {
      let res = await getAddressPage(this.state.pages);
      console.log('res', res.data);
      let listData = [...this.state.data];
      this.setState({
        data:
          this.state.pages.page === 1
            ? res.data.records
            : [...listData, ...res.data.records],
        isNextPage: res.data.current === res.data.pages,
      });
      callback && callback();
    } catch (error) {
      console.log(error);
    }
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
  //   编辑添加地址
  jumpAdd = (val, data = {}) => {
    Nav.navigate('AddAddress', {type: val, data, callback: this._downRefresh});
  };
  //   渲染子项
  renderItem = item => {
    return (
      <View
        style={{
          borderRadius: 6,
          backgroundColor: '#fff',
          padding: setSize(6),
          marginBottom: setSize(6),
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              maxWidth: setSize(50),
              color: Color.mainText,
              fontSize: setSize(8),
            }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.username}
          </Text>
          <Text
            style={{
              fontSize: setSize(6),
              marginLeft: setSize(6),
              color: Color.infoText,
            }}>
            {item.mobile}
          </Text>
        </View>
        <Text
          style={{
            marginTop: setSize(2),
            fontSize: setSize(6),
            lineHeight: setSize(9),
            color: Color.mainText,
          }}>
          {item.province + item.city + item.county + item.address}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: setSize(4),
            paddingTop: setSize(6),
            justifyContent: 'space-between',
            borderTopWidth: 1,
            borderTopColor: Color.downBorder,
          }}>
          <Badge
            value="默认"
            textStyle={{
              color: Color.primary,
              fontSize: setSize(6),
            }}
            badgeStyle={{
              backgroundColor: Color.deepPrimary,
              height: 'auto',
              borderRadius: 4,
              paddingHorizontal: 4,
              paddingVertical: 2,
              display: item.wasDefault ? 'flex' : 'none',
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
            <Text
              style={{color: Color.minText, fontSize: setSize(6)}}
              onPress={this.jumpAdd.bind(this, 'edit', item)}>
              编辑
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  render() {
    let {data} = this.state;
    return (
      <View style={styles.container}>
        <Header
          back
          centerComponent="地址管理"
          rightComponent={() => (
            <Icon
              type="antdesign"
              name="plus"
              size={setSize(12)}
              color="#fff"
            />
          )}
          RightOnPress={this.jumpAdd.bind(this, 'add')}
        />
        <FlatScroll
          data={data}
          dropDown
          pull
          containerStyle={{padding: setSize(6)}}
          renderItem={this.renderItem}
          downRefresh={this._downRefresh}
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
