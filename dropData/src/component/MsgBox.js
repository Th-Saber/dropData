import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  Dimensions,
  Modal,
} from 'react-native';
import {Image, Avatar, Icon} from 'react-native-elements';
import {Color, setSize} from '@/utils/global.js';
const {width, height} = Dimensions.get('window');
export default class MsgBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  static defaultProps = {
    itemPress: false, //-临时 点击按钮回调
    androidBack: false, //是否监听安卓返回键
    maskClose: true, //是否点击背景模板关闭modal框
    maskBackground: 'rgba(0,0,0,0.3)', //背景mask框背景颜色
    title: '点击删除', //默认标题
    closed: false, //关闭后的回掉函数
  };
  componentWillUnmount = () => {
    this.close();
    this.timeOut && clearTimeout(this.timeOut);
  };
  //   检查模态框开启状态
  checkOpen = () => {
    return this.state.visible;
  };
  // 强制拦截安卓返回键
  _androidBack = () => {
    if (this.props.androidBack) {
      this.props.androidBack();
    } else {
      this.close();
    }
  };
  //   点击内容测试
  _itemPress = () => {
    this.props.itemPress && this.props.itemPress();
    this.close();
  };
  //点击mask背景框
  maskPress = () => {
    this.timeOut && clearTimeout(this.timeOut);
    this.close();
  };
  /**
   *开启模态框
   * @param {'模态框自动关闭时间：单位（ms）最大值10000ms '} time
   */
  open = time => {
    this.setState(
      {
        visible: true,
      },
      () => {
        if (time !== undefined) {
          let newTime = parseInt(time) > 10000 ? 10000 : parseInt(time);
          this.timeOut = setTimeout(this.close, newTime);
        }
      },
    );
  };
  //  关闭模态框
  close = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    return (
      <Modal
        visible={this.state.visible}
        transparent
        animationType="fade"
        onRequestClose={Platform.OS === 'android' ? this._androidBack : false}
        onDismiss={this.props.closed}
        hardwareAccelerated>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={[
              styles.maskBox,
              {backgroundColor: this.props.maskBackground},
            ]}
            activeOpacity={1}
            onPress={this.maskPress}></TouchableOpacity>
          {this.props.children ? (
            this.props.children
          ) : (
            <TouchableNativeFeedback
              onPress={this._itemPress}
              style={{borderRadius: 6}}
              background={TouchableNativeFeedback.SelectableBackground()}>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '40%',
                  overflow: 'hidden',
                  height: setSize(20),
                }}>
                <Text style={{color: Color.mainText}}>{this.props.title}</Text>
              </View>
            </TouchableNativeFeedback>
          )}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  maskBox: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
});
