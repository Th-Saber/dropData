import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Avatar, Icon, Image, Badge} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import {getEquipmentList, addMachine} from '@/apis/api';
import toast from '@/utils/toastMsg';
import Icomoon from 'react-native-vector-icons/Icomoon';
import FlatScroll from '@/component/FlatScroll';
import ActionSheet from 'react-native-actionsheet';
import {Color, setSize} from '@/utils/global.js';
export default class Equipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      //   分页
      pages: {
        page: 1,
        size: 10,
      },
      dieData: [
        {machineId: 450, name: '未来的设备', type: 1, disable: true},
        {machineId: 21, name: '未来的设备', type: 2, disable: true},
      ],
      isNextPage: false, //是否为最后一页
      optionLists: ['添加已有帐号', '添加未注册账号'],
      //   设备测试id
      testId: [
        'F5E79E471138',
        '8A6B314C63EC',
        'E654897B7C90',
        '7FE332D87B35',
        '62E72454E8A8',
        '7667F056AF70',
        'CD3CF7EDBBE3',
        '07D81A93DC5B',
        'EF4E363C7E50',
        'DD7F41E6FC9C',
        '851BF7AC40F7',
        '06A863A79E1F',
        'C0395D098F3F',
        '59B7602F3CE5',
        '15E22E099731',
        '67A90228F3EE',
        'C7093A35F6BF',
        '1C3022E8778A',
        'EFE6C1389263',
        '10B86144954F',
        'DB5B27F1C612',
        '4F279F0132D5',
        'A2BD93299158',
        '01130F4A38AD',
        '0D59D3086214',
        '6F71BEF1DFC0',
      ],
    };
  }
  componentDidMount() {
    // this.ActionSheet && this.ActionSheet.hide();
    this.searchFn();
  }
  //   请求列表
  searchFn = async callback => {
    let {pages, dieData} = this.state;
    try {
      let res = await getEquipmentList(pages);
      let dataArr = res.data.records;
      dataArr.forEach(v => {
        v.infos = v.infos.concat(dieData);
      });
      this.setState(state => ({
        data: pages.page ? dataArr : [...state.data, ...dataArr],
        isNextPage: res.data.current === res.data.pages,
      }));
      //   判断当前页是否为最后一页
      callback && callback(true);
    } catch (error) {
      console.log(error);
    }
  };
  //   设备绑定
  addEquipment = async (userId, deviceId) => {
    Nav.navigate('Camera');
    return;
    try {
      await addMachine({userId, deviceId});
      this.setState(
        {
          pages: Object.assign({}, this.state.pages, {page: 1}),
        },
        () => {
          toast.show('设备绑定成功', 1000, () => {
            this.searchFn();
          });
        },
      );
    } catch (error) {
      console.log('error', error);
    }
  };
  //   渲染子组件
  renderItem = item => {
    let {testId} = this.state;
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
            height: setSize(39),
            paddingHorizontal: setSize(6),
          }}>
          {/* 头像 */}
          <Avatar
            rounded
            icon={{name: 'user', type: 'antdesign'}}
            source={{uri: item.imageUrl}}
            size={setSize(27)}
          />
          {/* 头像右侧用户相关信息 */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}>
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
              {/* badge */}
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
                    fontSize: setSize(4.25),
                  }}
                  badgeStyle={{
                    backgroundColor: Color.downPrimary,
                    height: 'auto',
                    paddingHorizontal: 2,
                    paddingVertical: 1,
                  }}
                />
                <Text
                  style={{
                    color: Color.primary,
                    fontSize: setSize(4),
                    marginLeft: setSize(3),
                  }}>
                  {item.tel}
                </Text>
              </View>
            </View>
            <Badge
              value="添加设备"
              textStyle={{
                color: Color.primary,
                fontSize: setSize(5),
              }}
              badgeStyle={{
                backgroundColor: Color.downPrimary,
                height: 'auto',
                paddingHorizontal: setSize(2),
                paddingVertical: 1,
              }}
              onPress={() => {
                this.addEquipment(item.uid, testId[9]);
              }}
            />
          </View>
        </View>
        {/* 循环创建详细指示条 */}
        {item.infos.map((v, i) => {
          return (
            <View
              key={i + 'infos'}
              style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                height: setSize(29),
                opacity: v.disable ? 0.5 : 1,
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      color: Color.primary,
                      fontSize: setSize(5.25),
                      marginRight: setSize(10),
                    }}
                    onPress={() => {
                      if (v.disable) return;
                      Nav.navigate('VidioDemo', {
                        machineId: v.type,
                      });
                    }}>
                    使用演示
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="right"
                    type="antdesign"
                    color={Color.minText}
                    size={setSize(5)}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
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
  //添加成员按钮
  _rightPress = () => {
    if (this.props.data.userdata.homeUserId !== -1) {
      toast.show('您不是主账号，无法添加成员。。。');
      return;
    }
    this.actionSheet.show();
  };
  // 点击底部框
  onPressIndex = i => {
    switch (i) {
      case 0:
        Nav.navigate('AddUserAre', {callback: this._pullRefresh});
        this.actionSheet.hide();
        break;
      case 1:
        Nav.navigate('AddUser', {callback: this._pullRefresh, type: 'addUser'});
        this.actionSheet.hide();
        break;
      default:
        break;
    }
  };
  //  头部组件
  _actionTitle = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#fff',
          paddingHorizontal: setSize(8),
          width: '100%',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={1}
          hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}>
          <Text
            style={{
              color: Color.mainText,
              fontSize: setSize(8),
            }}>
            添加成员
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}
          onPress={() => {
            this.actionSheet.hide();
          }}>
          <Text
            style={{
              color: Color.mainText,
              fontSize: setSize(8),
            }}>
            取消
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    let {data, optionLists, pages} = this.state;
    const actionTitle = this._actionTitle();
    let options = optionLists.map((v, i) => {
      return (
        <View
          key={i + 'touch'}
          style={{
            backgroundColor: Color.primary,
            width: '94%',
            height: '94%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
          }}>
          <Text style={{color: '#fff', fontSize: setSize(8)}}>{v}</Text>
        </View>
      );
    });
    return (
      <View style={styles.container}>
        <Header
          back
          centerComponent="人员设备管理"
          rightComponent={() => (
            <Icon
              name="adduser"
              type="antdesign"
              color="#fff"
              size={setSize(10)}
            />
          )}
          RightOnPress={this._rightPress}
        />
        <FlatScroll
          data={data}
          dropDown
          pull={data.length > pages.size}
          renderItem={this.renderItem}
          downRefresh={this._downRefresh}
          pullRefresh={this._pullRefresh}
        />
        <ActionSheet
          ref={o => (this.actionSheet = o)}
          onPress={this.onPressIndex}
          //   cancelButtonIndex={1} //不设置取消按钮 点击背景不隐藏
          title={actionTitle}
          options={options}
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
