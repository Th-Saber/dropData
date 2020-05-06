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
import Input from '@/component/Input';
import {Color, setSize} from '@/utils/global.js';
import {regCode, getImgCode} from '@/apis/api.js';
import toast from '@/utils/toastMsg';
import moment from 'moment';
export default class EditUserTel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      code: '',
      imgcode: '', //图形验证码
      imgCodeUrl: '', //图形验证码地址
      time: 60,
      timeFlag: false,
      currentTimes: '',
    };
  }
  componentDidMount() {
    this.imgCodeFn();
  }
  // 点击提交
  submitFn = async () => {
    let {code, phone} = this.state;
    let regPhone = /^1\d{10}$/;
    if (!regPhone.test(phone)) {
      toast.show('请输入11位正确的手机号');
      return;
    }
    let params = {
      tel: phone,
      code,
      password: pass,
    };
    try {
      toast.show('属的撒');
    } catch (error) {
      console.log('error', error);
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
    // 验证完成
    this.setState({
      timeFlag: true,
    });
    try {
      await regCode({
        tel: phone,
        captcha: imgcode,
        currentTimes,
      });
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
  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }
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
  //获取验证码
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
  render() {
    let {phone, code, imgcode} = this.state;
    return (
      <View style={styles.container}>
        <Header back centerComponent="添加成员" />
        {/* 这是一个示例demo */}
        <View style={{paddingHorizontal: setSize(6)}}>
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
          {/* 提交按钮 */}
          <Button
            title="确定"
            buttonStyle={{
              borderRadius: 30,
              backgroundColor: Color.primary,
            }}
            disabled={!phone && !code}
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
    marginVertical: setSize(6),
    borderRadius: 6,
    borderWidth: 1,
  },
});
