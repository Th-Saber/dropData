import React from 'react';
import {View, Text, Button} from 'react-native';
export default function EnterPage({navigation}) {
  return (
    <View style={{flex: 1}}>
      <Button title="去登陆" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}
