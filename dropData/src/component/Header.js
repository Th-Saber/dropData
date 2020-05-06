import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import {Color, setSize} from '@/utils/global';
export default class MyHeader extends Component {
  static defaultProps = {
    rightComponent: null, //右侧组件
    leftComponent: null, //左侧组件
    back: false, //是否显示返回返回
    centerComponent: '标题', //中间组件
    backgroundColor: Color.primary, //背景色
    leftOnPress: () => {
      //左侧组件点击事件
      console.log('左边图标');
    },
    RightOnPress: () => {
      //右侧组件点击事件
      console.log('右边图标');
    },
  };
  //   左侧图标组件
  leftIcon = () => {
    const LeftCom = this.props.leftComponent;
    if (this.props.back) {
      return (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}
          onPress={() => Nav.goBack()}>
          <Icon name="left" type="antdesign" color="#fff" size={18} />
        </TouchableOpacity>
      );
    } else {
      if (LeftCom) {
        return (
          <TouchableOpacity
            hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}
            onPress={() => {
              this.props.leftOnPress();
            }}>
            <LeftCom />
          </TouchableOpacity>
        );
      } else {
        return null;
      }
    }
  };
  //   右侧图标
  rightIcon = () => {
    const RightCom = this.props.rightComponent;
    if (RightCom) {
      return (
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}
          onPress={() => {
            this.props.RightOnPress();
          }}>
          <RightCom />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };
  //   中间的组件
  centerCom = () => {
    let centerComponent = this.props.centerComponent;
    if (typeof centerComponent === 'string') {
      return {
        text: centerComponent,
        style: {color: '#fff', fontSize: setSize(8.52)},
      };
    } else if (typeof centerComponent === 'object' && centerComponent.text) {
      return {
        ...centerComponent,
        style: {color: '#fff', fontSize: setSize(8.52)},
      };
    } else {
      return centerComponent;
    }
  };
  render() {
    let obj = this.centerCom();
    return (
      <View>
        <Header
          {...this.props}
          leftComponent={this.leftIcon}
          centerComponent={obj}
          containerStyle={{borderBottomWidth: 0}}
          rightComponent={this.rightIcon}
          backgroundColor={this.props.backgroundColor}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
