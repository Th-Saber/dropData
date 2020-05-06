import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Color, setSize, Img} from '@/theme';
import {Image, Icon, Header, UserInfo} from '@/components';

export default function User({navigation, route}) {
  let {item} = route.params;
  let listData = [
    {
      title: '健康报告',
      img: Img.list_health,
      path: 'HealthReport',
    },
    {
      title: '成员及设备',
      img: Img.list_user,
      path: 'Equipment',
    },
    {
      title: '紧急联系人',
      img: Img.list_phone,
      path: 'Contact',
    },
    {
      title: '地址',
      img: Img.list_address,
      path: 'Address',
    },
  ];
  return (
    <View>
      <Header back title="用户信息" right={<RightCom />} />
      <View style={{borderTopColor: Color.line, borderTopWidth: 1}}>
        <UserInfo item={item} type={2} />
        <View
          style={{
            marginHorizontal: setSize(24),
            marginVertical: setSize(50),
            backgroundColor: '#fff',
            borderRadius: 6,
          }}>
          {listData.map((v, i) => {
            return (
              <ListItem
                border={i !== listData.length - 1}
                key={i + 'list'}
                img={v.img}
                title={v.title}
                onPress={() => navigation.navigate(v.path, {item})}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}
function ListItem({img, title, border, onPress}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => typeof onPress === 'function' && onPress()}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: setSize(100),
      }}>
      <Image
        source={img}
        resizeMode="contain"
        style={{
          height: setSize(34),
          width: setSize(34),
          marginHorizontal: setSize(14),
        }}
      />
      <View
        style={[
          {
            flexDirection: 'row',

            height: '100%',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          },
          border
            ? {
                borderBottomColor: Color.line,
                borderBottomWidth: 1,
              }
            : {},
        ]}>
        <Text
          style={{
            fontSize: setSize(30),
            color: Color.title,
            marginLeft: setSize(10),
          }}>
          {title}
        </Text>
        <Icon
          type="antdesign"
          name="right"
          color={Color.info}
          size={setSize(24)}
          style={{
            marginRight: setSize(24),
          }}
        />
      </View>
    </TouchableOpacity>
  );
}

function RightCom() {
  return (
    <TouchableOpacity
      activeOpacity={1}
      hitSlop={{left: 10, right: 10, top: 10, bottom: 10}}
      style={{flexDirection: 'row', alignItems: 'center'}}>
      <View
        style={{
          width: setSize(26),
          height: setSize(26),
          borderRadius: 30,
          borderWidth: 2,
          borderColor: Color.line,
        }}
      />
      <Text
        style={{
          fontSize: setSize(24),
          color: Color.primary,
          marginLeft: setSize(18),
        }}>
        标记
      </Text>
    </TouchableOpacity>
  );
}
