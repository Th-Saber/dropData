import React, {Component} from 'react';
import {StyleSheet, View, Switch} from 'react-native';
import {Button, Icon, ListItem} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import {storage} from '@/storage';
import {Color, setSize, cleanStorage} from '@/utils/global.js';
import toast from '@/utils/toastMsg';
export default class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [
        {
          name: '账号设置',
          val: 'user',
          right: 'right',
        },
        {
          name: '密码设置',
          val: 'pass',
          right: 'right',
        },
        // {
        //   name: '消息通知',
        //   val: 'msg',
        //   right: 'switch',
        // },
      ],
      msgNotice: true, //是否选中
    };
  }
  itemRightC = val => {
    switch (val) {
      case 'right':
        return (
          <Icon
            name="right"
            type="antdesign"
            color={Color.minText}
            size={setSize(6)}
          />
        );
      case 'switch':
        return (
          <Switch
            trackColor={{false: '#ccc', true: Color.primary}}
            thumbColor="#fff"
            ios_backgroundColor={Color.primary}
            value={this.state.msgNotice}
            onValueChange={val => {
              this.setState({
                msgNotice: val,
              });
            }}
          />
        );
      default:
        return null;
    }
  };
  //   点击列表选项
  onPressItem = v => {
    switch (v.val) {
      case 'user':
        Nav.navigate('AddUser', {type: 'user'});
        break;
      case 'pass':
        Nav.navigate('PassSet');
        break;
      case 'msg':
        break;
      default:
        break;
    }
  };
  //  退出登录
  outLogin = () => {
    //  退出账号
    //   消除所有数据
    cleanStorage();
    toast.show('退出成功');
    Nav.resetRouter('Login');
  };
  render() {
    let {listData} = this.state;
    return (
      <View style={styles.container}>
        <Header back centerComponent="设置" />
        {/* 这是一个示例demo */}
        <View
          style={{
            margin: setSize(6),
            borderRadius: 6,
            backgroundColor: '#fff',
          }}>
          {listData.map((v, i) => {
            return (
              <ListItem
                key={i + 'Ric'}
                title={v.name}
                underlayColor="rgba(255,255,255,0.1)"
                containerStyle={{
                  backgroundColor: 'transparent',
                  height: setSize(22.5),
                  marginHorizontal: 2,
                  borderColor: Color.downBorder,
                  borderBottomWidth: i === listData.length - 1 ? 0 : 1,
                }}
                rightIcon={this.itemRightC.bind(this, v.right)}
                titleStyle={{
                  fontSize: setSize(6.5),
                  color: Color.mainText,
                }}
                onPress={i === 2 ? null : this.onPressItem.bind(this, v)}
                bottomDivider
              />
            );
          })}
        </View>
        <View
          style={{
            flex: 1,
            paddingHorizontal: setSize(6),
            justifyContent: 'flex-end',
          }}>
          <Button
            title="退出登录"
            buttonStyle={{
              borderRadius: 6,
              borderWidth: 1,
              borderColor: Color.deepPrimary,
              backgroundColor: '#fff',
              marginBottom: setSize(20),
              marginHorizontal: setSize(6),
            }}
            titleStyle={{
              color: Color.primary,
              fontSize: setSize(8),
            }}
            onPress={this.outLogin}
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
