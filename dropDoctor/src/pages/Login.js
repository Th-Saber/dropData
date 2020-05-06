import React, {useReducer, useEffect, useCallback} from 'react';
import {Text, View, TouchableOpacity, BackHandler} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Header, Input, Icon, toast} from '@/components';
import {Color, setSize} from '@/theme';
import {testRule} from '@/utils/rule';
import {storage} from '@/storage';
const initialState = {
  tel: '',
  password: '',
  watchLogin: true, //查看登录密码
  checked: false, //是否记住密码
};

function reducer(state, action) {
  switch (action.type) {
    case 'change':
      return {...state, ...action.data};
    default:
      return state;
  }
}

export default function Login({navigation}) {
  let lastBackPressed; //回退时间
  const [state, dispatch] = useReducer(reducer, initialState);
  //   回填账号密码
  useEffect(() => {
    storage.load('userPass', userPass => {
      userPass &&
        dispatch({
          type: 'change',
          data: {
            ...userPass,
            checked: true,
          },
        });
    });
    return () => {};
  }, []);
  // 监听返回键
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
          //最近2秒内按过back键，可以退出应用。
          BackHandler.exitApp();
          return false;
        }
        lastBackPressed = Date.now();
        toast.show('再次返回退出应用');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }),
  );
  //   提交按钮
  function submitFn() {
    if (!state.tel) {
      toast.show('手机号不能为空');
      return;
    }
    if (!testRule('phone', state.tel)) {
      toast.show('请输入正确的手机号');
      return;
    }
    if (!state.password) {
      toast.show('密码不能为空');
      return;
    }
    //   是否保存登录密码
    if (state.checked) {
      storage.save('userPass', {
        tel: state.tel,
        password: state.password,
      });
    } else {
      storage.remove('userPass');
    }
    toast.success('登录成功', 1000, () => {
      navigation.replace('Tab');
    });
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <Header title="登录" />
      <View
        style={{
          paddingHorizontal: setSize(24),
          borderTopColor: Color.line,
          borderTopWidth: 1,
        }}>
        <View
          style={{
            alignSelf: 'center',
            marginTop: setSize(106),
            height: setSize(184),
            width: setSize(184),
            borderRadius: 100,
            backgroundColor: Color.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: setSize(30), color: '#fff'}}>logo</Text>
        </View>
        <Text
          style={{
            fontSize: setSize(28),
            marginTop: setSize(30),
            color: Color.title,
            alignSelf: 'center',
          }}>
          智能哨兵 专家版
        </Text>
        {/* 输入框组 */}
        <View
          style={{
            marginTop: setSize(70),
            borderColor: Color.line,
            borderRadius: 6,
            borderWidth: 1,
          }}>
          <Input
            left={
              <Icon
                type="simple"
                name="screen-tablet"
                size={setSize(36)}
                color={Color.info}
                style={{marginHorizontal: setSize(38)}}
              />
            }
            right={
              <Icon
                type="antdesign"
                name="closecircle"
                size={setSize(32)}
                color={Color.info}
                style={{marginHorizontal: setSize(38)}}
                onPress={() => {
                  dispatch({
                    type: 'change',
                    data: {
                      tel: '',
                    },
                  });
                }}
              />
            }
            border
            max={11}
            value={state.tel}
            placeholder="请输入手机号"
            keyboardType="numeric"
            onChangeText={text =>
              dispatch({
                type: 'change',
                data: {
                  tel: text,
                },
              })
            }
          />
          <Input
            left={
              <Icon
                type="simple"
                name="lock"
                size={setSize(36)}
                color={Color.info}
                style={{marginHorizontal: setSize(38)}}
              />
            }
            right={
              <Icon
                type="feather"
                name={state.watchLogin ? 'eye' : 'eye-off'}
                size={setSize(32)}
                color={Color.info}
                style={{marginHorizontal: setSize(38)}}
                onPress={() => {
                  dispatch({
                    type: 'change',
                    data: {
                      watchLogin: !state.watchLogin,
                    },
                  });
                }}
              />
            }
            max={12}
            pass={state.watchLogin}
            value={state.password}
            placeholder="请输入密码"
            onChangeText={text =>
              dispatch({
                type: 'change',
                data: {
                  password: text,
                },
              })
            }
          />
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            dispatch({
              type: 'change',
              data: {
                checked: !state.checked,
              },
            })
          }
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            marginVertical: setSize(40),
          }}>
          <View style={{marginHorizontal: setSize(38)}}>
            <Icon
              type="fontisto"
              size={setSize(36)}
              color={state.checked ? Color.primary : Color.bg_tag}
              name={state.checked ? 'radio-btn-active' : 'radio-btn-passive'}
            />
          </View>
          <Text style={{fontSize: setSize(28), color: Color.primary}}>
            记住密码
          </Text>
        </TouchableOpacity>
        {/* 提交按钮 */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            borderRadius: 30,
            height: setSize(88),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Color.primary,
          }}
          onPress={submitFn}>
          <Text style={{color: '#fff', fontSize: setSize(34)}}>登录</Text>
        </TouchableOpacity>
        {/* 忘记密码  登录方式 */}
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{left: 10, right: 10, top: 10, bottom: 10}}
          style={{marginTop: setSize(30), alignSelf: 'center'}}
          onPress={() => {
            // navigation.navigate('ForgetPass', {inLogin: true});
            toast.info('请联系管理员处理');
          }}>
          <Text style={{color: Color.primary, fontSize: setSize(28)}}>
            忘记密码
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
