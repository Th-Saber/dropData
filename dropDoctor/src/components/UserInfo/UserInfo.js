import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Color, setSize} from '@/theme';
import {Image, Icon} from '@/components';
import moment from 'moment';
// 列表组件
export default function _renderItem({item, type = 1, onPress}) {
  // type: 1 聊天列表   2用户数据
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        typeof onPress === 'function' && onPress();
      }}
      style={{
        height: setSize(166),
        backgroundColor: '#fff',
        paddingHorizontal: setSize(24),
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {type === 2 && (
        <View
          style={{
            borderRadius: 20,
            height: setSize(20),
            width: setSize(20),
            marginRight: setSize(20),
            backgroundColor: Color.success,
          }}
        />
      )}
      <Image
        style={{
          backgroundColor: Color.bg_err,
          height: setSize(100),
          width: setSize(100),
          borderRadius: 4,
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          marginLeft: setSize(22),
          height: '100%',
          paddingVertical: setSize(30),
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: setSize(32),
              color: Color.title,
            }}>
            {item.name}
          </Text>
          <View style={{marginHorizontal: setSize(10)}}>
            <Icon
              type="antdesign"
              size={setSize(24)}
              color={item.sex === 1 ? Color.man : Color.woman}
              name={item.sex === 1 ? 'man' : 'woman'}
            />
          </View>
          <Text
            style={{
              fontSize: setSize(24),
              color: Color.text,
              alignSelf: 'flex-end',
            }}>
            {type === 2 ? item.tel : item.age + '岁'}
          </Text>
        </View>
        <Text
          style={{
            fontSize: setSize(30),
            color: Color.info,
          }}>
          {item.msg}
        </Text>
      </View>
      {type === 1 && (
        <View
          style={{
            width: setSize(120),
            height: '100%',
            paddingVertical: setSize(50),
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: setSize(22),
              letterSpacing: 1,
              color: Color.info,
            }}>
            {showTime(item.time)}
          </Text>
          <View
            style={{
              borderRadius: 20,
              height: setSize(20),
              width: setSize(20),
              backgroundColor: Color.success,
            }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

//   过滤时间
function showTime(time) {
  if (!time) return '';
  let oldTime = moment(time);
  let newTime = moment(moment().format('YYYY-MM-DD 00:00:00'));
  if (oldTime > newTime) {
    return moment(time).format('HH:mm');
  }
  if (oldTime < newTime && newTime - oldTime > 1000 * 60 * 60 * 24) {
    //86400
    return moment(time).format('M月D日');
  } else {
    return moment(time).calendar();
  }
}
