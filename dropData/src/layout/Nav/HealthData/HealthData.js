import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Avatar, Icon, Image, Badge} from 'react-native-elements';
import Header from '@/component/Header';
import FlatScroll from '@/component/FlatScroll';
import Nav from '@/navigators/NavigationService';
import {getHealthList} from '@/apis/api';
import Icomoon from 'react-native-vector-icons/Icomoon';
import {Color, setSize} from '@/utils/global.js';
export default class HealthData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], //健康数据
      refreshing: false,
      showFoot: 0, //下拉刷新状态 1:刷新中  2:没有更多数据  0:刷新成功
    };
  }
  componentDidMount() {
    //监听页面退出
    this.searchFn();
  }
  //   数据请求
  searchFn = async callback => {
    try {
      let res = await getHealthList();
      this.setState({
        data: res.data,
      });
      //   判断当前页是否为最后一页
      callback && callback();
    } catch (error) {}
  };
  //   跳转到他的主页
  _jumpTa = userId => {
    Nav.navigate('HisHome', {id: userId});
  };
  //   显示健康或者异常
  returnHealth = v => {
    let flag = v >= 90;
    return (
      <Badge
        value={flag ? '健康' : '异常'}
        textStyle={{
          color: flag ? Color.success : Color.danger,
          fontSize: setSize(4.25),
        }}
        badgeStyle={{
          backgroundColor: flag ? Color.successTint : Color.dangerTint,
          height: 'auto',
          paddingHorizontal: setSize(2),
          paddingVertical: 1,
        }}
      />
    );
  };
  //  跳到尿常规检测仪
  jumpInfo = (item, obj) => {
    let params = Object.assign({}, obj, {
      userId: item.userId,
      name: item.name,
      imageUrl: item.avator,
      age: item.age,
      sex: item.sex,
      tel: item.tel,
      master: item.master,
      mName: obj.name,
    });
    Nav.navigate('UrineInfo', {params});
  };
  //   渲染子组件
  renderItem = item => {
    let newAvatar = {};
    if (item.avator) {
      newAvatar.source = {
        uri: item.avator,
      };
    } else {
      newAvatar.icon = {name: 'user', type: 'antdesign'};
    }
    return (
      <View
        style={{
          //   height: setSize(76),
          marginTop: setSize(4.25),
          backgroundColor: '#fff',
          borderRadius: 6,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            paddingHorizontal: setSize(6),
            height: setSize(39),
          }}>
          {/* 头像 */}
          <Avatar
            rounded
            {...newAvatar}
            size={setSize(20.25)}
            onPress={this._jumpTa.bind(this, item.userId)}
          />
          {/* 头像右侧用户相关信息 */}
          <View style={{marginLeft: setSize(5), flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: Color.mainText,
                  fontSize: setSize(7.5),
                  maxWidth: setSize(50),
                }}
                numberOfLines={1}
                ellipsizeMode="tail">
                &nbsp;{item.name}&nbsp;
              </Text>
              <Icomoon
                size={setSize(7)}
                name={item.sex === 1 ? 'man' : 'woman'}
                color={item.sex === 1 ? '#75C4EF' : '#FF768D'}
              />
              <Text
                style={{
                  fontSize: setSize(4),
                  color: Color.infoText,
                  alignSelf: 'center',
                  marginLeft: setSize(4),
                }}>
                {item.age}岁
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: setSize(2.5),
              }}>
              <Badge
                value={item.isMaster ? '主账号' : '成员'}
                textStyle={{
                  color: Color.primary,
                  fontSize: setSize(5),
                }}
                badgeStyle={{
                  backgroundColor: Color.downPrimary,
                  borderRadius: 20,
                  height: 'auto',
                  paddingHorizontal: setSize(2),
                  paddingVertical: 1,
                }}
              />
              <Text
                style={{
                  color: Color.primary,
                  fontSize: setSize(5),
                  marginLeft: setSize(3),
                }}>
                {item.tel}
              </Text>
            </View>
          </View>
        </View>
        {/* 循环创建详细指示条 */}
        {item.machines.map((v, i) => {
          return (
            <TouchableOpacity
              key={i + 'indicate'}
              activeOpacity={0.8}
              onPress={() => {
                this.jumpInfo(item, v);
              }}
              style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                height: setSize(29),
                paddingHorizontal: setSize(4),
                borderTopColor: Color.downBorder,
                borderTopWidth: 1,
              }}>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    color: Color.mainText,
                    fontSize: setSize(7.5),
                  }}>
                  {v.name}
                </Text>
                <Text
                  style={{
                    color: Color.minText,
                    fontSize: setSize(5),
                  }}>
                  ID:{v.machineId}
                </Text>
              </View>
              <Text
                style={{
                  flex: 1,
                  color: Color.infoText,
                  fontSize: setSize(5.25),
                  textAlign: 'center',
                }}>
                綜合指数
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {/* 健康指数 */}
                {this.returnHealth(v.score)}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: Color.primary,
                      fontSize: setSize(8),
                    }}>
                    {v.score}&nbsp;
                    <Text
                      style={{
                        color: Color.mainText,
                        fontSize: setSize(5.25),
                      }}>
                      分&nbsp;
                    </Text>
                  </Text>
                  <Icon
                    name="right"
                    type="antdesign"
                    color={Color.minText}
                    size={setSize(8)}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  //  下拉刷新
  _downRefresh = callback => {
    this.searchFn(callback);
  };
  render() {
    let {data} = this.state;
    return (
      <View style={styles.container}>
        <Header centerComponent="健康数据" />
        <FlatScroll
          data={data}
          dropDown
          renderItem={this.renderItem}
          downRefresh={this._downRefresh}
          pullRefresh={this._pullRefresh}
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
