import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  BackHandler,
  Platform,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import * as Animatable from 'react-native-animatable';
import Home from './Home/Home';
import HealthData from './HealthData/HealthData';
import {Color, setSize, getBarHeight} from '@/utils/global.js';
import Supplier from './Supplier/Supplier';
import Community from './Community/Community';
import toast from '@/utils/toastMsg';
const {width, height} = Dimensions.get('window');
import My from './My/My';

// tabbar
const pageSource = [
  {
    icon: require('@/assets/icon/shequ2.png'),
    selectedIcon: require('@/assets/icon/shequ.png'),
    tabPage: 'Community',
    tabName: '社区',
    component: Community,
  },
  {
    icon: require('@/assets/icon/shuju2.png'),
    selectedIcon: require('@/assets/icon/shuju.png'),
    tabPage: 'HealthData',
    tabName: '健康数据',
    component: HealthData,
  },
  {
    icon: require('@/assets/icon/home.png'),
    selectedIcon: require('@/assets/icon/home2.png'),
    tabPage: 'Home',
    tabName: '首页',
    component: Home,
  },
  {
    icon: require('@/assets/icon/platform2.png'),
    selectedIcon: require('@/assets/icon/platform.png'),
    tabPage: 'Supplier',
    tabName: '供方平台',
    component: Supplier,
  },
  {
    icon: require('@/assets/icon/wo2.png'),
    selectedIcon: require('@/assets/icon/wo.png'),
    tabPage: 'My',
    tabName: '我的',
    component: My,
  },
];
let navigation = null;
class Nav extends Component {
  constructor(props) {
    super(props);
    navigation = this.props.navigation;
    this.state = {
      selectedTab: 'Home', //默认页面
      num: 0,
    };
  }
  componentDidMount() {
    //监听页面退出
    this.viewDidAppear1 = this.props.navigation.addListener(
      'willFocus',
      obj => {
        if (Platform.OS === 'android') {
          this.listener = BackHandler.addEventListener(
            'hardwareBackPress',
            this.onBackAndroid,
          );
        }
      },
    );
    this.viewDidAppear2 = this.props.navigation.addListener('willBlur', obj => {
      if (Platform.OS === 'android') {
        this.listener.remove('hardwareBackPress');
      }
    });
  }
  //   监听页面退出
  onBackAndroid = () => {
    if (this.state.selectedTab == 'Home') {
      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        //最近2秒内按过back键，可以退出应用。
        BackHandler.exitApp();
        return false;
      }
      this.lastBackPressed = Date.now();
      try {
        toast.show('再次返回退出应用');
      } catch (error) {
        console.log(error);
      }
      return true;
    } else {
      this.setState({
        selectedTab: 'Home',
      });
      return true;
    }
  };
  componentWillUnmount() {
    this.viewDidAppear1.remove();
    this.viewDidAppear2.remove();
  }
  //   自定义bage
  myBage = num => {
    if (!num || num <= 0) {
      return null;
    }
    let flag = num > 99;
    return (
      <View
        style={{
          height: setSize(6),
          minWidth: setSize(6),
          borderRadius: setSize(3),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Color.danger,
          paddingHorizontal: flag ? 2 : 0,
          position: 'absolute',
          left: '74%',
          top: 0,
        }}>
        <Text style={{fontSize: setSize(4), color: '#fff'}}>
          {flag ? '99+' : num}
        </Text>
      </View>
    );
  };
  render() {
    const {num} = this.props.data.msgNum;
    let tabViews = pageSource.map((item, i) => {
      return (
        <TabNavigator.Item
          title={item.tabName}
          selected={this.state.selectedTab === item.tabPage}
          titleStyle={styles.titleStyle}
          selectedTitleStyle={styles.selectedTitleStyle}
          renderIcon={() => (
            <View>
              <Image style={styles.tabIcon} source={item.icon} />
              {item.tabPage === 'Community' && this.myBage(num)}
            </View>
          )}
          renderSelectedIcon={() => (
            <Animatable.View
              animation={{
                0: {
                  transform: [{scale: 1.6}],
                  translateY: -5,
                },
                1: {
                  transform: [{scale: 1.0}],
                  translateY: 0,
                },
              }}
              direction="reverse"
              useNativeDriver
              easing="ease-in-quint">
              <Image style={styles.selectedIcon} source={item.selectedIcon} />
              {item.tabPage === 'Community' && this.myBage(num)}
            </Animatable.View>
          )}
          onPress={() => {
            this.setState({selectedTab: item.tabPage});
          }}
          key={i}>
          <item.component navigation={navigation} />
        </TabNavigator.Item>
      );
    });
    return (
      <View style={styles.container}>
        <TabNavigator
          hidesTabTouch={true}
          sceneStyle={{
            paddingBottom: setSize(30.58),
          }}
          tabBarStyle={styles.TabNavigator}
          tabBarShadowStyle={{backgroundColor: Color.minBorder, zIndex: -1}}>
          {tabViews}
        </TabNavigator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: height,
  },
  TabNavigator: {
    height: setSize(30.58),
    backgroundColor: '#fff',
    borderWidth: 0,
  },
  tabIcon: {
    //未选中图标
    width: setSize(12.95),
    height: setSize(12.95),
    // borderWidth: 0
  },
  selectedIcon: {
    //选中图标
    width: setSize(12.95),
    height: setSize(12.95),
  },
  titleStyle: {
    //tabbar未选中字体
    color: '#888888',
    fontSize: setSize(4.97),
    paddingBottom: setSize(4.5),
  },
  selectedTitleStyle: {
    //tabbar选中字体
    color: Color.primary,
  },
});
const MyNav = Animatable.createAnimatableComponent(Nav);
export default MyNav;
