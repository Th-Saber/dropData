import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import {Image, ListItem, Button} from 'react-native-elements';
import Picker from 'react-native-picker';
import Nav from '@/navigators/NavigationService';
import Header from '@/component/Header';
import moment from 'moment';
import {Color, setSize} from '@/utils/global.js';
import {getArea, getDate} from '@/utils/pikerSetting';
import toast from '@/utils/toastMsg';
import {addUserIs, regCode, updateUserInfo} from '@/apis/api';
import {storage} from '@/storage';
import {save_userdata} from '@/store/actions';
import {uploadImg} from '@/apis/uploadAli';
export default class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tip: `您的个人资料信息将影响这杯检测数据的准确性，请准确填写一下信息，以获取更准确的健康数据，我们会为您的个人信息严格保密。`,
      listData: [
        {name: 'imageUrl', title: '头像'},
        {name: 'name', title: '姓名'},
        {name: 'birthday', title: '生日'},
        {name: 'sex', title: '性别'},
        {name: 'height', title: '身高'},
        {name: 'weight', title: '体重'},
        {name: 'bloodType', title: '血型'},
        {name: 'wasSmoke', title: '吸烟'},
        {name: 'wasWine', title: '饮酒'},
        {name: 'sportsTime', title: '运动时间'},
        {
          name: ['province', 'city', 'county'],
          title: '所属地区',
        },
      ],
      type: 'user', //user 为修改用户资料  addUser 为设备添加用户
      data: {
        //每一项选择数据
        imageUrl: '',
        name: '',
        birthday: '',
        sex: '',
        height: '',
        weight: '',
        bloodType: '',
        city: '',
        county: '',
        province: '',
        wasSmoke: '',
        wasWine: '',
        sportsTime: '',
      },
    };
  }
  componentDidMount() {
    this.judgeFrom();
    this.viewDidAppear2 = this.props.navigation.addListener('willBlur', obj => {
      Picker.isPickerShow(isShow => {
        isShow && Picker.hide();
      });
    });
  }
  componentWillUnmount = () => {
    this.viewDidAppear2.remove();
  };
  //  设置姓名
  setName = val => {
    this.setState({
      data: Object.assign({}, this.state.data, {
        name: val,
      }),
    });
  };
  //   判断跳转入口
  judgeFrom = () => {
    let type = this.props.navigation.getParam('type');
    this.setState({
      type,
    });
    // let data = this.props.navigation.getParam('data');
    if (type === 'user') {
      let {userdata} = this.props.data;
      let param = {
        imageUrl: userdata.imageUrl,
        name: userdata.name,
        birthday: userdata.birthday,
        sex: userdata.sex,
        height: userdata.height,
        weight: userdata.weight,
        bloodType: userdata.bloodType,
        city: userdata.city,
        county: userdata.county,
        province: userdata.province,
        wasSmoke: userdata.wasSmoke,
        wasWine: userdata.wasWine,
        sportsTime: userdata.sportsTime,
      };
      this.setState({
        data: param,
      });
    } else {
      console.log('我是来自添加用户');
    }
  };
  //  获取用户选择图片地址
  getImgUrl = async url => {
    try {
      let res = await uploadImg(url);
      this.setState({
        data: Object.assign({}, this.state.data, {
          imageUrl: res,
        }),
      });
    } catch (error) {
      console.log('请求错误', error);
    }
  };
  //  item选项
  pickerItem = (name, nameData) => {
    // Picker.isPickerShow(isShow => {
    //   console.log('选择器状态', isShow);
    // });
    if (typeof name !== 'string') {
      let arr = name.map(v => {
        return this.state.data[v];
      });
      this.pikerInit(getArea(), arr, 'address');
      return;
    }
    switch (name) {
      case 'imageUrl':
        Nav.navigate('PhotoWall', {callback: this.getImgUrl});
        break;
      case 'name':
        Nav.navigate('SetUserName', {
          name: nameData,
          callback: this.setName,
        });
        break;
      case 'birthday':
        let date = new Date();
        let y = date.getFullYear();
        let m = String(date.getMonth() + 1);
        let d = String(date.getDate());
        this.pikerInit(
          getDate(),
          nameData
            ? moment(nameData)
                .format('YYYY-M-D')
                .split('-')
            : [y, m, d],
          name,
        );
        break;
      case 'sex':
        this.pikerInit(
          ['男', '女'],
          nameData != undefined ? [nameData == 1 ? '男' : '女'] : [],
          name,
        );
        break;
      case 'height':
        let minHeight = 140;
        let maxHeight = 220;
        let heightData = [];
        for (let i = minHeight; i <= maxHeight; i++) {
          heightData.push(String(i));
        }
        this.pikerInit(
          heightData,
          nameData ? [nameData] : ['160'],
          name,
          '身高(cm)',
        );
        break;
      case 'weight':
        let minWeight = 35;
        let maxWeight = 125;
        let Weightdata = [];
        for (let i = minWeight; i <= maxWeight; i++) {
          Weightdata.push(String(i));
        }
        this.pikerInit(
          Weightdata,
          nameData ? [nameData] : ['50'],
          name,
          '体重(kg)',
        );
        break;
      case 'bloodType':
        this.pikerInit(
          ['A', 'B', 'O', 'AB', 'RH阳性', 'RH阴性'],
          nameData ? [nameData] : ['O'],
          name,
        );
        break;
      case 'wasSmoke':
        this.pikerInit(
          ['是', '否'],
          nameData != undefined ? [nameData === 1 ? '是' : '否'] : [],
          name,
        );
        break;
      case 'wasWine':
        this.pikerInit(
          ['是', '否'],
          nameData != undefined ? [nameData === 1 ? '是' : '否'] : [],
          name,
        );
        break;
      case 'sportsTime':
        let movementTimeData = ['小于1小时', '小于3小时', '3小时及以上'];
        this.pikerInit(
          movementTimeData,
          nameData ? [movementTimeData[nameData - 1]] : [],
          name,
        );
        break;
      default:
        break;
    }
  };
  //   显示piker框
  pikerInit(data, selectedValue = [], name, title = '') {
    Picker.init({
      pickerData: data,
      selectedValue: selectedValue,
      pickerTitleText: title,
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerConfirmBtnColor: [111, 110, 115, 1],
      pickerCancelBtnColor: [111, 110, 115, 1],
      pickerToolBarFontSize: setSize(7),
      pickerTitleColor: [111, 110, 115, 0.5], //选择器标题颜色
      pickerToolBarBg: [247, 247, 247, 1], //选择器顶部条背景色
      pickerBg: [229, 228, 233, 1], //选择器背景色
      //确定
      onPickerConfirm: data => {
        //对生日和地址选择的数据做特殊处理
        switch (name) {
          case 'birthday':
            let str = data.join('-');
            this.setState({
              data: Object.assign({}, this.state.data, {
                birthday: moment(str).toISOString(),
              }),
            });
            break;
          case 'address':
            this.setState({
              data: Object.assign({}, this.state.data, {
                province: data[0],
                city: data[1],
                county: data[2],
              }),
            });
            break;
          case 'sex':
            this.setState({
              data: Object.assign({}, this.state.data, {
                sex: data[0] === '男' ? 1 : 0,
              }),
            });
            break;
          case 'wasSmoke':
          case 'wasWine':
            this.setState({
              data: Object.assign({}, this.state.data, {
                [name]: data[0] === '是' ? 1 : 0,
              }),
            });
            break;
          case 'sportsTime':
            let val = '';
            if (data[0] === '小于1小时') {
              val = 1;
            } else if (data[0] === '小于3小时') {
              val = 2;
            } else {
              val = 3;
            }
            this.setState({
              data: Object.assign({}, this.state.data, {
                sportsTime: val,
              }),
            });
            break;
          default:
            this.setState({
              data: Object.assign({}, this.state.data, {
                [name]: data[0],
              }),
            });
            break;
        }
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
  }
  //  便利data的值是否必填
  dataTrue = () => {
    let {data} = this.state;
    let flag = false;
    for (const key in data) {
      if (data[key] === '') {
        flag = true;
        break;
      }
    }
    return flag;
  };
  //   提交按钮
  submitFn = async () => {
    let {type, data} = this.state;
    let {userdata} = this.props.data;
    if (type === 'user') {
      if (data.birthday)
        data.age = Math.floor(moment().diff(data.birthday, 'years', true));
      let reslut = Object.assign({}, userdata, data);
      try {
        await updateUserInfo(reslut);
        console.log(reslut);
        storage.save('userdata', reslut);
        this.props.dispatch(save_userdata(reslut));
        toast.show('修改成功', 1000, () => {
          Nav.goBack();
        });
      } catch (error) {
        console.log('修改资料失败', error);
      }
      //   await addUserIs(this.state.data);
      //   toast.show('提交成功', 1000, () => {
      //     this.props.navigation.getParam('callback')();
      //     Nav.goBack();
      //   });
    } else {
      Nav.navigate('EditUserTel', {data: this.state.data});
    }
  };
  //   显示选中数据
  nameType = name => {
    let {data} = this.state;

    if (typeof name !== 'string') {
      //    let param = [data.province];
      //  return `${data.province + ','}${data.city +
      //    ','}${data.county+','}`;
      let str = '';
      name.map(v => {
        if (data[v]) {
          str += data[v] + ',';
        }
      });
      let newStr = str.substring(0, str.length - 1);
      return newStr;
    }
    if (data[name] === '' || data[name] == undefined) {
      return '';
    }
    switch (name) {
      case 'imageUrl':
        return '';
      case 'bloodType':
        return data[name] + '型';
      case 'birthday':
        return moment(data[name]).format('YYYY-M-D');
      case 'sex':
        return data[name] === 1 ? '男' : '女';
      case 'wasSmoke':
      case 'wasWine':
        return data[name] === 1 ? '是' : '否';
      case 'height':
        return data[name] ? data[name] + 'cm' : data[name];
      case 'weight':
        return data[name] ? data[name] + 'kg' : data[name];
      case 'sportsTime':
        if (data[name] === 1) {
          return '小于1小时';
        } else if (data[name] === 2) {
          return '小于3小时';
        } else {
          return '3小时及以上';
        }
      default:
        return data[name];
    }
  };
  renderItem = (item, index) => {
    let {listData, data} = this.state;
    let rightStr = this.nameType(item.name);

    return (
      <ListItem
        title={item.title}
        key={index + 'list'}
        underlayColor="rgba(255,255,255,0.1)"
        containerStyle={{
          backgroundColor: 'transparent',
          height: item.name === 'imageUrl' ? setSize(40) : setSize(25),
          paddingHorizontal: setSize(4),
          borderBottomColor: Color.minBorder,
          borderBottomWidth: index === listData.length - 1 ? 0 : 1,
        }}
        titleStyle={{
          fontSize: setSize(7),
          color: Color.mainText,
        }}
        rightTitle={rightStr}
        rightTitleStyle={{
          color: Color.minText,
          fontSize: setSize(7),
        }}
        rightContentContainerStyle={{
          flex: 2,
        }}
        rightAvatar={
          item.name === 'imageUrl'
            ? {
                rounded: true,
                size: setSize(29),
                icon: !data.name[0] ? {type: 'antdesign', name: 'user'} : null,
                title: data.name[0] ? data.name[0] : '',
                marginRight: setSize(4),
                titleStyle: {
                  fontSize: setSize(8),
                },
                source: data[item.name] ? {uri: data[item.name]} : null,
              }
            : null
        }
        onPress={() =>
          this.pickerItem(
            item.name,
            typeof item.name == 'string' ? data[item.name] : null,
            index,
          )
        }
        // bottomDivider
        chevron={item.name !== 'imageUrl'}
      />
    );
  };
  render() {
    let {tip, listData, type} = this.state;
    let isDis = this.dataTrue();
    return (
      <View style={styles.container}>
        <Header
          back
          centerComponent={type === 'user' ? '修改资料' : '添加成员'}
        />
        {/* 这是一个示例demo */}
        <ScrollView style={{flex: 1}}>
          <View style={{paddingHorizontal: setSize(6)}}>
            <Text
              style={{
                color: Color.minText,
                fontSize: setSize(6),
                lineHeight: setSize(9),
                paddingVertical: setSize(8),
                paddingLeft: setSize(4),
                paddingRight: setSize(3),
              }}>
              {tip}
            </Text>
            <View style={{backgroundColor: '#fff', borderRadius: 6}}>
              {listData.map((v, i) => {
                return this.renderItem(v, i);
              })}
            </View>
          </View>
          <Button
            title={type === 'user' ? '确定' : '下一步'}
            buttonStyle={{
              borderRadius: 30,
              backgroundColor: Color.primary,
              marginVertical: 20,
              marginHorizontal: setSize(6),
            }}
            disabledStyle={{backgroundColor: Color.downPrimary}}
            disabled={isDis}
            disabledTitleStyle={{color: '#fff'}}
            onPress={this.submitFn}
          />
        </ScrollView>
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
