import React, {useState} from 'react';
import {View, TextInput} from 'react-native';
import {setSize, Color} from '@/theme';

export default function Input({
  left,
  right,
  value,
  onChangeText,
  placeholder,
  border,
  keyboardType = 'default',
  pass,
  max,
}) {
  return (
    <View
      style={[
        {
          height: setSize(100),
          flexDirection: 'row',
          alignItems: 'center',
        },
        border
          ? {
              borderBottomColor: Color.line,
              borderBottomWidth: 1,
            }
          : {},
      ]}>
      {left}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        secureTextEntry={pass}
        maxLength={max}
        placeholderTextColor={Color.info}
        style={{
          flex: 1,
          fontSize: setSize(26),
          color: Color.title,
        }}
      />
      {right}
    </View>
  );
}
