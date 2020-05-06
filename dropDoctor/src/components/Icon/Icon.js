import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import Fontisto from 'react-native-vector-icons/Fontisto';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

export default function Icon({type, size, name, color, style, onPress}) {
  let obj = {size, name, color},
    com;
  switch (type) {
    case 'antdesign':
      com = <AntDesign {...obj} />;
      break;
    case 'entypo':
      com = <Entypo {...obj} />;
      break;
    case 'evil':
      com = <EvilIcons {...obj} />;
      break;
    case 'feather':
      com = <Feather {...obj} />;
      break;
    case 'font':
      com = <FontAwesome {...obj} />;
      break;
    case 'font5':
      com = <FontAwesome5 {...obj} />;
      break;
    case 'font5Pro':
      com = <FontAwesome5Pro {...obj} />;
      break;
    case 'fontisto':
      com = <Fontisto {...obj} />;
      break;
    case 'simple':
      com = <SimpleLineIcons {...obj} />;
      break;
  }
  return onPress ? (
    <TouchableOpacity activeOpacity={1} style={style} onPress={onPress}>
      {com}
    </TouchableOpacity>
  ) : (
    <View style={style}>{com}</View>
  );
}
