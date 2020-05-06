import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {Color, setSize} from '@/theme';
import {Header, UserInfo, List} from '@/components';

export default function Contact({navigation, route}) {
  let {item} = route.params;
  const [listData, setListData] = useState([
    {
      name: '二傻',
      tel: '18088888888',
    },
    {
      name: '二傻',
      tel: '18088888888',
    },
    {
      name: '二傻',
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
        marginBottom: setSize(10),
        borderRadius: 6,
        height: setSize(100),
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: setSize(15),
        flexDirection: 'row',
      }}>
      <Text style={{fontSize: setSize(32), color: Color.title}}>
        {item.name}
      </Text>
      <Text style={{fontSize: setSize(26), color: Color.title}}>
        {item.tel}
      </Text>
    </View>
  );
}
