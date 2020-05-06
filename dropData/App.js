import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {
  //   AppStackNavigator,
  getAppStackNavigator,
} from '@/navigators/AppNavigator';
import {storage} from '@/storage';
import Nav from '@/navigators/NavigationService';
import {createAppContainer} from 'react-navigation';
import {Provider} from 'react-redux';
// import SplashScreen from "react-native-splash-screen" //启动屏设置
import store from '@/store'; //引入redux
import {save_userdata} from '@/store/actions'; //引入redux
import {setToast} from '@/utils/toastMsg'; //引入redux
import '@/utils/moment'; //国际化moment
import Toast from 'react-native-easy-toast';
import message from '@/apis/message';
const StacksOverTab = createAppContainer(getAppStackNavigator()); //测试用
export default class App extends Component {
  componentDidMount() {
    // 把userdata 保存到redux中
    storage.load('userdata', userdata => {
      if (userdata) {
        store.dispatch(save_userdata(userdata));
        message.open();
      }
    });
  }
  handleNavigationChange = (route, value) => {};
  render() {
    // const StacksOverTab = this.StacksOverTab;
    return (
      <Provider store={store}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="rgba(0,0,0,0)"
          translucent
        />
        <StacksOverTab
          ref={navigatorRef => {
            Nav.setTopLevelNavigator(navigatorRef); //设置顶层导航
          }}
          onNavigationStateChange={this.handleNavigationChange}
        />
        <Toast
          ref={toast => {
            setToast(toast);
          }}
          fadeInDuration={100}
          opacity={0.8}
        />
      </Provider>
    );
  }
}
