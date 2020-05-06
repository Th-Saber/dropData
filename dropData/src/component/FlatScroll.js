import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import {Color, setSize} from '@/utils/global.js';
export default class FlatScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false, //上拉加载状态
      showFoot: 0, //底部组件  0:刷新成功  1:刷新中  2:没有数据,
    };
  }
  static defaultProps = {
    containerStyle: {},
    data: [],
    scrollEnd: false, //是否滚动到底部
    dropDown: false, //是否下拉刷新
    pull: false, //是否上拉加载
    borderStyle: false,
    header: false, //头部组件
    renderItem: (item, index) => {
      //子组件
      return null;
    },
    downRefresh: callBack => {
      //下拉刷新方法
      callBack();
    },
    pullRefresh: callBack => {
      //上拉加载方法
      callBack(true);
    },
  };
  //   上拉加载异步请求回调函数 改变底部组件刷新状态
  /**
   * @param:[val:Boolean] //true：有数据 false：无数据
   */
  callBackPull = val => {
    this.setState({
      showFoot: val ? 0 : 2,
    });
  };
  //下拉刷新异步请求回调函数  改变顶部刷新组件状态
  callBackDown = () => {
    this.setState({
      refreshing: false,
    });
  };
  //  分割线
  _borderComponent = () => {
    if (this.props.borderStyle) {
      return <View style={this.props.borderStyle}></View>;
    } else {
      return null;
    }
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
          <Text style={{color: Color.infoText}}>没有更多数据了。。。</Text>
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
  //暂无数据显示
  _emptyComponent = () => {
    return (
      <Text
        style={{
          color: Color.minText,
          fontSize: setSize(6),
          textAlign: 'center',
          paddingVertical: setSize(4),
        }}>
        暂无数据
      </Text>
    );
  };
  //   下拉刷新
  _onDownRefresh = () => {
    if (this.state.showFoot === 1) {
      return;
    }
    this.setState({refreshing: true});
    this.props.downRefresh(this.callBackDown.bind(this));
  };
  //  上拉加载
  _onPullReached = () => {
    let {showFoot, refreshing} = this.state;
    if (showFoot !== 0 || refreshing) {
      return;
    }
    this.setState({
      showFoot: 1,
    });
    this.props.pullRefresh(this.callBackPull.bind(this));
  };
  //   是否启用下拉刷新
  isShowDown = () => {
    let {dropDown} = this.props;
    let {refreshing} = this.state;
    if (dropDown) {
      return {
        refreshControl: (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this._onDownRefresh.bind(this)}
            colors={[Color.primary]}
            progressBackgroundColor="#fff"
          />
        ),
      };
    } else {
      return {};
    }
  };
  //   是否启用上拉加载
  isShowPull = () => {
    let {pull} = this.props;
    if (pull) {
      return {
        onEndReached: this._onPullReached.bind(this),
        onEndReachedThreshold: 0.1,
        ListFooterComponent: this.footerComponent.bind(this),
      };
    } else {
      return {};
    }
  };
  //   获取flatList实例方法ref
  refHandler = ref => {
    this._flatListRef = ref;
  };
  //滚动到底部
  scrollToEnd = () => {
    this._flatListRef && this._flatListRef.scrollToEnd({animated: true});
  };
  //页面长度改变函数调用
  onContentSizeChange = (contentWidth, contentHeight) => {
    this.props.scrollEnd && this.scrollToEnd();
  };
  render() {
    const isDown = this.isShowDown();
    const isPull = this.isShowPull();
    return (
      <View style={{flex: 1}}>
        <FlatList
          ref={this.refHandler}
          data={this.props.data}
          style={[{paddingHorizontal: setSize(6)}, this.props.containerStyle]}
          keyExtractor={(item, index) => index + 'item'}
          renderItem={({item, index}) => this.props.renderItem(item, index)}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={this.props.header}
          ListEmptyComponent={this._emptyComponent}
          ItemSeparatorComponent={this._borderComponent}
          onContentSizeChange={this.onContentSizeChange}
          {...isDown}
          {...isPull}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
