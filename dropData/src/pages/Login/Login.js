import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {Button, Icon, Image} from 'react-native-elements';
import {storage} from '@/storage';
import Header from '@/component/Header';
import Avatar from './Avatar'; //登录头像框
import Input from '@/component/Input';
import Nav from '@/navigators/NavigationService';
import toast from '@/utils/toastMsg';
import moment from 'moment';
import message from '@/apis/message';
import {loginCode, login, getImgCode} from '@/apis/api';
import {Color, setSize} from '@/utils/global';
import {save_userdata} from '@/store/actions'; //引入redux
const {height} = Dimensions.get('window');
export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      pass: '',
      passType: true, //输入框类型
      checked: true,
      isCode: false, //是否验证码登录
      imgcode: '', //图形验证码
      imgCodeUrl: '', //图形验证码地址
      currentTimes: '', //时间措
      code: '',
      time: 60,
      timeFlag: false,
      btnLoading: false, //按钮禁用
    };
  }
  componentDidMount() {
    //监听页面退出
    this.viewDidAppear1 = this.props.navigation.addListener(
      'willFocus',
      obj => {
        message.close();
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
  };
  componentWillUnmount() {
    this.viewDidAppear1.remove();
    this.viewDidAppear2.remove();
    this.timer && clearInterval(this.timer);
  }
  // 点击提交
  submitFn = async () => {
    let {code, pass, phone, isCode, checked} = this.state;
    let regPhone = /^1\d{10}$/;
    if (!regPhone.test(phone)) {
      toast.show('请输入11位正确的手机号');
      return;
    }
    if (!checked) {
      toast.show('请勾选用户使用协议');
      return;
    }
    let params = {
      tel: phone,
      code,
      password: pass,
    };
    this.setState({btnLoading: true});
    // 是否是验证码登录
    isCode ? delete params.password : delete params.code;
    try {
      let res = await login(params);
      storage.save('userdata', res.data);
      this.props.dispatch(save_userdata(res.data));
      message.open();
      toast.show('登录成功', 1000, () => {
        Nav.resetRouter('Nav');
      });
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
      await loginCode({tel: phone, captcha: imgcode, currentTimes});
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
  //   倒计时组件
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
  //
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
  render() {
    let {
      phone,
      pass,
      passType,
      checked,
      isCode,
      code,
      imgcode,
      btnLoading,
    } = this.state;
    return (
      <View style={{flex: 1, minHeight: height}}>
        <Header centerComponent="登录" />
        <View style={{marginHorizontal: 18, flex: 1}}>
          <Avatar />
          {/* 输入框组 */}
          <View style={styles.input}>
            <Input
              LIcon={require('@/assets/icon/icon_phone.png')}
              value={phone}
              placeholder="请输入手机号"
              boxStyle={{
                paddingRight: setSize(6),
              }}
              RComponent={phone ? null : () => null}
              keyboardType="numeric"
              onChangeText={text => this.setState({phone: text})}
              ROnPress={() => this.setState({phone: ''})}
            />
            {isCode ? (
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
            ) : (
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
                  this.setState(state => ({passType: !state.passType}))
                }
              />
            )}
          </View>
          {/* 提交按钮 */}
          <Button
            title="登录"
            containerStyle={{marginTop: 30}}
            buttonStyle={{
              borderRadius: 30,
              backgroundColor: Color.primary,
            }}
            disabled={(!phone && (!pass || !code)) || btnLoading}
            disabledStyle={{backgroundColor: Color.downPrimary}}
            disabledTitleStyle={{color: '#fff'}}
            onPress={this.submitFn}
          />
          {/* 忘记密码  登录方式 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                if (!isCode) {
                  this.imgCodeFn();
                }
                this.setState(state => ({
                  isCode: !state.isCode,
                  pass: '',
                  code: '',
                  imgcode: '',
                  imgCodeUrl: '',
                }));
              }}>
              <Text style={{color: Color.primary}}>
                {isCode ? '密码登录' : '验证码登录'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                Nav.navigate('ForgetPass', {inLogin: true});
              }}>
              <Text style={{color: Color.primary}}>忘记密码</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footGet}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.setState(state => ({
                  checked: !state.checked,
                }));
              }}>
              <View
                style={{
                  height: setSize(7),
                  width: setSize(7),
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  borderColor: Color.primary,
                  borderWidth: checked ? 0 : 0.5,
                  marginRight: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {checked && (
                  <Icon
                    type="antdesign"
                    name="checkcircle"
                    color={Color.primary}
                    size={setSize(7)}
                  />
                )}
              </View>
              <Text
                style={{
                  color: Color.primary,
                  fontSize: 12,
                }}>
                我已阅读并同意&nbsp;
                <Text
                  style={{
                    textDecorationStyle: 'solid',
                    textDecorationLine: 'underline',
                  }}
                  onPress={() => {
                    alert('协议');
                  }}>
                  用户协议
                </Text>
                &nbsp;与&nbsp;
                <Text
                  style={{
                    textDecorationStyle: 'solid',
                    textDecorationLine: 'underline',
                  }}
                  onPress={() => {
                    alert('营私');
                  }}>
                  隐私政策
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
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
  footGet: {
    flex: 1,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
export default Login;
