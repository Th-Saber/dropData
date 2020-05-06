import React from 'react';
import {View} from 'react-native';
import {Header, SearchBar, List, UserInfo} from '@/components';
// import {Color, setSize} from '@/theme';
export default function Home() {
  let arr = [
    {
      name: '李文才',
      age: 26,
      sex: 1,
      msg: '接，你的飒飒的刷回答速滑队',
      time: '2020-05-01 10:25:35',
    },
    {
      name: '李文才',
      age: 26,
      sex: 1,
      msg: '接，你的飒飒的刷回答速滑队',
      time: '2020-05-03 12:25:35',
    },
    {
      name: '李文才',
      age: 26,
      sex: 0,
      msg: '接，你的飒飒的刷回答速滑队',
      time: '2020-05-02 17:54:35',
    },
  ];
  return (
    <View style={{flex: 1}}>
      <Header title="首页" />
      <SearchBar onChange={() => {}} />
      <List
        data={arr}
        _renderItem={({item}) => (
          <UserInfo item={item} type={1} onPress={() => {}} />
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
