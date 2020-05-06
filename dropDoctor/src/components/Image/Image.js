import React, {useState} from 'react';
import {Image, View} from 'react-native';
import {Img, setSize} from '@/theme';
export default function ImageCom({source, style = {}, resizeMode}) {
  const [err, setErr] = useState(false);

  return !source || err ? (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#E5E5E5',
        },
        style,
      ]}>
      <Image
        style={{height: setSize(50), width: setSize(50)}}
        source={Img.default}
      />
    </View>
  ) : (
    <Image
      style={style}
      source={source}
      resizeMode={resizeMode}
      onError={() => setErr(true)}
    />
  );
}
