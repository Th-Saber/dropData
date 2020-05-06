import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Icon} from 'react-native-elements';
import CameraRoll from '@react-native-community/cameraroll';
import Nav from '@/navigators/NavigationService';
import {Color, setSize, getBarHeight} from '@/utils/global.js';
import ImageViewer from 'react-native-image-zoom-viewer';
import toast from '@/utils/toastMsg';
export default class ImgZoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      visible: false,
      imgArr: [],
    };
  }
  componentDidMount = () => {
    let imgArr = this.props.navigation.getParam('imgArr');
    let index = this.props.navigation.getParam('index');
    this.setState({
      imgArr: imgArr.map(v => {
        return {
          url: v,
          props: {},
        };
      }),
      index: index ? index : 0,
      visible: true,
    });
  };
  _close = () => {
    this.setState(
      {
        visible: false,
      },
      () => {
        Nav.goBack();
      },
    );
  };
  //   渲染loading页面
  _renderLoading = () => {
    return (
      <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
        <ActivityIndicator color={Color.primary} size={setSize(10)} />
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        {/* 这是一个示例demo */}
        <TouchableOpacity
          onPress={this._close}
          style={{
            position: 'absolute',
            top: getBarHeight() + setSize(4),
            right: setSize(6),
            zIndex: 1000,
          }}
          hitSlop={{
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
          }}>
          <Icon name="close" type="antdesign" size={setSize(14)} color="#fff" />
        </TouchableOpacity>
        {this.state.visible ? (
          <ImageViewer
            imageUrls={this.state.imgArr}
            index={this.state.index}
            // failImageSource={{
            //   url:
            //     'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1574939549334&di=e4afc25ce60528cc94a4a4840337cd82&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01e9dd5c6f6231a801203d22785e7d.png%401280w_1l_2o_100sh.png',
            // }}
            loadingRender={this._renderLoading}
            enableImageZoom={true}
            menus={() => null}
            menuContext={{
              saveToLocal: '保存到相册',
              cancel: '取消',
            }}
            enableSwipeDown={true}
          />
        ) : (
          this._renderLoading()
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
