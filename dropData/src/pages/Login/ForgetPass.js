import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Header from '@/component/Header';
import Input from '@/component/Input';
import {Color, setSize, cleanStorage} from '@/utils/global';
import {Button, Image} from 'react-native-elements';
import {editCode, getImgCode, findWePwd} from '@/apis/api';
import toast from '@/utils/toastMsg';
import moment from 'moment';
import Nav from '@/navigators/NavigationService';
import Avatar from './Avatar'; //登录头像框
export default class ForgetPass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '', //手机号
      code: '', //验证码
      imgcode: '', //图形验证码
      currentTimes: '', //图形验证码时间措
      imgCodeUrl: '', //图形验证码地址
      newPass: '', //新密码
      affirmPass: '', //确认密码
      passType: true, //新密码框类型
      affirmPassType: true, //确认密码框类型
      time: 60, //倒计时
      timeFlag: false,
      btnLoading: false, //按钮禁用状态
    };
  }
  componentDidMount = () => {
    this.imgCodeFn();
  };
  submitFn = async () => {
    let {newPass, affirmPass, phone, code} = this.state;
    let regPhone = /^1\d{10}$/;
    if (!regPhone.test(phone)) {
      toast.show('请输入正确的手机号码');
      return;
    }
    if (newPass !== affirmPass) {
      toast.show('两次密码输入不一致');
      return;
    }
    this.setState({btnLoading: true});
    try {
      await findWePwd({
        tel: phone,
        pw: newPass,
        code,
      });
      toast.show('找回密码成功');
      let inLogin = this.props.navigation.getParam('inLogin'); //判断找回密码的接口
      if (inLogin) {
        Nav.goBack();
      } else {
        cleanStorage();
        Nav.resetRouter('Login');
      }
    } catch (error) {
      console.log(error);
      this.setState({btnLoading: false});
    }
  };
  // 设置倒计时
  setInt = async () => {
    let {phone, timeFlag, imgcode, currentTimes} = this.state;
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
      await editCode({tel: phone, captcha: imgcode, currentTimes});
      this.timer = setInterval(() => {
        if (this.state.time <= 0) {
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
      console.log('错误', error);
      this.setState({
        timeFlag: false,
      });
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
  //获取图形验证码
  imgCodeFn = async () => {
    try {
      let currentTimes = moment().valueOf();
      let res = await getImgCode({currentTimes});
      this.setState({
        imgCodeUrl: res.data,
        currentTimes,
      });
    } catch (error) {}
  };
  countDown = () => {
    let {time, timeFlag} = this.state;
    return (
      <TouchableOpacity
        style={{
          //   width: 86,
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
  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }
  render() {
    let {
      phone,
      code,
      newPass,
      affirmPass,
      passType,
      affirmPassType,
      imgcode,
      btnLoading,
    } = this.state;
    return (
      <View style={{flex: 1}}>
        <Header back centerComponent="忘记密码" />
        <View style={{flex: 1, marginHorizontal: 18}}>
          <Avatar />
          <View style={styles.input}>
            <Input
              LIcon={require('@/assets/icon/icon_phone.png')}
              value={phone}
              placeholder="请输入手机号"
              keyboardType="numeric"
              boxStyle={{
                paddingRight: setSize(6),
              }}
              RComponent={phone ? null : () => null}
              onChangeText={text => this.setState({phone: text})}
              ROnPress={() => this.setState({phone: ''})}
            />
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
              maxLength={6}
              onChangeText={text => this.setState({code: text})}
              RComponent={this.countDown}
            />
            <Input
              LIcon={require('@/assets/icon/icon_pwd.png')}
              RIcon={
                passType
                  ? require('@/assets/icon/icon_eays_open.png')
                  : require('@/assets/icon/icon_eays_close.png')
              }
              value={newPass}
              maxLength={16}
              boxStyle={{
                paddingRight: setSize(6),
              }}
              passType={passType}
              placeholder="请输入新密码"
              onChangeText={text => this.setState({newPass: text})}
              ROnPress={() =>
                this.setState(state => ({
                  passType: !state.passType,
                }))
              }
            />
            <Input
              LIcon={require('@/assets/icon/icon_pwd.png')}
              RIcon={
                affirmPassType
                  ? require('@/assets/icon/icon_eays_open.png')
                  : require('@/assets/icon/icon_eays_close.png')
              }
              value={affirmPass}
              maxLength={16}
              passType={affirmPassType}
              boxStyle={{
                borderBottomWidth: 0,
                paddingRight: setSize(6),
              }}
              placeholder="请确认新密码"
              onChangeText={text => this.setState({affirmPass: text})}
              ROnPress={() =>
                this.setState(state => ({
                  affirmPassType: !state.affirmPassType,
                }))
              }
            />
          </View>
          {/* 提交按钮 */}
          <Button
            title="完成"
            containerStyle={{marginTop: 30}}
            buttonStyle={{
              borderRadius: 30,
              backgroundColor: Color.primary,
            }}
            disabled={
              (!phone && !code && !newPass && !affirmPass) || btnLoading
            }
            disabledStyle={{
              backgroundColor: Color.downPrimary,
            }}
            disabledTitleStyle={{color: '#fff'}}
            onPress={this.submitFn}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    marginTop: 30,
    borderColor: Color.minBorder,
    borderRadius: 6,
    borderWidth: 1,
  },
});
