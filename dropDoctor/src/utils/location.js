import {
  init,
  Geolocation,
  setAllowsBackgroundLocationUpdates,
} from 'react-native-amap-geolocation';
//初始化sdk
export async function geolocationInit() {
  //设置高德key
  await init({
    android: 'b018e5864e6d8aade4bee7f48df9d21d',
  });

  //开启后台定位,必须要Background Modes打开为ON，勾选Loaction updates，不然会报错！
  //必须在开始定位之前或者在定位stop的时候设置
  setAllowsBackgroundLocationUpdates(true);
}

//只获得一次当前地理位置
export function getCurrentPosition(callback) {
  Geolocation.getCurrentPosition(position => callback && callback(position));
}

//注册一个监听，它会每隔一段时间返回当前地理位置
export function watchPosition(callback) {
  Geolocation.watchPosition(position => callback && callback(position));
}
