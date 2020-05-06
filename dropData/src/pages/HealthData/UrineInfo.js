import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Image, Badge, Avatar, Icon} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import Icomoon from 'react-native-vector-icons/Icomoon';
import TableList from '@/component/TableList';
import {Color, setSize} from '@/utils/global.js';
import toast from '@/utils/toastMsg';
import {scoreType} from '@/utils/common.js';
import {getHealthInfo} from '@/apis/api';
import moment from 'moment';
export default class UrineInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        name: '张小姐',
        sex: 'woman',
        type: '成员',
        avatar: '',
        score: 95,
        urine: 73,
        age: 19,
        phone: 18888888888,
      },
      infoData: {
        createTime: new Date(),
        datas: [],
        exceedRate: 0,
        label: '测试',
        physicalAge: 0,
        physicalState: '健康',
        scoreState: 0,
        state: {
          brainScore: 0, //大脑
          larynxScore: 0, //喉咙
          lungScore: 0, //肺
          heartScore: 0, //心脏
          liverScore: 0, //肝
          stomachScore: 0, //胃
          smallIntestineScore: 0, //小肠
          largeIntestineScore: 0, //大肠
          kidneyScore: 0, //肾
          endocrineScore: 0, //内分泌
        },
      },
      //  器官列表
      organList: [
        {
          name: '脑',
          value: 'brainScore',
          icon: 'brain',
        },
        {
          name: '喉',
          value: 'larynxScore',
          icon: 'throat',
        },
        {
          name: '肺',
          value: 'lungScore',
          icon: 'lung',
        },
        {
          name: '心脏',
          value: 'heartScore',
          icon: 'heart',
        },
        {
          name: '肝',
          value: 'liverScore',
          icon: 'liver',
        },
        {
          name: '胃',
          value: 'stomachScore',
          icon: 'stomach',
        },
        {
          name: '小肠',
          value: 'smallIntestineScore',
          icon: 'smallIntestine',
        },
        {
          name: '大肠',
          value: 'largeIntestineScore',
          icon: 'largeIntestine',
        },
        {
          name: '肾',
          value: 'kidneyScore',
          icon: 'renal',
        },
        {
          name: '内分泌',
          value: 'endocrineScore',
          icon: 'endocrine',
        },
      ],
      //   器官颜色列表
      colorList: [
        {
          color: '#55B569',
          title: '极好',
        },
        {
          color: '#38A9FC',
          title: '健康',
        },
        {
          color: '#EEBB4F',
          title: '一般',
        },
        {
          color: '#E2463D',
          title: '较差',
        },
      ],
      //  表格
      tableData: [],
      //   表头数据
      tableHeader: [
        {
          name: '项目名',
          value: 'name',
          width: 80,
        },
        {
          name: '获取结果',
          value: 'result',
          //   width: 60,
        },
        {
          name: '单位',
          value: 'unit',
        },
        {
          name: '范围',
          value: 'reference',
        },
        {
          name: '评分',
          value: 'score',
        },
        {
          name: '操作',
          width: 30,
          colCom: (v, i) => {
            return (
              <TouchableOpacity
                activeOpacity={0.6}
                hitSlop={{
                  top: 20,
                  left: 20,
                  right: 20,
                  bottom: 20,
                }}
                onPress={() => this.jumpTableInfo(v, i)}>
                <Icon
                  name="right"
                  type="antdesign"
                  color={Color.infoText}
                  size={setSize(6)}
                />
              </TouchableOpacity>
            );
          },
        },
      ],
    };
  }
  componentDidMount() {
    // console.log('数据', this.props.navigation.getParam('params'));
    this.setState(
      {
        userData: this.props.navigation.getParam('params'),
      },
      () => {
        this.searchFn();
      },
    );
  }
  //   跳转到详细数据
  jumpTableInfo = item => {
    // console.log('详细', item);
    let {userData} = this.state;
    let data = {
      name: item.name,
      rangeMax: item.rangeMax,
      rangeMin: item.rangeMin,
      phName: item.phName,
      uid: userData.userId,
      result: item.result ? item.result : 0,
      machineType: userData.type,
      machineId: userData.machineId,
    };
    Nav.navigate('IndexDetail', {data});
  };
  //   请求数据
  searchFn = async () => {
    let {machineId, userId, type} = this.state.userData;
    let params = {
      machineId,
      machineType: type,
      uid: userId,
    };
    try {
      let res = await getHealthInfo(params);
      console.log('res', res.data);
      this.setState({
        infoData: res.data,
      });
    } catch (error) {
      console.log('请求错误', error);
    }
  };
  //   跳转到他的主页
  _jumpTa = () => {
    Nav.navigate('HisHome', {id: this.state.userData.userId});
  };
  //  得分评价  return [arrey]
  scoreList = () => {
    let {infoData, userData} = this.state;
    return [
      {
        name: '击败了全国',
        value: infoData.exceedRate + '%',
      },
      {
        name: '身体年龄',
        value: infoData.physicalAge + '岁',
      },
      {
        name: userData.sex === 1 ? '男人中的' : '女人中的',
        value: infoData.label,
      },
    ];
  };
  //  显示评价得分情况
  showInfo = value => {
    let obj = {};
    if (value > 0) {
      obj = {
        text: '+',
        msg: '对比上次，得分增加',
      };
    } else if ((value = 0)) {
      obj = {
        text: '=',
        msg: '对比上次，得分一致',
      };
    } else {
      obj = {
        text: '-',
        msg: '对比上次，得分减少',
      };
    }
    return (
      <View
        style={{
          height: setSize(9),
          backgroundColor: Color.deepPrimary,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: setSize(2),
          marginBottom: 1,
        }}>
        <View
          style={{
            height: setSize(7),
            width: setSize(7),
            borderRadius: 20,
            backgroundColor: Color.downPrimary,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#fff',
              lineHeight: setSize(7.5),
            }}>
            {obj.text}
          </Text>
        </View>
        <Text
          style={{
            fontSize: setSize(6),
            color: Color.primary,
            flex: 1,
            textAlign: 'center',
          }}>
          {obj.msg}
        </Text>
      </View>
    );
  };
  //点击图标
  IconPress = val => {
    if (val == -1 || val == undefined) {
      toast.show('设备未检测出该数值，请升级您的设备');
    }
  };
  render() {
    let {userData, organList, colorList, infoData, tableHeader} = this.state;
    const scoreList = this.scoreList();
    return (
      <View style={styles.container}>
        <Header
          back
          centerComponent={userData.mName ? userData.mName : '指数详情'}
        />
        {/* 这是一个示例demo */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{paddingHorizontal: setSize(6), flex: 1}}>
          {/* 头部title_box */}
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 6,
              paddingHorizontal: setSize(4),
              paddingVertical: setSize(6),
              marginTop: setSize(5),
            }}>
            <Text style={styles.header}>综合指数</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                paddingTop: setSize(6),
              }}>
              {/* 头像 */}
              <Avatar
                rounded
                icon={{name: 'user', type: 'antdesign'}}
                source={{uri: userData.imageUrl}}
                size={setSize(25)}
                onPress={this._jumpTa}
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
                      fontSize: setSize(8),
                      maxWidth: setSize(50),
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    &nbsp;{userData.name}&nbsp;
                  </Text>
                  <Icomoon
                    size={setSize(7)}
                    name={userData.sex === 1 ? 'man' : 'woman'}
                    color={userData.sex === 1 ? '#75C4EF' : '#FF768D'}
                  />
                  <Text
                    style={{
                      fontSize: setSize(6),
                      color: Color.infoText,
                      alignSelf: 'center',
                      marginLeft: setSize(4),
                    }}>
                    {userData.age}岁
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: setSize(2.5),
                  }}>
                  <Badge
                    value={userData.master ? '主账户' : '成员'}
                    textStyle={{
                      color: Color.primary,
                      fontSize: setSize(5),
                    }}
                    badgeStyle={{
                      backgroundColor: Color.downPrimary,
                      height: 'auto',
                      paddingHorizontal: 3,
                      paddingVertical: 1,
                      borderRadius: 20,
                    }}
                  />
                  <Text
                    style={{
                      color: Color.primary,
                      fontSize: setSize(5),
                      marginLeft: setSize(3),
                    }}>
                    {userData.tel}
                  </Text>
                </View>
              </View>
            </View>
            {/* 分数 */}
            <View
              style={{
                marginTop: setSize(10),
                paddingHorizontal: setSize(4),
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: setSize(66),
                  height: setSize(17),
                }}>
                <Text
                  style={{
                    fontSize: setSize(17),
                    color: Color.mainText,
                    lineHeight: setSize(17),
                  }}>
                  {userData.score}
                  <Text
                    style={{
                      fontSize: setSize(6),
                      color: Color.infoText,
                    }}>
                    &emsp;分
                  </Text>
                </Text>
                <Text
                  style={{
                    fontSize: setSize(9),
                    lineHeight: setSize(17),
                    color: Color.mainText,
                    alignSelf: 'flex-end',
                  }}>
                  {scoreType(userData.score).name}
                </Text>
              </View>
              {/* 评论消息 */}
              <View
                style={{
                  marginLeft: setSize(4),
                  alignItems: 'center',
                  width: setSize(70),
                }}>
                {this.showInfo(infoData.scoreState)}
              </View>
            </View>
            {/* 得分评价 */}
            <View
              style={{
                flexDirection: 'row',
                marginTop: setSize(2),
              }}>
              {scoreList.map((v, i) => {
                return (
                  <View
                    key={i + 'scro'}
                    style={{
                      flex: 1,
                      height: setSize(20),
                      justifyContent: 'space-between',
                      borderRightColor: Color.mainBorder,
                      borderRightWidth: i === scoreList.length - 1 ? 0 : 1,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: setSize(6),
                        color: Color.infoText,
                      }}>
                      {v.name}
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: setSize(8),
                        color: Color.primary,
                      }}>
                      {v.value}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
          {/* 人体图片 */}
          <View
            style={{
              backgroundColor: '#fff',
              marginTop: setSize(5),
              paddingHorizontal: setSize(4),
              borderRadius: 6,
              paddingTop: setSize(6),
              paddingBottom: setSize(3),
            }}>
            <Text style={styles.header}>器官状态</Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: setSize(10),
              }}>
              <Image
                source={require('@/assets/imgs/bg_human.png')}
                style={{
                  width: setSize(67),
                  height: setSize(209),
                }}
                resizeMode="contain"
                PlaceholderContent={<ActivityIndicator color={Color.primary} />}
                placeholderStyle={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                }}
                // placeholderStyle={{backgroundColor: 'transparent'}}
              />
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  flex: 1,
                  marginLeft: setSize(6),
                }}>
                {/* 循环器官 */}
                {organList.map((v, i) => {
                  return (
                    <View
                      style={{
                        width: '50%',
                        height: setSize(29),
                        marginBottom: setSize(9),
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      key={i + 'organ'}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() =>
                          this.IconPress(
                            infoData.state ? infoData.state[v.value] : -1,
                          )
                        }
                        style={{
                          height: setSize(29),
                          width: setSize(29),
                          borderRadius: setSize(15),
                          backgroundColor: Color.bgColor,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        {/* <Image
                          source={v.icon}
                          style={{width: setSize(17), height: setSize(17)}}
                          resizeMode="contain"
                        /> */}
                        <Icomoon
                          name={v.icon}
                          size={setSize(14)}
                          color={
                            scoreType(
                              infoData.state ? infoData.state[v.value] : -1,
                            ).color
                          }
                        />
                      </TouchableOpacity>

                      <View
                        style={{
                          marginLeft: setSize(-4),
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            backgroundColor: Color.infoText,
                            height: 0.5,
                            width: setSize(7),
                            marginRight: setSize(2),
                          }}></View>
                        <Text
                          style={{
                            fontSize: setSize(5),
                            color: Color.infoText,
                          }}>
                          {v.name}
                        </Text>
                      </View>
                    </View>
                  );
                })}
                <View
                  style={{
                    marginTop: setSize(4),
                    paddingRight: setSize(0),
                    flexDirection: 'row',
                    flex: 1,
                  }}>
                  {/* 指标颜色 */}
                  {colorList.map((v, i) => {
                    return (
                      <View
                        key={i + 'color'}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        <View
                          style={{
                            height: setSize(6),
                            width: setSize(3),
                            backgroundColor: v.color,
                          }}></View>
                        <Text
                          style={{
                            marginLeft: setSize(3),
                            color: Color.infoText,
                            fontSize: setSize(6),
                          }}>
                          {v.title}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
            {/* 自定义iconmoon 图标 */}
            {/* <View style={{marginVertical: 10}}>
              <Icomoon name="iconAvatar" size={26} color={Color.primary} />
              <Icomoon name="book" size={26} color={Color.primary} />
              <Icomoon name="books" size={26} color={Color.primary} />
            </View> */}
          </View>
          {/* 数据表格 */}
          <View
            style={{
              backgroundColor: '#fff',
              marginTop: setSize(5),
              borderRadius: 6,
              paddingTop: setSize(6),
              paddingBottom: setSize(3),
            }}>
            <Text style={[styles.header, {paddingHorizontal: setSize(4)}]}>
              健康数据表
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: setSize(10),
                marginBottom: setSize(3),
                paddingHorizontal: setSize(4),
              }}>
              <Text
                style={{
                  fontSize: setSize(5),
                  color: Color.infoText,
                }}>
                {moment(infoData.createTime).format('MM月DD日 HH:mm')}
                检测生成
              </Text>
              <Text
                style={{
                  fontSize: setSize(5),
                  color: Color.infoText,
                }}>
                {infoData.datas ? infoData.datas.length : 0}
                项指标结果
              </Text>
            </View>
            <TableList header={tableHeader} data={infoData.datas} />
          </View>
          {/* 底线 */}
          <Text
            style={{
              fontSize: setSize(5),
              color: Color.minText,
              textAlign: 'center',
              marginTop: setSize(16),
              marginBottom: setSize(12),
            }}>
            -----------------------&nbsp;我也是有底线的&nbsp;-----------------------
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bgColor,
  },
  header: {
    fontSize: setSize(8),
    color: Color.mainText,
  },
});
