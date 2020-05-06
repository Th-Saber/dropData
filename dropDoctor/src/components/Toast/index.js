import React, {useState, useEffect} from 'react';
import {View, Text, Keyboard} from 'react-native';
import {setSize, Color} from '@/theme';
import Toast from 'react-native-easy-toast';
import {Icon} from '@/components';

// toast变量
let _toast;
let _center;

export default function ToastCom() {
  return (
    <>
      <Toast
        ref={toast => (_toast = toast)}
        style={{backgroundColor: 'rgba(0,0,0,.5)'}}
        fadeInDuration={100}
      />
      <Toast
        ref={est => (_center = est)}
        position="center"
        fadeOutDuration={1}
        fadeInDuration={100}
        style={{
          backgroundColor: 'rgba(0,0,0,.5)',
          height: setSize(110),
          paddingHorizontal: setSize(52),
          justifyContent: 'center',
          borderRadius: 6,
        }}
        textStyle={{fontSize: setSize(30), color: '#fff'}}
      />
    </>
  );
}

// 显示
export const toast = {
  //显示基础
  show: (msg, time = 2000, callback) => {
    Keyboard.dismiss();
    _toast.show(msg, time, callback);
  },
  //   关闭
  close: () => {
    _toast.close();
    _center.close();
  },
  //   中间显示信息
  info: (msg, time = 2000, callback) => {
    Keyboard.dismiss();
    _center.show(msg, time, callback);
  },
  //   成功
  success: (msg = '成功', time = 2000, callback) => {
    Keyboard.dismiss();
    _center.show(
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon
          type="feather"
          name="check"
          color={Color.success}
          size={setSize(28)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 20,
            height: setSize(36),
            width: setSize(36),
          }}
        />
        <Text
          style={{
            color: '#fff',
            marginLeft: setSize(12),
            fontSize: setSize(32),
          }}>
          {msg}
        </Text>
      </View>,
      time,
      callback,
    );
  },
  //   错误失败
  fail: (msg = '失败', time = 2000, callback) => {
    Keyboard.dismiss();
    _center.show(
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon
          type="antdesign"
          name="close"
          color={Color.danger}
          size={setSize(28)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 20,
            height: setSize(36),
            width: setSize(36),
          }}
        />
        <Text
          style={{
            color: '#fff',
            marginLeft: setSize(12),
            fontSize: setSize(32),
          }}>
          {msg}
        </Text>
      </View>,
      time,
      callback,
    );
  },
  //   错误失败
  load: (msg = '加载中,请稍后') => {
    Keyboard.dismiss();
    _center.show(<Loading msg={msg} />, 0);
  },
};

// 显示loading
function Loading({msg}) {
  let timer;
  const [x, setX] = useState('.');
  useEffect(() => {
    timer = setInterval(() => {
      setX(x === '...' ? '.' : x + '.');
    }, 300);
    return () => {
      timer && clearInterval(timer);
    };
  });
  return (
    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
      <Text
        style={{
          color: '#fff',
          fontSize: setSize(32),
        }}>
        {msg}
      </Text>
      <Text
        style={{
          width: setSize(30),
          color: '#fff',
          fontSize: setSize(32),
        }}>
        {x}
      </Text>
    </View>
  );
}
