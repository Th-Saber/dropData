import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Color, setSize} from '@/utils/global';
import {Icon} from 'react-native-elements';
export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }
  static defaultProps = {
    LIcon: require('@/assets/icon/icon_phone.png'), //默认左侧图标
    RIcon: {name: 'closecircle', type: 'antdesign'}, //默认右侧图标
    ROnPress: () => {}, //右侧图标点击事件
    onChangeText: text => {}, //输入框改变
    placeholder: '请输入', //输入框提示文字
    value: '', //默认输入框value值
    maxLength: 11, //限制长度
    boxStyle: {}, //整体输入框容器样式
    passType: false, // 文字输入框类型 true为密码框  false为普通输入框
    inputStyle: {}, //输入框样式
    RComponent: null, //右侧自定义组件
    keyboardType: 'default', //numeric email-address default
  };
  render() {
    return (
      <View style={[styles.item_box, this.props.boxStyle]}>
        <Image
          source={this.props.LIcon}
          style={{
            width: 18,
            height: 18,
            marginHorizontal: 10,
          }}
          resizeMode="contain"
        />
        <TextInput
          keyboardType={this.props.keyboardType}
          selectionColor={Color.primary}
          maxLength={this.props.maxLength}
          placeholder={this.props.placeholder}
          secureTextEntry={this.props.passType}
          style={[styles.input_item, this.props.inputStyle]}
          placeholderTextColor={Color.minText}
          value={this.props.value}
          onChangeText={text => this.props.onChangeText(text)}
        />
        <TouchableOpacity activeOpacity={0.5} onPress={this.props.ROnPress}>
          {/* 判断是否显示右侧自定义组件 */}
          {this.props.RComponent !== null ? (
            this.props.RComponent()
          ) : typeof this.props.RIcon === 'object' ? (
            <Icon
              name={this.props.RIcon.name} //"closecircle"
              type={this.props.RIcon.type} //"antdesign"
              color={Color.minText}
              size={setSize(8)}
            />
          ) : (
            <Image
              source={this.props.RIcon}
              style={{
                width: setSize(9),
                height: setSize(9),
              }}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item_box: {
    borderBottomWidth: 0.5,
    borderColor: Color.minBorder,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input_item: {
    color: Color.mainText,
    flex: 1,
    fontSize: 16,
  },
});
