import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Header, SearchBar, List, UserInfo, Icon} from '@/components';
import {Color, setSize} from '@/theme';
export default function My({navigation}) {
  let arr = [
    {
      name: '李文才',
      age: 26,
      sex: 1,
      tel: '18155559999',
      msg: '有糖尿病史',
      time: '2020-05-01 10:25:35',
    },
    {
      name: '李文才',
      age: 26,
      sex: 2,
      tel: '14477789998',
      msg: '失眠3年',
      time: '2020-05-03 12:25:35',
    },
    {
      name: '李文才',
      tel: '15666233332',
      age: 26,
      sex: 2,
      msg: 'vip用户',
      time: '2020-05-02 17:54:35',
    },
  ];
  return (
    <View style={{flex: 1}}>
      <Header left={LeftCom()} title="我的" right={RightCom()} />
      {cardHead()}
      <SearchBar onChange={() => {}} />
      <List
        data={arr}
        _renderItem={({item}) => (
          <UserInfo
            item={item}
            type={2}
            onPress={() => navigation.navigate('User', {item})}
          />
        )}
        onRefresh={onRefresh}
      />
    </View>
  );
}
//下拉刷新
function onRefresh(done) {
  setTimeout(() => {
    done();
  }, 2000);
}
function LeftCom() {
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
          color: Color.title,
          marginLeft: setSize(18),
        }}>
        选中颜色标记
      </Text>
    </TouchableOpacity>
  );
}
function RightCom() {
  return (
    <TouchableOpacity
      activeOpacity={1}
      hitSlop={{left: 10, right: 10, top: 10, bottom: 10}}>
      <Icon
        type="antdesign"
        name="ellipsis1"
        size={setSize(40)}
        color={Color.title}
      />
    </TouchableOpacity>
  );
}

function cardHead() {
  let headData = [
    {
      name: '标记（人）',
      value: '5232',
    },
    {
      name: '留言用户总数（人）',
      value: '5232',
    },
    {
      name: '昨日处理（条）',
      value: '5232',
    },
  ];
  return (
    <View
      style={{
        height: setSize(160),
        marginHorizontal: setSize(24),
        marginVertical: setSize(28),
        backgroundColor: '#fff',
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {headData.map((v, i) => {
        return (
          <View style={{alignItems: 'center', flex: 1}} key={i + 'card'}>
            <Text
              style={{
                color: Color.primary,
                fontSize: setSize(36),
                fontWeight: 'bold',
                letterSpacing: 1,
              }}>
              {v.value}
            </Text>
            <Text
              style={{
                fontSize: setSize(22),
                color: Color.text,
                marginTop: setSize(10),
              }}>
              {v.name}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
