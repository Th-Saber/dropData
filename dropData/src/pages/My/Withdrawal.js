import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Nav from '@/navigators/NavigationService';
import {Badge, Image, Button} from 'react-native-elements';
import Header from '@/component/Header';
import {Color, setSize} from '@/utils/global.js';
export default class Withdrawal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actType: 'alipay',
      payArr: [
        {
          payType: 'alipay',
          name: '支付宝',
          icon: require('@/assets/icon/icon_alipay.png'),
          isBind: true,
        },
        {
          payType: 'wxpay',
          name: '微信',
          icon: require('@/assets/icon/icon_wxpay.png'),
          isBind: false,
        },
      ],
      //   我的分数
      myScore: 6200,
      btnArr: [{title: '0元兑换'}, {title: '立即提现'}],
    };
  }
  btnPress = i => {
    let {actType} = this.state;
    if (i === 0) {
      alert('兑换' + actType);
    } else {
      alert('提现' + actType);
    }
  };
  render() {
    let {actType, payArr, myScore, btnArr} = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Color.bgColor,
        }}>
        <Header back centerComponent="提现" />
        <View
          style={{
            paddingHorizontal: setSize(6),
          }}>
          {/* 头部 */}
          <Text
            style={{
              fontSize: setSize(8),
              height: setSize(20),
              lineHeight: setSize(20),
              color: Color.infoText,
            }}>
            提现方式
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {payArr.map((v, i) => {
              return (
                <TouchableOpacity
                  key={i + 'btnPay'}
                  activeOpacity={0.9}
                  onPress={() => this.setState({actType: v.payType})}
                  style={{
                    height: setSize(22),
                    width: '49%',
                    marginRight: i === 0 ? setSize(4) : 0,
                    backgroundColor: '#fff',
                    borderColor: Color.downPrimary,
                    borderRadius: 4,
                    borderWidth: actType === v.payType ? 1 : 0,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={v.icon}
                    style={{
                      width: setSize(10),
                      height: setSize(10),
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontSize: setSize(8),
                      color: Color.mainText,
                      marginHorizontal: 5,
                    }}>
                    {v.name}
                  </Text>
                  {v.payType === 'alipay' && (
                    <Badge
                      value="推荐"
                      textStyle={{
                        color: Color.primary,
                        fontSize: setSize(5),
                      }}
                      badgeStyle={{
                        backgroundColor: '#fff',
                        height: 'auto',
                        borderRadius: 2,
                        borderColor: Color.primary,
                        borderWidth: 1,
                      }}
                    />
                  )}
                  {!v.isBind && (
                    <Badge
                      value="未绑定"
                      textStyle={{
                        color: Color.primary,
                        fontSize: setSize(5),
                      }}
                      badgeStyle={{
                        backgroundColor: '#fff',
                        height: 'auto',
                        borderRadius: 2,
                        borderColor: Color.primary,
                        borderWidth: 1,
                        marginLeft: 5,
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          <View
            style={{
              marginTop: setSize(7),
              paddingHorizontal: setSize(8),
              backgroundColor: '#fff',
              borderRadius: 4,
            }}>
            {/* 提现方式数据 */}
            <View style={styles.inputView}>
              <Text
                style={{
                  color: Color.mainText,
                  fontSize: setSize(8),
                }}>
                您的积分：{myScore}&nbsp;积分
              </Text>
            </View>
            <View
              style={[
                styles.inputView,
                {flexDirection: 'row', alignItems: 'center'},
              ]}>
              <Text
                style={{
                  color: Color.mainText,
                  fontSize: setSize(8),
                }}>
                您的积分：
              </Text>
              <TextInput
                placeholder="可提现20元"
                maxLength={10}
                selectionColor={Color.primary}
                style={{
                  height: setSize(10),
                  padding: 0,
                  margin: 0,
                  flex: 1,
                  color: Color.primary,
                  fontSize: setSize(8),
                }}
                placeholderTextColor={Color.minText}
                keyboardType="numeric"
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: setSize(12),
              }}>
              {btnArr.map((v, i) => {
                let flag = i === 0;
                return (
                  <View
                    style={{
                      flex: 1,
                      marginRight: flag ? setSize(16) : 0,
                    }}
                    key={i + 'btnpay'}>
                    <Button
                      title={v.title}
                      type={flag ? 'solid' : 'outline'}
                      onPress={() => this.btnPress(i)}
                      buttonStyle={[
                        {
                          backgroundColor: flag ? Color.primary : '#fff',
                          borderRadius: 20,
                          height: setSize(16),
                          paddingVertical: setSize(4),
                        },
                        !flag && {borderColor: Color.primary},
                      ]}
                      titleStyle={{
                        color: !flag ? Color.primary : '#fff',
                        fontSize: setSize(8),
                      }}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputView: {
    borderBottomColor: Color.minBorder,
    borderBottomWidth: 1,
    paddingVertical: setSize(8),
  },
});
