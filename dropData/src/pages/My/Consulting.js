import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Image, Avatar, Icon} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import {Color, setSize} from '@/utils/global.js';
import toast from '@/utils/toastMsg';
export default class Consulting extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.container}>
        <Header back centerComponent="健康咨询" />
        {/* 这是一个示例demo */}
        <Text>健康咨询</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
