import React, {Component} from 'react';
import {Text, StyleSheet, View, TextInput} from 'react-native';
import {Image, Button} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import {Color, setSize} from '@/utils/global.js';
export default class SetUserName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.navigation.getParam('name'),
    };
  }
  // 提交
  submitFn = () => {
    let oldName = this.props.navigation.getParam('name');
    if (oldName !== this.state.name) {
      let callback = this.props.navigation.getParam('callback');
      callback && callback(this.state.name);
    }
    Nav.goBack();
  };
  render() {
    let {name} = this.state;
    return (
      <View style={styles.container}>
        <Header
          back
          centerComponent="设置用户名"
          rightComponent={() => (
            <Text style={{fontSize: setSize(7), color: '#fff'}}>确定</Text>
          )}
          RightOnPress={this.submitFn}
        />
        <View
          style={{
            height: setSize(20),
            borderRadius: 6,
            borderColor: Color.primary,
            borderWidth: 1,
            backgroundColor: '#fff',
            paddingHorizontal: setSize(4),
            margin: setSize(6),
          }}>
          <TextInput
            value={name}
            selectionColor={Color.primary}
            placeholder="请输入用户名"
            placeholderTextColor={Color.minText}
            maxLength={12}
            style={{
              flex: 1,
              margin: 0,
              padding: 0,
              height: setSize(20),
              fontSize: setSize(7),
              color: Color.minText,
            }}
            onChangeText={text => {
              this.setState({
                name: text,
              });
            }}
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
