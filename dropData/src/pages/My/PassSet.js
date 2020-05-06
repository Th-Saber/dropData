import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Button} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import {Color, setSize, cleanStorage} from '@/utils/global.js';
import toast from '@/utils/toastMsg';
import {editPass} from '@/apis/api';
export default class PassSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPass: '',
      newPass: '',
      affirmPass: '',
      listData: [
        {
          title: '旧密码',
          val: 'oldPass',
          placeholder: '请输入旧密码',
        },
        {
          title: '新密码',
          val: 'newPass',
          placeholder: '请输入新密码',
        },
        {
          title: '确认密码',
          val: 'affirmPass',
          placeholder: '请再次输入新密码',
        },
      ],
      holderIndex: null,
    };
  }
  itemInput = (obj, i) => {
    let {listData, holderIndex} = this.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: listData.length - 1 === i ? 0 : 1,
          borderBottomColor: Color.downBorder,
        }}
        key={i + 'ianput'}>
        <Text
          style={{
            fontSize: setSize(8),
            color: Color.infoText,
            paddingHorizontal: setSize(5),
          }}>
          {obj.title}
        </Text>
        <TextInput
          ref={'keywords_' + i}
          value={this.state[obj.val]}
          onFocus={() => {
            this.setState({
              holderIndex: i,
            });
          }}
          onBlur={() => {
            this.setState({
              holderIndex: null,
            });
          }}
          secureTextEntry
          selectionColor={Color.primary}
          placeholder={i === holderIndex ? '' : obj.placeholder}
          placeholderTextColor={Color.minText}
          maxLength={16}
          style={{
            flex: 1,
            margin: 0,
            padding: 0,
            height: setSize(25),
            marginHorizontal: setSize(12),
            fontSize: setSize(7),
            color: Color.mainText,
            textAlign: 'right',
          }}
          onChangeText={text => {
            text = text.replace(/[^u4E00-u9FA5]/g, '');
            this.setState({
              [obj.val]: text,
            });
          }}
        />
      </View>
    );
  };
  //  提交修改
  submitFn = async () => {
    let {oldPass, newPass, affirmPass} = this.state;
    if (this.btnLoad) return;
    if (newPass.length < 6) {
      toast.show('请输入6~16位密码');
      return;
    }
    if (newPass !== affirmPass) {
      toast.show('两次输入密码不一致');
      return;
    }
    this.btnLoad = true;
    try {
      await editPass({oldPwd: oldPass, pw: newPass});
      //   消除所有数据
      cleanStorage();
      toast.show('修改成功,请重新登录');
      Nav.resetRouter('Login');
    } catch (error) {
      console.log('error', error);
    } finally {
      this.btnLoad = false;
    }
  };
  render() {
    let {oldPass, newPass, affirmPass, listData} = this.state;
    return (
      <View style={styles.container}>
        <Header back centerComponent="密码设置" />
        {/* 这是一个示例demo */}
        <View style={{padding: setSize(6)}}>
          <View
            style={{
              borderRadius: 6,
              backgroundColor: '#fff',
            }}>
            {listData.map((v, i) => {
              return this.itemInput(v, i);
            })}
          </View>
          <TouchableOpacity
            hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
            activeOpacity={0.8}
            style={{alignSelf: 'flex-end', marginVertical: setSize(8)}}
            onPress={() => Nav.navigate('ForgetPass')}>
            <Text style={{fontSize: setSize(7), color: Color.primary}}>
              忘记密码
            </Text>
          </TouchableOpacity>
          <Button
            title="完成"
            buttonStyle={{
              borderRadius: 8,
              backgroundColor: Color.primary,
              height: setSize(20),
            }}
            titleStyle={{fontSize: setSize(8)}}
            disabledStyle={{backgroundColor: Color.downPrimary}}
            disabled={!oldPass && !newPass && !affirmPass}
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
});
