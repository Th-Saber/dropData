import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Image, Avatar, Badge, SearchBar, Icon} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
// import Contacts from 'react-native-contacts';
import Header from '@/component/Header';
import FlatScroll from '@/component/FlatScroll';
import {Color, setSize} from '@/utils/global.js';
import Pinyin from '@/utils/pinyin';
import {getFocusUserList, getFansUserList, unFocusTA} from '@/apis/api';
export default class AddressBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      telList: [],
      searchText: '',
      selectedTab: 'focus',
      selectList: [
        {
          name: 'focus',
          text: '关注',
        },
        {
          name: 'fans',
          text: '粉丝',
        },
      ],
      listData: [], //关注列表
      fansList: [],
      focusFlag: false, //是否请求过关注接口
      fansFlag: false, //是否请求过粉丝接口
      listPages: {
        //关注分页
        page: 1,
        size: 10,
        isNextPage: false,
      },
      fansPages: {
        //粉丝分页
        page: 1,
        size: 10,
        isNextPage: false, //是否存在下一页
      },
      loading: false, //数据加载状态
    };
  }
  componentDidMount() {
    // this.searchFn();
    let active = this.props.navigation.getParam('active');
    this.setState(
      state => ({
        selectedTab: active ? active : state.selectedTab,
      }),
      () => {
        if (this.state.selectedTab === 'focus') {
          this.searchFn();
        } else {
          this.searchFansFn();
        }
      },
    );
  }
  //   获取用户关注列表数据
  searchFn = async callback => {
    let {listPages, searchText} = this.state;
    let params = {
      name: searchText,
      page: listPages.page,
      size: listPages.size,
    };
    !params.name && delete params.name; //判断是否有搜索数据
    try {
      let res = await getFocusUserList(params);
      this.setState(state => ({
        listData:
          listPages.page === 1
            ? res.data.records
            : [...state.listData, ...res.data.records],
        loading: false,
        focusFlag: true,
        listPages: Object.assign({}, this.state.listPages, {
          isNextPage: res.data.current === res.data.pages,
        }),
      }));
      callback && callback(true);
      //   let arr = this.filterSectionsList(res.data.records);
    } catch (error) {
      console.log('error', error);
    }
  };
  //   获取用户粉丝列表数据
  searchFansFn = async callback => {
    let {fansPages, searchText} = this.state;
    let params = {
      name: searchText,
      page: fansPages.page,
      size: fansPages.size,
    };
    !params.name && delete params.name; //判断是否有搜索数据
    try {
      let res = await getFansUserList(params);
      this.setState(state => ({
        fansList:
          fansPages.page === 1
            ? res.data.records
            : [...state.fansList, ...res.data.records],
        loading: false,
        fansFlag: true, //是否请求过后台数据
        fansPages: Object.assign({}, this.state.fansPages, {
          isNextPage: res.data.current === res.data.pages,
        }),
      }));
      callback && callback(true);
    } catch (error) {
      console.log('error', error);
    }
  };
  //  过滤需要的数据
  filterSectionsList = arr => {
    let list = [];
    arr.map(v => {
      let title = Pinyin.getFirstLetter(v.name)[0];
      let index = this.isArrSame(list, title);
      if (index) {
        list[index].data.push(v.name);
      } else {
        list.push({
          title,
          data: [v.name],
        });
      }
    });
    list.sort((a, b) => (a.title < b.title ? -1 : 1));
    return list;
  };
  /**
   * @param { arr:[Array]} //循环的数组
   * @param { val:[String]} //判断相等的值
   */
  //   判断是否存在标题
  isArrSame = (arr, val) => {
    let len = arr.length;
    for (let index = 0; index < len; index++) {
      if (arr[index].title === val) {
        return index;
      }
    }
    return null;
  };
  //   点击取消关注
  delFocusFn = uid => {
    unFocusTA({uid}).then(res => {
      let arr = [...this.state.listData];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].userId === uid) {
          arr.splice(i, 1);
          break;
        }
      }
      this.setState({
        listData: arr,
      });
    });
  };
  //   刷新关注列表
  reloadFocue = () => {
    this.setState(
      {
        selectedTab: 'focus',
      },
      () => {
        this._downRefresh();
      },
    );
  };
  //   上拉刷新函数
  _pullRefresh = callback => {
    let {selectedTab} = this.state;
    let flag = selectedTab === 'focus' ? 'listPages' : 'fansPages';
    if (this.state[flag].isNextPage) {
      callback();
      return;
    }
    this.setState(
      state => ({
        [flag]: Object.assign({}, this.state[flag], {
          page: ++state[flag].page,
        }),
      }),
      () => {
        if (flag === 'listPages') {
          this.searchFn(callback);
        } else {
          this.searchFansFn(callback);
        }
      },
    );
  };
  //  下拉刷新
  _downRefresh = callback => {
    let {selectedTab} = this.state;
    let flag = selectedTab === 'focus' ? 'listPages' : 'fansPages';
    this.setState(
      {
        [flag]: Object.assign({}, this.state[flag], {page: 1}),
      },
      () => {
        if (selectedTab === 'focus') {
          this.searchFn(callback);
        } else {
          this.searchFansFn(callback);
        }
      },
    );
  };
  // 搜索按钮
  //   textSearch = () => {
  //     this._downRefresh();
  //   };
  //   改变选项卡
  actItems = name => {
    this.setState(
      {
        selectedTab: name,
        loading: true,
      },
      () => {
        if (name === 'fans') {
          !this.state.fansFlag && this.searchFansFn();
        } else {
          !this.state.focusFlag && this.searchFn();
        }
      },
    );
  };
  //   跳转到他的主页
  jumpHome = uid => {
    Nav.navigate('HisHome', {
      id: uid,
      callback: this.reloadFocue,
    });
  };
  //  激活navbar
  navItem = () => {
    let {selectedTab, selectList} = this.state;
    const tabs = selectList.map((v, i) => {
      return (
        <TouchableOpacity
          key={i + 'pagesS'}
          activeOpacity={0.8}
          style={{
            flex: 1,
          }}
          onPress={this.actItems.bind(this, v.name)}>
          <View
            style={[
              {
                alignSelf: 'center',
                paddingHorizontal: setSize(2),
              },
              selectedTab === v.name
                ? {
                    borderBottomWidth: 2,
                    borderColor: Color.primary,
                  }
                : {},
            ]}>
            <Text
              style={{
                fontSize: setSize(8),
                lineHeight: setSize(16),
                height: setSize(16),
                textAlign: 'center',
                color: selectedTab === v.name ? Color.primary : Color.mainText,
              }}>
              {v.text}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '60%',
          alignSelf: 'center',
        }}>
        {tabs}
      </View>
    );
  };
  //   渲染子项
  _renderItem = (item, index) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: setSize(40),
          backgroundColor: '#fff',
          justifyContent: 'space-between',
          paddingHorizontal: setSize(6),
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Avatar
            rounded
            icon={{name: 'user', type: 'antdesign'}}
            source={{uri: item.avator}}
            size={setSize(20)}
            onPress={() => this.jumpHome(item.userId)}
          />
          <Text
            style={{
              fontSize: setSize(8),
              marginLeft: setSize(8),
              color: Color.mainText,
            }}>
            {item.name}
          </Text>
        </View>
        {this.state.selectedTab === 'focus' && (
          <Badge
            value={'取消关注'}
            textStyle={{
              color: Color.primary,
              fontSize: setSize(5),
            }}
            badgeStyle={{
              backgroundColor: 'transparent',
              borderColor: Color.downPrimary,
              borderWidth: 1,
              height: setSize(9),
              width: setSize(29),
              borderRadius: 4,
              marginRight: setSize(19),
            }}
            activeOpacity={0.6}
            onPress={() => {
              this.delFocusFn(item.userId);
            }}
          />
        )}
      </View>
    );
  };
  //   搜索栏
  _searchBar = () => {
    let {searchText, selectedTab, listData, fansList} = this.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 4,
          flex: 1,
          backgroundColor: '#fff',
        }}>
        <View style={{marginHorizontal: setSize(2)}}>
          <Icon
            name="search1"
            type="antdesign"
            size={setSize(8)}
            color={Color.minText}
          />
        </View>
        <TextInput
          value={searchText}
          placeholder="请输入名称"
          style={{
            flex: 1,
            paddingVertical: setSize(3),
            fontSize: setSize(7),
            color: Color.mainText,
          }}
          maxLength={16}
          onChangeText={text => {
            if (!text) {
              this._downRefresh();
            }
            this.setState({
              searchText: text,
            });
          }}
        />
      </View>
    );
  };
  render() {
    let {searchText, selectedTab, listData, fansList} = this.state;
    let flag = selectedTab === 'focus';
    return (
      <View style={styles.container}>
        <Header back centerComponent="联系人" />
        {/* 这是一个示例demo */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: setSize(6),
          }}>
          {this._searchBar()}
          {searchText !== '' && (
            <TouchableOpacity
              activeOpacity={0.8}
              hitSlop={{
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
              }}
              onPress={this._downRefresh}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: setSize(12),
                width: setSize(26),
                borderRadius: 4,
                backgroundColor: Color.primary,
                marginLeft: setSize(6),
              }}>
              <Text style={{color: '#fff', fontSize: setSize(6)}}>搜索</Text>
            </TouchableOpacity>
          )}
        </View>
        {this.navItem()}
        {/* 主要数据列表 */}
        <FlatScroll
          data={flag ? listData : fansList}
          dropDown
          pull={
            [flag ? 'listData' : 'fansList'].length >
            [flag ? 'listPages' : 'fansPages'].size
          }
          borderStyle={{
            height: 1,
            backgroundColor: Color.downBorder,
          }}
          containerStyle={{
            paddingHorizontal: 0,
            marginTop: setSize(8),
          }}
          renderItem={this._renderItem}
          downRefresh={this._downRefresh}
          pullRefresh={this._pullRefresh}
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
