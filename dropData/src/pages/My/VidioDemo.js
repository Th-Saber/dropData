import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import {Image, Icon} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import {Color, setSize, getBarHeight} from '@/utils/global.js';
import toast from '@/utils/toastMsg';
// import Video from '@/component/Video';
import VideoPlayer from 'react-native-video-controls';
import Orientation from 'react-native-orientation';

import {getVidioDom} from '@/apis/api';
export default class VidioDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '', //标题
      content: '', //详细内容
      video: '', //视频地址
      barHeight: getBarHeight(),
      isScreen: false, //是否全屏展示
    };
  }
  componentDidMount() {
    this.searchFn();
  }
  searchFn = async () => {
    let id = this.props.navigation.getParam('machineId');
    try {
      let res = await getVidioDom({id});
      this.setState({
        title: res.data.title,
        content: res.data.content,
        video: res.data.video,
      });
    } catch (error) {
      console.log('错误', error);
    }
  };
  //   获取屏幕方向
  getScreenDirection = async () => {
    const initial = await Orientation.getInitialOrientation();
    // alert(initial);
    if (initial === 'PORTRAIT') {
      //横屏
      Orientation.lockToPortrait();
    }
  };
  //  播放回退事件
  playBack = () => {
    Nav.goBack();
  };
  componentWillUnmount = () => {
    StatusBar.setHidden(false);
    this.getScreenDirection();
  };
  render() {
    let {content, barHeight, title, video, isScreen} = this.state;
    return (
      <View style={styles.container}>
        <View style={isScreen ? {flex: 1} : {height: setSize(106)}}>
          {video ? (
            <VideoPlayer
              source={{uri: video}}
              disableSeekbar
              disableVolume={!isScreen}
              disableBack={!isScreen}
              onEnterFullscreen={() => {
                this.setState({
                  isScreen: true,
                });
                StatusBar.setHidden(true);
                Orientation.lockToLandscape();
              }}
              onExitFullscreen={() => {
                this.setState({
                  isScreen: false,
                });
                StatusBar.setHidden(false);
                Orientation.lockToPortrait();
              }}
              onBack={this.playBack}
            />
          ) : (
            <Image
              source={require('@/assets/imgs/3.jpg')}
              style={{height: setSize(106)}}
            />
          )}

          {!isScreen && (
            <TouchableOpacity
              hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}
              style={{
                position: 'absolute',
                left: setSize(10),
                top: barHeight + setSize(4),
              }}
              onPress={() => {
                Nav.goBack();
              }}>
              <Icon name="left" type="antdesign" color="#fff" size={18} />
            </TouchableOpacity>
          )}
        </View>
        {!isScreen && (
          <View style={{flex: 1}}>
            <View
              style={{
                borderBottomColor: Color.minBorder,
                borderBottomWidth: 1,
                height: setSize(23),
                justifyContent: 'center',
                paddingHorizontal: setSize(11),
              }}>
              <Text
                style={{
                  fontSize: setSize(8),
                  color: Color.mainText,
                }}>
                {title}
              </Text>
            </View>
            <ScrollView style={{flex: 1, padding: setSize(8)}}>
              <Text
                style={{
                  color: Color.infoText,
                  fontSize: setSize(6),
                  lineHeight: setSize(10),
                }}>
                {content}
              </Text>
            </ScrollView>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
