import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  Image,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Icon} from 'react-native-elements';
import Header from '@/component/Header';
import {Color, setSize} from '@/utils/global.js';

const bgColor = 'rgba(0,0,0,0.5)'; // 二维码扫描区域颜色

export default class Scanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moveAnim: new Animated.Value(0),
      FlashMode: false,
      showCamera: true,
      url: null,
    };
    this.isBarcodeRead = false;
  }
  componentDidMount() {
    this.startAnimation();
    // 监听当结果页返回时，重新启动相机监听扫描事件
    this.props.navigation.addListener('didFocus', () =>
      this.setState({showCamera: true}),
    );
  }

  startAnimation = () => {
    this.state.moveAnim.setValue(-200);
    Animated.timing(this.state.moveAnim, {
      toValue: 0,
      duration: 1500,
      easing: Easing.linear,
    }).start(() => this.startAnimation());
  };

  // 扫描事件
  onBarCodeRead = result => {
    if (!this.isBarcodeRead) {
      this.isBarcodeRead = true;
      console.log('扫描出来的数据', result.data);
      // 卸载扫一扫组件，否则还会持续扫描
      this.setState({showCamera: false});
    }
  };

  // 拍照事件
  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      this.setState({
        showCamera: false,
        url: data.uri,
      });
      console.log('data', data); //拍照照片地址
    }
  };

  // 闪光灯开关
  _changeFlashMode() {
    this.setState({
      FlashMode: !this.state.FlashMode,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.url && (
          <Image
            style={{height: '100%', width: '100%'}}
            source={{uri: this.state.url}}
          />
        )}
        {this.state.showCamera && (
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={this.state.FlashMode ? 1 : 0}
            onBarCodeRead={this.onBarCodeRead}>
            <View style={{flex: 1, width: '100%'}}>
              <Header
                back
                centerComponent="扫一扫"
                backgroundColor="rgba(0,0,0,0.7)"
              />
              <View style={styles.viewBg}></View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.viewBg}></View>
              <View style={styles.rectangle}></View>
              <View style={styles.viewBg}></View>
            </View>

            <View style={[styles.viewBg, {width: '100%'}]}>
              <Text style={styles.rectangleText}>
                将二维码放入框内，即可自动扫描
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 15,
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={this._changeFlashMode.bind(this)}
                  //   style={{marginLeft: 25}}>
                >
                  <Icon
                    name="highlight"
                    size={36}
                    color={this.state.FlashMode ? Color.primary : 'gray'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </RNCamera>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewBg: {
    backgroundColor: bgColor,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rectangle: {
    height: setSize(148),
    width: setSize(148),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'transparent',
  },
  rectangleText: {
    flex: 0,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
  border: {
    flex: 0,
    width: 195,
    height: 2,
    backgroundColor: '#00FF00',
  },
});

{
  /* <TouchableOpacity
    onPress={this.takePicture.bind(this)}
    style={{marginLeft: 25}}>
    <Icon name="camera" size={36} color={'green'} /> //相机
</TouchableOpacity> */
}
