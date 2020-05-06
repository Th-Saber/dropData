import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Image, Icon} from 'react-native-elements';
import CameraRoll from '@react-native-community/cameraroll';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import {Color, setSize} from '@/utils/global.js';
import permission from '@/utils/permission';
import toast from '@/utils/toastMsg';
const {width} = Dimensions.get('window');
export default class PhotoWall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgData: [],
      pages: {
        page: 1,
        size: 40,
      },
      loading: false,
      actIndex: null,
      actImgUrl: '', //选中的imgurl
      showFoot: 0, //底部组件  0:刷新成功  1:刷新中  2:没有数据,
    };
  }
  componentDidMount() {
    this.getPermiss();
  }
  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return;
    };
  };
  //   获取相机权限
  getPermiss = async () => {
    try {
      let cameraStatus = await permission.check('PHOTO');
      switch (cameraStatus) {
        case 'granted':
          this.getPhotos();
          break;
        case 'denied':
          toast.show('访问不用授权允许访问');
          this.getPhotos();
          break;
        case 'blocked':
          toast.show('请允许我们访问您的相册，以便提供为您更好的用户体验');
          Nav.goBack();
          break;
        case 'unavailable':
          toast.show('您的设备不支持相册');
          Nav.goBack();
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };
  //   获取相册列表图片
  getPhotos = () => {
    let {page, size} = this.state.pages;
    CameraRoll.getPhotos({
      assetType: 'Photos',
      groupTypes: 'All',
      first: page * size,
    })
      .then(res => {
        this.setState(state => ({
          imgData: res.edges,
          showFoot: res.edges.length < state.imgData.length + size ? 2 : 0,
        }));
      })
      .catch(error => {
        console.log(error);
      });
  };
  //  确定选择图片
  confirm = () => {
    let {actImgUrl} = this.state;
    this.props.navigation.getParam('callback')(actImgUrl);
    Nav.goBack();
  };
  //选择图片
  chooseImg = (v, i) => {
    let {actIndex} = this.state;
    this.setState({
      actIndex: actIndex === i ? null : i,
      actImgUrl: actIndex === i ? '' : v.node.image.uri,
    });
  };
  //   渲染底部组件
  footerComponent = () => {
    let {showFoot} = this.state;
    if (showFoot === 1) {
      return (
        <View style={{paddingBottom: 5}}>
          <ActivityIndicator color="#f60" />
          <Text style={{color: Color.infoText, textAlign: 'center'}}>
            刷新中。。。
          </Text>
        </View>
      );
    } else if (showFoot === 2) {
      return (
        <View
          style={{
            paddingVertical: 5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: Color.infoText}}>相册到底了。。。</Text>
          <Image
            source={require('@/assets/icon/icon_nodata1_2.png')}
            style={{width: setSize(15), height: setSize(15)}}
            resizeMode="contain"
            placeholderStyle={{backgroundColor: 'transparent'}}
          />
        </View>
      );
    } else {
      return null;
    }
  };
  //   上拉加载
  _onPullReached = event => {
    // 滚动结束后, scrollView会返回个参数 event
    // 个人理解:  (offsetY+屏幕高度) - contentSize.height <=40(底部加载组件的高度)。
    // 属性：layoutMeasurement: 屏幕的尺寸
    if (this.showFoot === 2) {
      return;
    }
    if (this.canLoadMore) {
      return;
    }

    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;

    // 1.获取offsetY, 屏幕高度
    const offsetY = contentOffset.y;
    const screenH = layoutMeasurement.height;
    const bottomY = offsetY + screenH;

    // 2.获取scroll的contentHeight
    const contentSizeHeight = contentSize.height;
    // console.log(contentSizeHeight,bottomY);
    // 3.需要定义一个属性进行是否加载更多, 因为这个方法是只要滚动停止就会执行(向上拖拽, 向下拖拽都会执行, 这里只做加载更多)

    // console.log(this.canLoadMore);
    // 4.绝对值 判断
    if (bottomY >= contentSizeHeight) {
      this.canLoadMore = true;
      // 做请求
      let {pages} = this.state;
      this.setState(
        state => ({
          pages: Object.assign({}, pages, {
            page: ++state.pages.page,
          }),
          showFoot: 1,
        }),
        () => {
          this.refs.scrollview.scrollToEnd();
          this.canLoadMore = false;
          this.getPhotos();
        },
      );
    }
  };

  //   是否启用上拉加载
  isShowPull = () => {
    let {imgData, pages} = this.state;
    if (imgData.length >= pages.size) {
      return {
        scrollEventThrottle: 16,
        removeClippedSubviews: true,
        // 滚动动画结束时调用此函数， 会比较频繁
        onMomentumScrollEnd: this._onPullReached,
      };
    } else {
      return {};
    }
  };
  render() {
    let {imgData, actIndex} = this.state;
    let options = this.isShowPull();
    return (
      <View style={styles.container}>
        <Header
          back
          centerComponent="照片墙"
          rightComponent={() => {
            if (actIndex !== null) {
              return (
                <Text style={{color: '#fff', fontSize: setSize(8)}}>确定</Text>
              );
            } else {
              return null;
            }
          }}
          RightOnPress={this.confirm}
        />
        {/* 这是一个示例demo */}
        <ScrollView ref="scrollview" {...options}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {imgData.map((v, i) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={i + 'img'}
                  onPress={() => this.chooseImg(v, i)}
                  style={{
                    width: width / 4,
                    height: width / 4,
                    padding: setSize(4),
                  }}>
                  <Image
                    source={{uri: v.node.image.uri}}
                    style={{width: '100%', height: '100%'}}
                    PlaceholderContent={
                      <ActivityIndicator color={Color.primary} />
                    }
                    placeholderStyle={{
                      backgroundColor: 'rgba(255,255,255,0.5)',
                    }}
                    // resizeMode="contain"
                  />
                  {actIndex === i && (
                    <Icon
                      type="antdesign"
                      name="checkcircle"
                      size={setSize(10)}
                      color={Color.primary}
                      containerStyle={{
                        position: 'absolute',
                        right: setSize(4),
                        bottom: setSize(4),
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          {this.footerComponent()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
