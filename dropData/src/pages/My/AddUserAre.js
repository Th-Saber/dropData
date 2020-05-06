import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Image, Button} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import toast from '@/utils/toastMsg';
import moment from 'moment';
import Input from '@/component/Input';
import {Color, setSize} from '@/utils/global.js';
import {
  findUserCode,
  addRefUser,
  getImgCode,
  addUserForPass,
} from '@/apis/api.js';
export default class AddUserAre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tip: '成员已经拥有账号，请直接输入成员账号和验证码或密码，直接建立关联！',
      phone: '',
      code: '',
      imgcode: '',
      passType: true, //输入框类型
      pass: '',
      isCode: true,
      isSubmit: false, //是否点击提交
      imgCodeUrl: '',
      currentTimes: '',
      time: 60,
      timeFlag: false,
      isSuper: this.props.data.userdata.superUser === 1, //验证是否是超级管理员
    };
  }
  componentDidMount() {
    if (this.props.data.userdata.superUser != 1) {
      this.imgCodeFn();
    }
  }
  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }
  // 点击提交
  submitFn = async () => {
    let {phone, isCode} = this.state;
    let regPhone = /^1\d{10}$/;
    console.log(phone);
    if (!regPhone.test(phone)) {
      toast.show('请输入11位正确的手机号');
      return;
    }
    this.setState({
      isSubmit: true,
    });
    if (!isCode) {
      this.addPass();
    } else {
      this.addPhoneCode();
    }
  };
  //   成功回调函数
  successCallback = () => {
    toast.show('提交成功', 1000, () => {
      this.props.navigation.getParam('callback')();
      Nav.goBack();
    });
  };
  //   通过密码添加
  addPass = async () => {
    let {phone, pass} = this.state;
    let params = {
      tel: phone,
      password: pass,
    };
    try {
      await addUserForPass(params);
      this.successCallback();
    } catch (error) {
      console.log('错误', error);
      this.setState({
        isSubmit: false,
      });
    }
  };
  //   通过账号添加
  addPhoneCode = async () => {
    let {phone, code, isSuper} = this.state;
    let params = {
      tel: phone,
      code,
    };
    isSuper && delete params.code;
    try {
      await addRefUser(params);
      this.successCallback();
    } catch (error) {
      console.log('错误', error);
      this.setState({
        isSubmit: false,
      });
    }
  };
  // 设置倒计时
  setInt = async () => {
    let {phone, timeFlag, time, imgcode, currentTimes} = this.state;
    if (timeFlag) {
      return;
    }
    let regPhone = /^1\d{10}$/;
    if (!phone) {
      toast.show('请输入手机号');
      return;
    }
    if (!regPhone.test(phone)) {
      toast.show('请输入11位正确的手机号');
      return;
    }
    if (!imgcode) {
      toast.show('请输入图形验证码');
      return;
    }
    // 验证完成
    this.setState({
      timeFlag: true,
    });
    try {
      await findUserCode({tel: phone, captcha: imgcode, currentTimes});
      this.timer = setInterval(() => {
        if (time <= 0) {
          this.timer && clearInterval(this.timer);
          this.setState({
            time: 60,
            timeFlag: false,
          });
          return;
        }
        this.setState(state => ({
          time: --state.time,
        }));
      }, 1000);
    } catch (error) {
      this.setState({
        timeFlag: false,
      });
      console.log(error);
    }
  };
  countDown = () => {
    let {time, timeFlag} = this.state;
    return (
      <TouchableOpacity
        style={{
          height: 24,
          paddingHorizontal: 10,
          borderRadius: 12,
          marginHorizontal: 10,
          backgroundColor: Color.downPrimary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        activeOpacity={0.5}
        onPress={this.setInt}>
        <Text style={{color: Color.primary, fontSize: 12}}>
          {timeFlag ? `重新获取(${time}s)` : '获取验证码'}
        </Text>
      </TouchableOpacity>
    );
  };
  //  请求imgcode
  imgCodeFn = async () => {
    try {
      let currentTimes = moment().valueOf();
      let res = await getImgCode({currentTimes});
      this.setState({
        imgCodeUrl: res.data,
        currentTimes,
      });
    } catch (error) {
      console.log(error);
    }
  };
  //图形验证码
  imgCodeCom = () => {
    let {imgCodeUrl} = this.state;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          this.setState(
            {
              imgCodeUrl: '',
            },
            () => {
              this.imgCodeFn();
            },
          );
        }}
        style={{marginHorizontal: 10}}>
        <Image
          source={{uri: imgCodeUrl}}
          style={{width: 70, height: 26}}
          PlaceholderContent={<ActivityIndicator color={Color.primary} />}
          placeholderStyle={{
            backgroundColor: '#fff',
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };
  // 验证是否显示input框
  showInput = () => {
    let {isCode, code, pass, passType, imgcode} = this.state;
    if (isCode) {
      return (
        <View>
          <Input
            LIcon={require('@/assets/icon/icon_code.png')}
            value={imgcode}
            placeholder="请输入图形验证码"
            keyboardType="numeric"
            maxLength={6}
            onChangeText={text => this.setState({imgcode: text})}
            RComponent={this.imgCodeCom}
          />
          <Input
            LIcon={require('@/assets/icon/icon_code.png')}
            value={code}
            placeholder="请输入验证码"
            keyboardType="numeric"
            boxStyle={{
              borderBottomWidth: 0,
            }}
            maxLength={6}
            onChangeText={text => this.setState({code: text})}
            RComponent={this.countDown}
          />
        </View>
      );
    } else {
      return (
        <Input
          LIcon={require('@/assets/icon/icon_pwd.png')}
          RIcon={
            passType
              ? require('@/assets/icon/icon_eays_open.png')
              : require('@/assets/icon/icon_eays_close.png')
          }
          value={pass}
          passType={passType}
          boxStyle={{
            borderBottomWidth: 0,
            paddingRight: setSize(6),
          }}
          maxLength={16}
          placeholder="请输入密码"
          onChangeText={text => this.setState({pass: text})}
          ROnPress={() =>
            this.setState(state => ({
              passType: !state.passType,
            }))
          }
        />
      );
    }
  };
  render() {
    let {tip, phone, pass, code, isCode, isSuper, isSubmit} = this.state;
    let btnFlag = isSuper || !pass || !code;
    return (
      <View style={styles.container}>
        <Header back centerComponent="添加成员" />
        {/* 这是一个示例demo */}
        <View style={{paddingHorizontal: setSize(6)}}>
          <Text
            style={{
              color: Color.minText,
              fontSize: setSize(6),
              lineHeight: setSize(9),
              paddingVertical: setSize(8),
              paddingRight: setSize(10),
            }}>
            {tip}
          </Text>
          <View style={styles.input}>
            <Input
              LIcon={require('@/assets/icon/icon_phone.png')}
              value={phone}
              boxStyle={{
                paddingRight: setSize(6),
              }}
              placeholder="请输入手机号"
              keyboardType="numeric"
              onChangeText={text => this.setState({phone: text})}
              ROnPress={() => this.setState({phone: ''})}
              RComponent={phone ? null : () => null}
            />
            {/* 是否显示input框 */}
            {!isSuper && this.showInput()}
          </View>
          {!isSuper && (
            <Text
              style={{
                color: Color.primary,
                fontSize: setSize(7),
                marginTop: setSize(8),
                width: setSize(40),
              }}
              onPress={() => {
                this.setState(state => ({
                  isCode: !state.isCode,
                }));
              }}>
              &nbsp;{isCode ? '密码登录' : '验证码登录'}
            </Text>
          )}

          {/* 提交按钮 */}
          <Button
            title="确定"
            buttonStyle={{
              borderRadius: 30,
              marginTop: setSize(8),
              backgroundColor: Color.primary,
            }}
            disabled={!phone && btnFlag && isSubmit}
            disabledStyle={{backgroundColor: Color.downPrimary}}
            disabledTitleStyle={{color: '#fff'}}
            onPress={this.submitFn}
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
  input: {
    borderColor: Color.minBorder,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
  },
});
