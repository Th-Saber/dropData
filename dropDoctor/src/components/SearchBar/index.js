import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {Color, setSize} from '@/theme';
import {Icon} from '@/components';
export default function SearchBar({style, onChange}) {
  const [value, setValue] = useState('');
  return (
    <View style={[styles.contener, style]}>
      {!value && (
        <View style={styles.holder}>
          <Icon
            type="antdesign"
            name="search1"
            size={setSize(30)}
            color={Color.info}
          />
          <Text style={styles.holder_text}> 搜索</Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={text => {
          setValue(text);
          typeof onChange === 'function' && onChange(text);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contener: {
    backgroundColor: '#fff',
    height: setSize(76),
    marginHorizontal: setSize(24),
    marginVertical: setSize(15),
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    fontSize: setSize(30),
    color: Color.text,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  holder: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
  },
  holder_text: {
    fontSize: setSize(30),
    color: Color.info,
    marginLeft: setSize(20),
  },
});
