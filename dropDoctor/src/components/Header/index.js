import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Color, setSize} from '@/theme';
import {Nav} from '@/navigators';
import {getBarHeight} from '@/utils/global';
import {Icon} from '@/components';

export default function Header({back, title, left, right = []}) {
  let barHeight = getBarHeight();

  return (
    <View style={[style.content]}>
      <View style={{height: barHeight}} />
      <View style={style.head_box}>
        <View style={style.left}>
          {left ||
            (back && (
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={{left: 10, right: 10, bottom: 10, top: 10}}
                onPress={() => Nav.goBack()}>
                <Icon
                  type="antdesign"
                  name="left"
                  size={setSize(32)}
                  color={Color.text}
                />
              </TouchableOpacity>
            ))}
        </View>
        <View style={style.center}>
          <Text style={{fontSize: setSize(34), color: Color.title}}>
            {title}
          </Text>
        </View>
        <View style={style.right}>{right}</View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
  },
  head_box: {
    height: setSize(110),
    flexDirection: 'row',
    paddingHorizontal: setSize(24),
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  center: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
