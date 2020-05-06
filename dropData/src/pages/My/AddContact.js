import React, {Component} from 'react';
import {StyleSheet, View, Keyboard} from 'react-native';
import {Button} from 'react-native-elements';
import {connect} from 'react-redux';
import toast from '@/utils/toastMsg';
import Header from '@/component/Header';
import {Color, setSize} from '@/utils/global.js';
import Nav from '@/navigators/NavigationService';
import Input from '@/component/Input';
import {addContact} from '@/apis/api';

class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      name: '',
      id: 0, //id
      isSubmit: false,
      type: 'add', //add:添加用户  edit:修改用户
    };
  }
  componentDidMount = () => {
    let type = this.props.navigation.getParam('type');
    let data = this.props.navigation.getParam('data');
    let params = {
      type,
    };
    if (type === 'edit') {
      params = Object.assign({}, params, data);
    }
    this.setState(params);
  };
  //
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };
  //   点击提交
  submitFn = async () => {
    let {phone, name, id} = this.state;
    let data = this.props.navigation.getParam('data');
    if (data && phone === data.phone && name === data.name) {
      Nav.goBack();
      return;
    }
    Keyboard.dismiss();
    let regPhone = /^1\d{10}$/;
    if (!regPhone.test(phone)) {
      toast.show('请输入11位正确的手机号');
      return;
    }
    let params = {
      username: name,
      mobile: phone,
      id,
    };
    !params.id && delete params.id;
    this.setState({
      isSubmit: true,
    });
    try {
      await addContact(params);
      let callback = this.props.navigation.getParam('callback');
      callback && callback();
      toast.show('操作成功', 2000, () => {
        Nav.goBack();
      });
    } catch (error) {
      this.setState({
        isSubmit: false,
      });
      console.log('联系人请求失败', error);
    }
  };
  render() {
    let {phone, name, isSubmit, type} = this.state;
    return (
      <View style={styles.container}>
        <Header
          back
          centerComponent={type === 'add' ? '添加联系人' : '修改联系人'}
        />
        <View
          style={{
            margin: setSize(6),
            backgroundColor: '#fff',
            borderRadius: 6,
          }}>
          {/* 输入框组 */}
          <Input
            LIcon={require('@/assets/icon/tel.png')}
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
          <Input
            LIcon={require('@/assets/icon/user.png')}
            value={name}
            placeholder="请输入用户名"
            maxLength={12}
            boxStyle={{
              paddingRight: setSize(6),
            }}
            RComponent={name ? null : () => null}
            onChangeText={text => this.setState({name: text})}
            ROnPress={() => this.setState({name: ''})}
          />
          <Button
            title="确认添加"
            containerStyle={{
              marginHorizontal: setSize(15),
              marginVertical: setSize(5),
            }}
            buttonStyle={{
              borderRadius: 30,
              backgroundColor: Color.primary,
            }}
            disabled={isSubmit || !phone || !name}
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
    marginTop: 30,
    borderColor: Color.minBorder,
    borderRadius: 6,
    borderWidth: 1,
  },
});
function filter(state) {
  return {
    userdata: state.userdata,
  };
}
export default connect(filter)(AddContact);
