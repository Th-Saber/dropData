import {request, PERMISSIONS} from 'react-native-permissions';
import {Platform} from 'react-native';
export default {
  // 检查权限生成
  check: async key => {
    let permiss = permissList(key);
    if (!permiss) return;
    if (Array.isArray(permiss)) {
      for (const v of permiss) {
        questPermiss(v);
      }
    } else {
      let res = await questPermiss(permiss);
      return res;
    }
  },
};
//   自己封装的权限别名
function permissList(key) {
  switch (key) {
    case 'CAMERA': //相机
      return Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
    case 'PHOTO': //相册
      return Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    case 'WRITE': //保存图片
      return Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
    case 'MICROPHONE': //麦克风录音
      return Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO;
    case 'LOCATION': //定位权限
      return Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    //   :[
    //     PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    //     PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    //   ];
    default:
      return;
  }
}
// 请求本机权限
async function questPermiss(permiss) {
  try {
    const cameraStatus = await request(permiss);
    return cameraStatus;
    /**
     * @return {granted}// "用户允许访问权限"
     * @return {denied}//"该权限不用授权可以访问"
     * @return {blocked}//"用户拒绝授权"
     * @return {unavailable}//"设备不支持该权限"
     *
     */
  } catch (error) {
    console.log('权限请求错误', error);
  }
}
