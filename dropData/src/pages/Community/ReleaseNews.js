import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Image, Icon} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import toast from '@/utils/toastMsg';
import {Color, setSize} from '@/utils/global.js';
import {geolocationInit, getCurrentPosition} from '@/utils/location.js';
import {releaseNews} from '@/apis/api';
import {uploadImg} from '@/apis/uploadAli';
import permission from '@/utils/permission';
const {width} = Dimensions.get('window');
export default class ReleaseNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      imgArr: [],
      delArr: [], //显示删除数组
      lnglat: {
        longitude: '', //经度
        latitude: '', //维度
      },
    };
  }
  componentDidMount = async () => {
    try {
      let cameraStatus = await permission.check('LOCATION');
      switch (cameraStatus) {
        case 'granted':
          this.getLnglat();
          break;
        case 'denied':
          this.getLnglat();
          break;
        case 'blocked':
          toast.show('请允许我们访问您的定位信息，以便提供为您更好的用户体验');
          Nav.goBack();
          break;
        case 'unavailable':
          toast.show('您的设备不支持定位服务');
          Nav.goBack();
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };
  //  获取经纬度
  getLnglat = () => {
    geolocationInit(); //初始化
    getCurrentPosition(position => {
      this.setState({
        lnglat: {
          longitude: position.coords.longitude, //经度
          latitude: position.coords.latitude, //维度
        },
      });
    });
  };
  //   提交
  _submit = () => {
    let {delArr, imgArr, text} = this.state;
    if (delArr.length > 0) {
      this.setState({
        delArr: [],
      });
    } else {
      if (!imgArr.length && !text) {
        toast.show('请选择发布内容');
        return;
      }
      this.onRelease();
    }
  };
  //  开始发布动态
  onRelease = async () => {
    let {imgArr, text, lnglat} = this.state;
    let params = {
      title: text,
      imgs: imgArr.join(),
      ...lnglat,
    };
    !params.title && delete params.title;
    !params.imgs && delete params.imgs;
    try {
      await releaseNews(params);
      // 发布成功 刷新页面
      let reload = this.props.navigation.getParam('reload');
      reload && reload();
      Nav.goBack();
    } catch (error) {
      console.log('发送图片失败', error);
    }
  };
  //   点击添加图片
  addImg = () => {
    Nav.navigate('PhotoWall', {callback: this.getImgUrl});
  };
  //   获取本地地址
  getImgUrl = async url => {
    try {
      let res = await uploadImg(url);
      this.setState(state => ({
        imgArr: [...state.imgArr, res],
      }));
    } catch (error) {
      console.log('错误');
    }
  };
  //  长按显示删除
  showLongDel = i => {
    let {delArr} = this.state;
    if (delArr.indexOf(i) !== -1) return;
    let newArr = [...delArr];
    newArr.push(i);
    this.setState({
      delArr: newArr,
    });
  };
  //  点击图片处理
  delImg = i => {
    let {delArr, imgArr} = this.state;
    if (delArr.indexOf(i) === -1) return;
    let newArr = [...imgArr];
    newArr.splice(i, 1);
    this.setState({
      delArr: [],
      imgArr: newArr,
    });
  };
  render() {
    let {text, imgArr, delArr} = this.state;
    return (
      <View style={styles.container}>
        <Header
          back
          centerComponent="动态"
          rightComponent={() => (
            <Text style={{color: '#fff', fontSize: setSize(7)}}>
              {delArr.length > 0 ? '取消' : '发布'}
            </Text>
          )}
          RightOnPress={this._submit}
        />
        {/* 这是一个示例demo */}
        <View
          style={{
            paddingHorizontal: setSize(4),
            borderRadius: 6,
            flex: 1,
            backgroundColor: '#fff',
            margin: setSize(6),
          }}>
          <TextInput
            value={text}
            onChangeText={text => {
              this.setState({
                text,
              });
            }}
            placeholder="请输入内容"
            multiline
            // numberOfLines={10}
            maxLength={300}
            selectionColor={Color.primary}
            placeholderTextColor={Color.minText}
            style={{
              height: setSize(106),
              fontSize: setSize(7),
              color: Color.mainText,
              textAlignVertical: 'top',
              borderBottomColor: Color.downBorder,
              borderBottomWidth: 1,
            }}
          />
          <View
            onLayout={e => {
              //   console.log(e.nativeEvent.layout.width);
              this.ViewWidth = e.nativeEvent.layout.width;
            }}
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {imgArr.map((v, i) => {
              return (
                <TouchableOpacity
                  key={i + 'imgs'}
                  activeOpacity={0.8}
                  onLongPress={this.showLongDel.bind(this, i)}
                  onPress={this.delImg.bind(this, i)}
                  style={{
                    height: this.ViewWidth / 3,
                    width: this.ViewWidth / 3,
                    padding: 4,
                  }}>
                  <Image
                    source={{uri: v}}
                    containerStyle={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      borderColor: Color.downPrimary,
                      borderWidth: 1,
                    }}
                    style={{height: '100%', width: '100%'}}
                    // resizeMode={'contain'}
                    placeholderStyle={{
                      backgroundColor: 'rgba(0,0,0,0.6)',
                    }}
                    PlaceholderContent={
                      <ActivityIndicator color={Color.primary} />
                    }
                  />
                  {delArr.indexOf(i) !== -1 && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 4,
                        left: 4,
                        borderRadius: 4,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        type="antdesign"
                        name="delete"
                        size={setSize(10)}
                        color={'#fff'}
                      />
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: setSize(6),
                          marginTop: setSize(2),
                        }}>
                        点击删除
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {imgArr.length < 9 && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  height: (width - setSize(21)) / 3,
                  width: (width - setSize(21)) / 3,
                  padding: 4,
                }}
                onPress={this.addImg}>
                <View
                  style={{
                    borderRadius: 4,
                    justifyContent: 'center',
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor: '#ccc',
                  }}>
                  <Text
                    style={{
                      fontSize: setSize(14),
                      color: '#fff',
                    }}>
                    +
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
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
