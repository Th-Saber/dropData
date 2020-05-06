import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Clipboard} from 'react-native';
import {Color, setSize} from '@/theme';
import {Header, UserInfo, List, toast} from '@/components';

export default function Address({navigation, route}) {
  let {item} = route.params;
  const [listData, setListData] = useState([
    {
      name: '李毛毛',
      tel: '18088888888',
      address: '四川省 成都市 高新区 菁蓉汇5A3楼菁蓉汇5A3楼 汇5A3楼',
      default: true,
    },
    {
      name: '李毛毛',
      tel: '18088888888',
      address: '四川省 成都市 高新区 菁蓉汇5A3楼菁蓉汇5A3楼 汇5A3楼',
    },
    {
      name: '李毛毛',
      tel: '18088888888',
      address: '四川省 成都市 高新区 菁蓉汇5A3楼菁蓉汇5A3楼 汇5A3楼',
    },
  ]);
  function onRefresh(done) {
    setTimeout(() => {
      done();
    }, 2000);
  }
  return (
    <View style={{flex: 1}}>
      <Header back title="紧急联系人" />
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
            <ListItem key={index + 'list'} item={item} />
          )}
        />
      </View>
    </View>
  );
}

//列表组件
function ListItem({item}) {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        marginBottom: setSize(20),
        borderRadius: 6,
        height: setSize(250),
        justifyContent: 'space-between',
        paddingHorizontal: setSize(15),
        paddingTop: setSize(20),
      }}>
      <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
        <Text style={{fontSize: setSize(32), color: Color.title}}>
          {item.name}&emsp;
        </Text>
        <Text style={{fontSize: setSize(32), color: Color.info}}>
          {item.tel}
        </Text>
      </View>
      <Text style={{fontSize: setSize(26), color: Color.title}}>
        {item.address}
      </Text>
      <View
        style={{
          height: setSize(80),
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: setSize(10),
          alignItems: 'center',
          borderTopColor: Color.line,
          borderTopWidth: 1,
        }}>
        {item.default ? (
          <View
            style={{
              paddingHorizontal: setSize(15),
              backgroundColor: Color.bg_tag,
              borderRadius: 2,
            }}>
            <Text style={{color: Color.primary, fontSize: setSize(24)}}>
              默认
            </Text>
          </View>
        ) : (
          <View />
        )}
        <TouchableOpacity
          hitSlop={{left: 10, right: 10, top: 10, bottom: 10}}
          activeOpacity={0.9}
          onPress={() => copyUser(item)}>
          <Text style={{color: Color.info, fontSize: setSize(24)}}>
            一键复制
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 复制用户信息
function copyUser(item) {
  Clipboard.setString(`${item.name}\n${item.tel}\n${item.address}`);
  toast.success('复制成功');
}
