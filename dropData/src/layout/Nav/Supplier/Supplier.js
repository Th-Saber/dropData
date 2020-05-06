import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Avatar, Icon, Image, ListItem} from 'react-native-elements';
import Header from '@/component/Header';
import {Color, setSize} from '@/utils/global.js';
import Nav from '@/navigators/NavigationService';

export default class Supplier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listArr: [
        {
          icon: require('@/assets/icon/icon_cooperation.png'),
          title: '商务合作',
          path: 'SupCom',
          params: {
            name: 'business',
          },
        },
        {
          icon: require('@/assets/icon/icon_about.png'),
          title: '关于我们',
          path: 'SupCom',
          params: {
            name: 'aboutUs',
          },
        },
        {
          icon: require('@/assets/icon/icon_product.png'),
          title: '产品信息',
          path: 'Exchange',
        },
        {
          icon: require('@/assets/icon/icon_recruitment.png'),
          title: '招聘贤能',
          path: 'SupCom',
          params: {
            name: 'recruitment',
          },
        },
        {
          icon: require('@/assets/icon/icon_opinion.png'),
          title: '意见反馈',
          path: 'Opinion',
        },
      ],
    };
  }
  //   跳转到详细页面
  _jumpNav = item => {
    Nav.navigate(item.path, item.params ? {...item.params} : {});
  };
  render() {
    let {listArr} = this.state;
    return (
      <View style={styles.container}>
        <Header centerComponent="供方平台" />
        <View
          style={{
            margin: setSize(6),
            borderRadius: 6,
            backgroundColor: '#fff',
          }}>
          {listArr.map((v, i) => (
            <ListItem
              key={i + 'Rec'}
              leftAvatar={
                <Image
                  source={v.icon}
                  style={{width: setSize(7.5), height: setSize(7.5)}}
                  resizeMode="contain"
                  placeholderStyle={{backgroundColor: 'transparent'}}
                />
              }
              title={v.title}
              underlayColor="rgba(0,0,0,0.1)"
              containerStyle={{
                backgroundColor: 'transparent',
                height: setSize(22.5),
                marginHorizontal: 2,
                borderColor: Color.downBorder,
                borderBottomWidth: i === listArr.length - 1 ? 0 : 1,
              }}
              titleStyle={{fontSize: setSize(6.5), color: Color.mainText}}
              onPress={this._jumpNav.bind(this, v)}
              bottomDivider
              chevron
            />
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
