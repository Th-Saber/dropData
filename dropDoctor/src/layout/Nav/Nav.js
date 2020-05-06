import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  BackHandler,
  Platform,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
// import * as Animatable from 'react-native-animatable';
import {useFocusEffect} from '@react-navigation/native';
import {Color, setSize} from '@/theme';
import {toast} from '@/components';
import Home from './items/Home';
import My from './items/My';

function NavCom({navigation}) {
  let pageSource = [
    {
      icon: require('@/assets/icons/home.png'),
      actIcon: require('@/assets/icons/home_act.png'),
      tabPage: 'Home',
      title: '主页',
      component: Home,
    },
    {
      icon: require('@/assets/icons/my.png'),
      actIcon: require('@/assets/icons/my_act.png'),
      tabPage: 'My',
      title: '我的',
      component: My,
    },
  ];
  let lastBackPressed;
  const [actTab, setActTab] = useState('Home');
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
          //最近2秒内按过back键，可以退出应用。
          BackHandler.exitApp();
          return false;
        }
        lastBackPressed = Date.now();
        toast.show('再次返回退出应用');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }),
  );

  let tabViews = pageSource.map((item, i) => (
    <TabNavigator.Item
      title={item.title}
      selected={actTab === item.tabPage}
      titleStyle={styles.titleStyle}
      selectedTitleStyle={styles.selectedTitleStyle}
      renderIcon={() => <Image style={styles.tabIcon} source={item.icon} />}
      renderSelectedIcon={() => (
        <Image style={styles.actIcon} source={item.actIcon} />
      )}
      onPress={() => {
        if (actTab !== item.tabPage) {
          setActTab(item.tabPage);
        }
      }}
      key={i + 'nav'}>
      {item.component({navigation})}
      {/* <item.component navigation={navigation} /> */}
    </TabNavigator.Item>
  ));
  return (
    <TabNavigator
      hidesTabTouch={true}
      sceneStyle={{
        paddingBottom: setSize(100),
      }}
      tabBarStyle={styles.barStyle}
      tabBarShadowStyle={{backgroundColor: Color.line, zIndex: -1}}>
      {tabViews}
    </TabNavigator>
  );
}

const styles = StyleSheet.create({
  barStyle: {
    height: setSize(110),
    backgroundColor: '#fff',
    borderWidth: 0,
  },
  tabIcon: {
    //未选中图标
    width: setSize(48),
    height: setSize(48),
    // borderWidth: 0
  },
  actIcon: {
    //选中图标
    width: setSize(48),
    height: setSize(48),
  },
  titleStyle: {
    //tabbar未选中字体
    color: Color.info,
    fontSize: setSize(20),
  },
  selectedTitleStyle: {
    //tabbar选中字体
    color: Color.primary,
  },
});
// const MyNav = Animatable.createAnimatableComponent(NavCom);
export default NavCom;
