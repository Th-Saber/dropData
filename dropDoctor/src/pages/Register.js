import React, {Component} from 'react';
import {Text, Button, View} from 'react-native';

export default function Register({navigation}) {
  return (
    <View>
      <Text onPress={() => navigation.goBack()}> 返回 </Text>
      <Button
        title="去启动屏"
        onPress={() => navigation.navigate('EnterPage')}
      />
    </View>
  );
}
