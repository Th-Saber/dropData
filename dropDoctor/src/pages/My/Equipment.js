import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Color, setSize, Img} from '@/theme';
import {Image, Icon, Header, UserInfo, List} from '@/components';

export default function Equipment({navigation, route}) {
  let {item} = route.params;
  const [listData, setListData] = useState([
    {
      name: '李文灿',
      sex: 1,
      age: 26,
      isMe: true,
      tel: '18088888888',
    },
    {
      name: '刘悦',
      sex: 2,
      age: 18,
      isMe: false,
      tel: '18088888888',
    },
    {
      name: '刘悦',
      sex: 2,
      age: 18,
      isMe: false,
      tel: '18088888888',
    },
    {
      name: '刘悦',
      sex: 2,
      age: 18,
      isMe: false,
      tel: '18088888888',
    },
  ]);

  function onRefresh(done) {
    setTimeout(() => {
      done();
    }, 2000);
  }

  return (
    <View style={{flex: 1}}>
      <Header back title="成员及设备" />
      <View
        style={{
          borderTopColor: Color.line,
          borderTopWidth: 1,
          flex: 1,
        }}>
        <UserInfo item={item} type={2} />
        <List
          style={{
            marginHorizontal: setSize(24),
            marginTop: setSize(50),
          }}
          border={false}
          data={listData}
          onRefresh={onRefresh}
          _renderItem={({item, index}) => (
            <ListItem
              border={index !== listData.length - 1}
              key={index + 'list'}
              item={item}
            />
          )}
        />
      </View>
    </View>
  );
}

function UserList({item: {sex, tel, age, name, isMe}}) {
  return (
    <View
      style={{
        height: setSize(156),
        backgroundColor: '#fff',
        borderRadius: 6,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: setSize(30),
      }}>
      <Image
        style={{
          width: setSize(108),
          height: setSize(108),
          borderRadius: 50,
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
            {name}
          </Text>
          <View style={{marginHorizontal: setSize(10)}}>
            <Icon
              type="antdesign"
              size={setSize(24)}
              color={sex === 1 ? Color.man : Color.woman}
              name={sex === 1 ? 'man' : 'woman'}
            />
          </View>
          <Text style={{fontSize: setSize(24), color: Color.text}}>
            {age}岁
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              paddingHorizontal: setSize(15),
              backgroundColor: Color.bg_tag,
              alignItems: 'center',
              borderRadius: 20,
            }}>
            <Text style={{fontSize: setSize(22), color: Color.primary}}>
              {isMe ? '本人' : '成员'}
            </Text>
          </View>
          <Text
            style={{
              marginLeft: setSize(38),
              color: Color.primary,
              fontSize: setSize(22),
            }}>
            {tel}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ListItem({item}) {
  return (
    <View
      style={{
        marginBottom: setSize(20),
        backgroundColor: '#fff',
        borderRadius: 6,
      }}>
      <UserList item={item} />
      <TouchableOpacity
        activeOpacity={0.9}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: setSize(114),
          paddingHorizontal: setSize(24),
          borderTopColor: Color.line,
          borderTopWidth: 1,
        }}>
        <View style={{alignItems: 'flex-start', flex: 1}}>
          <Text style={{color: Color.text, fontSize: setSize(32)}}>
            生命体征仪
          </Text>
        </View>
        <View style={{alignItems: 'center', flex: 1}}>
          <Text style={{color: Color.primary, fontSize: setSize(22)}}>
            使用演示
          </Text>
        </View>
        <View
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            },
          ]}>
          <Icon
            type="antdesign"
            name="right"
            color={Color.info}
            size={setSize(24)}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: setSize(114),
          paddingHorizontal: setSize(24),
          borderTopColor: Color.line,
          borderTopWidth: 1,
        }}>
        <View style={{alignItems: 'flex-start', flex: 1}}>
          <Text style={{color: Color.text, fontSize: setSize(32)}}>
            尿常规检测仪
          </Text>
        </View>
        <View style={{alignItems: 'center', flex: 1}}>
          <Text style={{color: Color.primary, fontSize: setSize(22)}}>
            使用演示
          </Text>
        </View>
        <View
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            },
          ]}>
          <Icon
            type="antdesign"
            name="right"
            color={Color.info}
            size={setSize(24)}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
