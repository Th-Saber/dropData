import React, {Component, useState, useEffect} from 'react';
import {View, Text, Animated, TouchableOpacity} from 'react-native';

export default function AmtDialog({onRef}) {
  let spinValue = new Animated.Value(0);
  const [visibel, setVisibel] = useState(false);
  typeof onRef === 'function' && onRef({open});

  // 打开模态窗
  function open(type, options) {
    setVisibel(true);
  }

  useEffect(() => {
    if (visibel) {
      Animated.spring(spinValue, {
        toValue: 1,
      }).start(() => {});
    } else {
      Animated.timing(spinValue, {
        toValue: 0,
        duration: 200,
      }).start(() => {});
    }
    return () => {};
  }, [visibel]);
  return (
    visibel && (
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          opacity: spinValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0, 1],
          }),
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 0x00000050,
        }}>
        <TouchableOpacity
          onPress={() => setVisibel(false)}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        />
        <Animated.View
          style={{
            opacity: spinValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0, 1],
            }),
            transform: [
              {
                translateY: spinValue.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [200, 200, 0],
                }),
              },
            ],
          }}>
          {dialogCom}
        </Animated.View>
      </Animated.View>
    )
  );
}

function dialogCom() {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: 280,
        borderRadius: 6,
      }}>
      <View
        style={{
          minHeight: 120,
          justifyContent: 'center',
          width: '100%',
          padding: 26,
        }}>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 20,
            textAlign: 'center',
            color: '#444444',
          }}>
          标题
        </Text>
      </View>
      {/*按钮*/}
      <View
        style={{
          flexDirection: 'row',
          borderTopColor: '#e6e6e6',
          borderTopWidth: 0.5,
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => setVisibel(false)}
          activeOpacity={1}>
          <Text style={{fontSize: 16, color: '#629df8'}}>去开通</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
