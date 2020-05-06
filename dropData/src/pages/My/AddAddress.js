import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import {Color, setSize} from '@/utils/global.js';
import toast from '@/utils/toastMsg';
import Picker from 'react-native-picker';
import {getArea} from '@/utils/pikerSetting';
import {editAddress, delAddress} from '@/apis/api';
export default class AddAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'add',
      data: {
        id: 1,
        username: '', //收件名
        mobile: '', //手机号
        province: '', //省市
        city: '', //城市
        county: '', //区
        address: '', //详细地址
        wasDefault: false, //是否设置默认地址
      },
      btnFlag: false, //仿点击
    };
  }
  componentDidMount() {
    let params = this.props.navigation.state.params;
    this.setState({
      type: params.type,
      data: params.data,
    });
    this.viewDidAppear2 = this.props.navigation.addListener('willBlur', obj => {
      Picker.isPickerShow(isShow => {
        isShow && Picker.hide();
      });
    });
  }
  componentWillUnmount = () => {
    this.viewDidAppear2.remove();
  };
  //   提交保存
  _submit = async () => {
    let {type, data, btnFlag} = this.state;
    if (btnFlag) {
      //仿重复点击
      return;
    }
    let regPhone = /^1\d{10}$/;
    if (!data.username) {
      toast.show('请输入收件人姓名');
      return;
    }
    if (!data.mobile) {
      toast.show('请输入手机号');
      return;
    }
    if (!regPhone.test(data.mobile)) {
      toast.show('请输入11位正确的手机号');
      return;
    }
    if (!data.province || !data.city || !data.county) {
      toast.show('请选择所在地区');
      return;
    }
    if (!data.address) {
      toast.show('请填写详细地址');
      return;
    }
    // 判断与旧数据是否相等
    if (this.props.navigation.getParam('data') == data) {
      Nav.goBack();
      return;
    }
    this.setState({
      btnFlag: true,
    });
    data.createTime && delete data.createTime;
    data.createBy && delete data.createBy;
    type === 'add' && delete data.id;
    // 函数
    try {
      await editAddress(data);
      toast.show('保存成功', 1000, () => {
        this.props.navigation.getParam('callback')();
        Nav.goBack();
      });
    } catch (error) {
      this.setState({
        btnFlag: false,
      });
    }
  };
  //   删除地址
  delFn = async () => {
    this.setState({
      btnFlag: true,
    });
    try {
      await delAddress({id: this.state.data.id});
      toast.show('删除成功', 1000, () => {
        this.props.navigation.getParam('callback')();
        Nav.goBack();
      });
    } catch (error) {
      this.setState({
        btnFlag: true,
      });
    }
  };
  //   显示piker框
  pikerInit = () => {
    let selectedValue = [
      this.state.data.province,
      this.state.data.city,
      this.state.data.county,
    ];
    let i = selectedValue.length;
    while (i--) {
      if (!selectedValue[i]) {
        selectedValue.splice(i, 1);
      }
    }
    Picker.init({
      pickerData: getArea(),
      selectedValue,
      pickerTitleText: '',
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerConfirmBtnColor: [111, 110, 115, 1],
      pickerCancelBtnColor: [111, 110, 115, 1],
      pickerToolBarFontSize: setSize(8),
      pickerTitleColor: [111, 110, 115, 0.5], //选择器标题颜色
      pickerToolBarBg: [247, 247, 247, 1], //选择器顶部条背景色
      pickerBg: [229, 228, 233, 1], //选择器背景色
      //确定
      onPickerConfirm: data => {
        this.setState({
          data: Object.assign({}, this.state.data, {
            province: data[0],
            city: data[1],
            county: data[2],
          }),
        });
      },
      //取消
      onPickerCancel: data => {
        // console.log('取消', data);
      },
      //选择
      onPickerSelect: data => {
        // console.log('选择', data);
      },
    });
    Picker.show();
  };
  //   显示城市 地区
  showCity = () => {
    let {data} = this.state;
    let arr = [data.province, data.city, data.county];
    let i = arr.length;
    while (i--) {
      if (!arr[i]) {
        arr.splice(i, 1);
      }
    }
    if (arr.length) {
      return arr.join(',');
    } else {
      return '';
    }
  };
  //   数据
  textInput = obj => {
    let {text, maxLen, value, placeholder} = obj;
    return (
      <View style={{paddingHorizontal: setSize(5)}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{color: Color.minText, fontSize: setSize(8)}}>
            {text}
          </Text>
          <TextInput
            // electionColor={Color.primary}
            selectionColor={Color.primary}
            maxLength={maxLen}
            style={{
              flex: 1,
              textAlign: 'right',
              fontSize: setSize(8),
              height: setSize(25),
              color: Color.mainText,
            }}
            placeholder={placeholder}
            placeholderTextColor={Color.minText}
            value={this.state.data[value]}
            onChangeText={text => {
              this.setState({
                data: Object.assign({}, this.state.data, {
                  [value]: text,
                }),
              });
            }}
          />
        </View>
        <View
          style={{
            height: 1,
            width: '90%',
            backgroundColor: Color.downBorder,
            alignSelf: 'flex-end',
          }}></View>
      </View>
    );
  };
  render() {
    let {type, data, btnFlag} = this.state;
    return (
      <View style={styles.container}>
        <Header
          back
          centerComponent={type === 'add' ? '添加地址' : '编辑地址'}
          rightComponent={() => (
            <Text style={{color: '#fff', fontSize: setSize(8)}}>保存</Text>
          )}
          RightOnPress={this._submit}
        />
        <View
          style={{
            margin: setSize(6),
            backgroundColor: '#fff',
            borderRadius: 6,
          }}>
          {this.textInput({
            text: '收件人',
            maxLen: 30,
            value: 'username',
            placeholder: '请输入',
          })}
          {this.textInput({
            text: '联系电话',
            maxLen: 11,
            value: 'mobile',
            placeholder: '请输入',
          })}
          {/* 选择框 */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={this.pikerInit}
            style={{paddingHorizontal: setSize(5)}}>
            <View
              style={{
                flexDirection: 'row',
                height: setSize(25),
                alignItems: 'center',
                // justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: Color.minText,
                  fontSize: setSize(8),
                }}>
                所在地区
              </Text>
              <Text
                style={{
                  color: Color.minText,
                  fontSize: setSize(8),
                  flex: 1,
                  textAlign: 'right',
                }}>
                {this.showCity()}
              </Text>
              <Icon
                name="right"
                type="antdesign"
                color={Color.minText}
                size={setSize(8)}
              />
            </View>
            <View
              style={{
                height: 1,
                width: '90%',
                backgroundColor: Color.downBorder,
                alignSelf: 'flex-end',
              }}></View>
          </TouchableOpacity>
          {/* 输入框 */}
          <View style={{paddingHorizontal: setSize(5)}}>
            <View style={{marginTop: setSize(8)}}>
              <Text
                style={{
                  color: Color.minText,
                  fontSize: setSize(8),
                }}>
                详细地址
              </Text>
              <TextInput
                selectionColor={Color.primary}
                maxLength={100}
                placeholder="请输入详细地址"
                style={{
                  fontSize: setSize(6),
                  height: setSize(38),
                  textAlignVertical: 'top',
                  color: Color.mainText,
                }}
                multiline
                placeholderTextColor={Color.minText}
                value={data.address}
                onChangeText={text => {
                  this.setState({
                    data: Object.assign({}, this.state.data, {
                      address: text,
                    }),
                  });
                }}
              />
            </View>
            <View
              style={{
                height: 1,
                width: '90%',
                backgroundColor: Color.downBorder,
                alignSelf: 'flex-end',
              }}></View>
          </View>
          {/* 设置为默认设备 */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              this.setState(state => ({
                data: Object.assign({}, this.state.data, {
                  wasDefault: !state.data.wasDefault,
                }),
              }));
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: setSize(6),
              width: setSize(70),
            }}>
            <View
              style={{
                height: setSize(9),
                width: setSize(9),
                borderRadius: 4,
                borderWidth: 1,
                backgroundColor: data.wasDefault ? Color.primary : '#fff',
                borderColor: Color.downPrimary,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {data.wasDefault && (
                <Icon
                  name="check"
                  type="antdesign"
                  size={setSize(6)}
                  color="#fff"
                />
              )}
            </View>
            <Text
              style={{
                color: Color.mainText,
                fontSize: setSize(6),
                marginLeft: setSize(3),
              }}>
              设为默认地址
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          {type === 'edit' && (
            <Button
              title="删除"
              buttonStyle={{
                borderRadius: 30,
                backgroundColor: Color.primary,
                marginBottom: setSize(20),
                marginHorizontal: setSize(6),
              }}
              disabled={btnFlag}
              disabledStyle={{backgroundColor: Color.downPrimary}}
              disabledTitleStyle={{color: '#fff'}}
              onPress={this.delFn}
            />
          )}
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
