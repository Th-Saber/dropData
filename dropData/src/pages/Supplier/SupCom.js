import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Image, Avatar, Icon} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import {WebView} from 'react-native-webview';
import {Color, setSize} from '@/utils/global.js';
import {getWebContent} from '@/apis/api';
import toast from '@/utils/toastMsg';
// 禁止Webview拖动
const INJECTEDJAVASCRIPT = `
  const meta = document.createElement('meta'); 
  meta.setAttribute('content', 'initial-scale=1.0, maximum-scale=1.0, user-scalable=1.0'); 
  meta.setAttribute('name', 'viewport'); 
  document.getElementsByTagName('head')[0].appendChild(meta);
`;
export default class SupCom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navTitle: '',
      htmlStr: '',
    };
  }
  componentDidMount = () => {
    let name = this.props.navigation.getParam('name');
    let reslut = this.showNavTitle(name);
    this.setState(
      {
        navTitle: reslut.name,
      },
      () => {
        this.searchFn(reslut.id);
      },
    );
  };
  //   搜索
  searchFn = async id => {
    try {
      let res = await getWebContent({id});
      this.setState({
        htmlStr: res.data.content,
      });
    } catch (error) {
      console.log('数据', error);
    }
  };
  //   根据类型渲染页面
  showNavTitle = val => {
    switch (val) {
      case 'business':
        return {
          name: '商务合作',
          id: 2,
        };
      case 'aboutUs':
        return {
          name: '关于我们',
          id: 1,
        };
      case 'recruitment':
        return {
          name: '招聘贤能',
          id: 3,
        };
    }
  };
  render() {
    const {htmlStr, navTitle} = this.state;
    return (
      <View style={styles.container}>
        <Header back centerComponent={navTitle} />
        {/* 这是一个示例demo */}
        <View
          style={{
            marginVertical: setSize(7),
            marginHorizontal: setSize(6),
            backgroundColor: '#fff',
            borderRadius: 6,
            flex: 1,
          }}>
          <WebView
            style={{flex: 1}}
            originWhitelist={['*']}
            injectedJavaScript={INJECTEDJAVASCRIPT}
            source={{html: htmlStr}}
          />
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
