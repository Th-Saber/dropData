import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Color, setSize, Img} from '@/theme';
import {Image, Icon, Header, UserInfo} from '@/components';

export default function HealthReport({navigation, route}) {
  let {item} = route.params;
  const [listData, setListData] = useState([
    {
      name: '酮体',
      value: '15.7',
      score: '62',
      up: true,
    },
    {
      name: '亚硝酸盐',
      value: '15.7',
      score: '62',
      up: true,
    },
    {
      name: '酮体',
      value: '15.7',
      score: '62',
      up: false,
    },
    {
      name: '亚硝酸盐',
      value: '15.7',
      score: '62',
      up: true,
    },
  ]);
  return (
    <View style={{flex: 1}}>
      <Header back title="健康数据" />
      <View
        style={{
          borderTopColor: Color.line,
          borderTopWidth: 1,
        }}>
        <UserInfo item={item} type={2} />
        <TabList />
        <UserList sex={1} />
        <View
          style={{
            flexDirection: 'row',
            marginVertical: setSize(30),
            paddingHorizontal: setSize(50),
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: setSize(28), color: Color.title}}>
            需重点观察的指标
          </Text>
          <Text style={{fontSize: setSize(26), color: Color.danger}}>
            {listData.length}项
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: setSize(24),
            backgroundColor: '#fff',
            borderRadius: 6,
          }}>
          {listData.map((v, i) => {
            return (
              <ListItem
                border={i !== listData.length - 1}
                key={i + 'list'}
                item={v}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

// 顶部切换栏
function TabList({}) {
  const [actTab, setActTab] = useState('1');
  const tabList = [
    {value: '1', label: '尿常规检测'},
    {value: '2', label: '生命体征检测'},
  ];
  return (
    <View
      style={{
        height: setSize(120),
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {tabList.map((v, i) => {
        return (
          <View
            key={i + 'tav'}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            <TouchableOpacity
              activeOpacity={1}
              hitSlop={{left: 10, right: 10, top: 10, bottom: 10}}
              onPress={() => setActTab(v.value)}>
              <Text
                style={{
                  color: v.value === actTab ? Color.primary : Color.title,
                  fontSize: setSize(32),
                }}>
                {v.label}
              </Text>
            </TouchableOpacity>
            {v.value === actTab && (
              <View
                style={{
                  height: 2,
                  width: setSize(76),
                  backgroundColor: Color.primary,
                  position: 'absolute',
                  bottom: -6,
                  alignItems: 'center',
                }}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

function UserList({sex}) {
  return (
    <View
      style={{
        height: setSize(140),
        backgroundColor: '#fff',
        borderRadius: 6,
        marginHorizontal: setSize(24),
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: setSize(20),
      }}>
      <Image
        style={{
          width: setSize(98),
          height: setSize(98),
          borderRadius: 50,
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          marginLeft: setSize(22),
          height: '100%',
          paddingVertical: setSize(22),
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
            李文才
          </Text>
          <View style={{marginHorizontal: setSize(10)}}>
            <Icon
              type="antdesign"
              size={setSize(24)}
              color={sex === 1 ? Color.man : Color.woman}
              name={sex === 1 ? 'man' : 'woman'}
            />
          </View>
        </View>
        <View
          style={{
            alignSelf: 'flex-start',
            paddingHorizontal: setSize(15),
            backgroundColor: Color.bg_tag,
            alignItems: 'center',
            borderRadius: 20,
          }}>
          <Text style={{fontSize: setSize(22), color: Color.primary}}>
            本人
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: setSize(90),
        }}>
        <Text style={{fontSize: setSize(32), color: Color.title}}>
          85&nbsp;
          <Text style={{color: Color.text, fontSize: setSize(24)}}>分</Text>
        </Text>
        <Text style={{fontSize: setSize(32), color: Color.success}}>
          &emsp; 健康
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.9}
        hitSlop={{left: 10, right: 10, top: 10, bottom: 10}}
        style={{alignItems: 'center'}}>
        <Icon
          type="antdesign"
          name="retweet"
          size={setSize(36)}
          color={Color.primary}
        />
        <Text style={{fontSize: setSize(20), color: Color.info}}>切换</Text>
      </TouchableOpacity>
    </View>
  );
}

function ListItem({item: {name, value, score, up}, border}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          height: setSize(100),
          paddingHorizontal: setSize(24),
        },
        border
          ? {
              borderBottomColor: Color.line,
              borderBottomWidth: 1,
            }
          : {},
      ]}>
      <View style={{alignItems: 'flex-start', flex: 1}}>
        <Text style={{color: Color.text, fontSize: setSize(32)}}>{name}</Text>
      </View>
      <View style={{alignItems: 'center', flex: 1}}>
        <Text style={{color: Color.text, fontSize: setSize(26)}}>{value}%</Text>
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
        <Text
          style={{
            fontSize: setSize(30),
            color: Color.title,
          }}>
          {score}
          <Text style={{color: Color.text, fontSize: setSize(24)}}>
            &nbsp;分
          </Text>
        </Text>
        <Icon
          type="entypo"
          name={up ? 'arrow-long-up' : 'arrow-long-down'}
          color={up ? Color.success : Color.danger}
          size={setSize(24)}
          style={{
            marginHorizontal: setSize(12),
          }}
        />
        <Icon
          type="antdesign"
          name="right"
          color={Color.info}
          size={setSize(24)}
        />
      </View>
    </TouchableOpacity>
  );
}
