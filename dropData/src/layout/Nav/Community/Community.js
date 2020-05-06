import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import {Color, setSize} from '@/utils/global';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import {connect} from 'react-redux';
import {Image} from 'react-native-elements';
import Recommended from '@/pages/Community/Recommended';
import Focus from '@/pages/Community/Focus';
import Message from '@/pages/Community/Message';

const pageSource = [
  {
    tabPage: 'Recommended',
    tabName: '推荐',
    component: Recommended,
  },
  {
    tabPage: 'Focus',
    tabName: '关注',
    component: Focus,
  },
  {
    tabPage: 'Message',
    tabName: '消息',
    component: Message,
  },
];
class Community extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Recommended',
      num: 0,
    };
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
          height: setSize(7),
          minWidth: setSize(7),
          borderRadius: setSize(4),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Color.danger,
          paddingHorizontal: flag ? 2 : 0,
          position: 'absolute',
          left: '74%',
          top: 0,
        }}>
        <Text style={{fontSize: setSize(5), color: '#fff'}}>
          {flag ? '99+' : num}
        </Text>
      </View>
    );
  };
  //   子组件的实例方法
  onRef = ref => {
    this.refRecom = ref;
  };
  //   发布动态成功后回调函数
  reloadNews = () => {
    this.setState({
      selectedTab: 'Recommended',
    });
    this.refRecom._downRefresh();
  };
  //  激活navbar
  navItem = () => {
    let {selectedTab} = this.state;
    const tabs = pageSource.map((v, i) => {
      return (
        <TouchableOpacity
          key={i + 'pagesS'}
          activeOpacity={1}
          style={{
            flex: 1,
          }}
          onPress={() => this.setState({selectedTab: v.tabPage})}>
          <View
            style={[
              {
                alignSelf: 'center',
                paddingHorizontal: setSize(2),
              },
              selectedTab === v.tabPage
                ? {borderBottomWidth: 2, borderColor: '#fff'}
                : {},
            ]}>
            <Text
              style={{
                fontSize: setSize(8),
                lineHeight: setSize(16),
                height: setSize(16),
                textAlign: 'center',
                color: '#fff',
              }}>
              {v.tabName}
            </Text>
          </View>
          {v.tabPage === 'Message' && this.myBage(this.props.msgNum.num)}
        </TouchableOpacity>
      );
    });
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        {tabs}
      </View>
    );
  };
  render() {
    let tabViews = pageSource.map((item, i) => {
      return (
        <TabNavigator.Item
          title={item.tabName}
          selected={this.state.selectedTab === item.tabPage}
          titleStyle={{
            color: '#fff',
            fontSize: setSize(9),
            height: setSize(14),
            marginHorizontal: 10,
            marginBottom: 5,
          }}
          selectedTitleStyle={{
            color: '#fff',
            borderBottomWidth: 2,
            borderColor: '#fff',
          }}
          onPress={() => {
            this.setState({selectedTab: item.tabPage});
          }}
          key={i + 'tabs'}>
          <item.component
            onRef={item.tabPage === 'Recommended' && this.onRef}
            navigation={this.props.navigation}
          />
        </TabNavigator.Item>
      );
    });
    return (
      <View style={styles.container}>
        <Header
          centerComponent={this.navItem}
          rightComponent={() => (
            <Image
              source={require('@/assets/icon/icon_userMsg.png')}
              style={{height: setSize(11), width: setSize(11)}}
              resizeMode="contain"
              placeholderStyle={{
                backgroundColor: 'transparent',
              }}
            />
          )}
          RightOnPress={() => {
            Nav.navigate('AddressBook');
          }}
        />
        <TabNavigator
          tabBarStyle={{
            top: 0,
            backgroundColor: Color.primary,
            height: 0,
            overflow: 'hidden',
          }}
          sceneStyle={{
            paddingBottom: 0,
          }}
          tabBarShadowStyle={{height: 0}}>
          {tabViews}
        </TabNavigator>
        {/* 发布按钮 */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.news}
          onPress={() => {
            Nav.navigate('ReleaseNews', {
              reload: this.reloadNews,
            });
          }}>
          <Text
            style={{
              fontSize: setSize(8),
              color: '#fff',
              marginLeft: 10,
            }}>
            发布
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  news: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: setSize(23),
    width: setSize(30),
    right: 0,
    bottom: setSize(26),
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: Color.primary,
  },
});

function filter(state) {
  return {
    msgNum: state.msgNum,
  };
}
export default connect(filter)(Community);
