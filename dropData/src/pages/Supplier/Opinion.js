import React, {Component} from 'react';
import {Text, StyleSheet, View, TextInput} from 'react-native';
import {Image, Avatar, Icon, Button} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import {Color, setSize} from '@/utils/global.js';
import {sendfeedMsg} from '@/apis/api.js';
import toast from '@/utils/toastMsg';
export default class Opinion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      text: '',
      btnLoad: false,
    };
  }
  //   提交修改
  submitFn = async () => {
    let {text, success} = this.state;
    if (success) {
      Nav.goBack();
    } else {
      this.setState({
        btnLoad: true,
      });
      try {
        await sendfeedMsg({content: text});
        // console.log('提交成功');
        this.setState({
          success: true,
        });
      } catch (error) {
        console.log('提交失败', error);
      } finally {
        this.setState({
          btnLoad: false,
        });
      }
    }
  };
  //  显示输入框还是提交成功框
  renderItem = () => {
    let {success, text} = this.state;
    if (success) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            paddingHorizontal: setSize(10),
          }}>
          <Icon
            type="antdesign"
            name="smileo"
            size={setSize(20)}
            color={Color.primary}
          />
          <Text
            style={{
              fontSize: setSize(10),
              marginTop: setSize(10),
              marginBottom: setSize(20),
              color: Color.mainText,
            }}>
            反馈成功
          </Text>
          <Text
            style={{
              fontSize: setSize(7.5),
              color: Color.infoText,
              textAlign: 'center',
            }}>
            感谢您对智能哨兵的关注和支持，我们会认真处理您的反馈，尽快完善和修复相关功能
          </Text>
        </View>
      );
    } else {
      return (
        <TextInput
          selectionColor={Color.primary}
          maxLength={200}
          placeholder="请填写10字以上的问题描述以便我们提供更完善的服务"
          style={{
            fontSize: setSize(8),
            flex: 1,
            textAlignVertical: 'top',
            color: Color.mainText,
          }}
          multiline
          placeholderTextColor={Color.minText}
          value={text}
          onChangeText={text => {
            this.setState({
              text,
            });
          }}
        />
      );
    }
  };
  render() {
    const {success, btnLoad, text} = this.state;
    return (
      <View style={styles.container}>
        <Header back centerComponent="意见反馈" />
        {/* 这是一个示例demo */}
        <Text
          style={{
            marginTop: setSize(5),
            marginHorizontal: setSize(6),
            marginBottom: setSize(3),
            color: Color.infoText,
            fontSize: setSize(8),
          }}>
          {success ? '' : '问题和意见'}
        </Text>
        <View
          style={{
            marginHorizontal: setSize(6),
            backgroundColor: '#fff',
            borderRadius: 6,
            height: setSize(120),
          }}>
          {this.renderItem()}
        </View>
        {/* Button */}
        <Button
          title={success ? '返回' : '提交'}
          containerStyle={{
            marginTop: setSize(11),
            marginHorizontal: setSize(6),
          }}
          buttonStyle={{
            borderRadius: 6,
            backgroundColor: Color.primary,
          }}
          disabled={!text || btnLoad}
          disabledStyle={{backgroundColor: Color.downPrimary}}
          disabledTitleStyle={{color: '#fff'}}
          onPress={this.submitFn}
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
