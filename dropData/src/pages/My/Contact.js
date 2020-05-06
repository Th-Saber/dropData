import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import toast from '@/utils/toastMsg';
import Header from '@/component/Header';
import {Color, setSize} from '@/utils/global.js';
import Nav from '@/navigators/NavigationService';
import {getContact, delContact} from '@/apis/api';
class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactArr: [],
      showDelBtn: false,
    };
  }
  //
  componentDidMount = () => {
    this.searchFn();
  };
  //   获取联系人列表
  searchFn = async () => {
    try {
      let res = await getContact();
      this.setState({
        contactArr: res.data,
      });
    } catch (error) {
      console.log('联系人请求失败', error);
    }
  };
  //   删除联系人列表
  delContactFn = async (id, index) => {
    try {
      await delContact({id});
      let arr = [...this.state.contactArr];
      arr.splice(index, 1);
      this.setState({
        contactArr: arr,
      });
      toast.show('删除成功');
    } catch (error) {
      console.log('联系人请求失败', error);
    }
  };
  //   点击完成
  clickDelDone = () => {
    this.setState({showDelBtn: !this.state.showDelBtn});
  };
  //   点击添加联系人
  clickAddContact = (type, data) => {
    let params = {
      callback: this.searchFn,
      type,
    };
    if (type === 'edit') {
      params = Object.assign({}, params, {
        data: {
          name: data.username,
          phone: data.mobile,
          id: data.id,
        },
      });
    }
    Nav.navigate('AddContact', params);
  };
  //渲染列表
  renderItem = () => {
    let {showDelBtn, contactArr} = this.state;
    return contactArr.map((item, index) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.clickAddContact('edit', item)}
          style={styles.item}
          key={index + 'cont'}>
          <Text style={{color: '#333'}}>{item.username}</Text>
          {!showDelBtn ? (
            <Text style={{color: '#333'}}>{item.mobile}</Text>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <Text style={{color: '#333', marginRight: setSize(6)}}>
                {item.mobile}
              </Text>
              <TouchableOpacity
                hitSlop={{left: 20, right: 20, bottom: 20, top: 20}}
                onPress={() => {
                  this.delContactFn(item.id, index);
                }}>
                <Icon
                  type="antdesign"
                  name="closecircle"
                  size={setSize(8)}
                  color={Color.mainBorder}
                />
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      );
    });
  };
  render() {
    let {contactArr, showDelBtn} = this.state;
    return (
      <View style={styles.container}>
        <Header back centerComponent="紧急联系人" />
        <View style={{flex: 1, marginTop: setSize(4)}}>
          {this.renderItem()}
          {contactArr.length < 3 && (
            <TouchableOpacity
              onPress={() => {
                this.clickAddContact('add');
              }}>
              <View style={styles.addRow}>
                <Icon
                  type="antdesign"
                  name="pluscircle"
                  size={setSize(9)}
                  color={Color.primary}
                />
                <Text style={{color: Color.primary}}>&nbsp;添加联系人</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {!showDelBtn ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              this.setState({showDelBtn: !showDelBtn});
            }}>
            <Text style={styles.delBtn}>删除联系人</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              this.clickDelDone();
            }}>
            <Text style={styles.delBtn}>完成</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.bgColor,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: setSize(25),
    marginTop: setSize(2),
    marginLeft: setSize(6),
    marginRight: setSize(6),
    padding: setSize(4),
    borderRadius: 6,
  },
  delBtn: {
    width: setSize(176),
    height: setSize(20),
    textAlign: 'center',
    lineHeight: setSize(20),
    backgroundColor: '#fff',
    marginBottom: setSize(24),
    marginLeft: setSize(6),
    color: Color.primary,
    borderRadius: 6,
  },
  addRow: {
    width: setSize(176),
    height: setSize(25),
    backgroundColor: '#fff',
    color: Color.primary,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: setSize(6),
    marginLeft: setSize(6),
    marginTop: setSize(6),
    borderRadius: 6,
  },
});
function filter(state) {
  return {
    userdata: state.userdata,
  };
}
export default connect(filter)(Contact);
