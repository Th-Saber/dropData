import ReactNative, {
  Dimensions,
  NativeModules,
  StatusBar,
  Platform,
} from 'react-native';
import {storage} from '@/storage';
import store from '@/store';
import {remove_userdata} from '@/store/actions';

const {width, height} = Dimensions.get('window');
const fontScale = ReactNative.PixelRatio.getFontScale();
const pixelRatio = ReactNative.PixelRatio.get();
// 根据dp获取屏幕的px  设计稿为dp的时候可忽略
const screenPxW = ReactNative.PixelRatio.getPixelSizeForLayoutSize(width);
const screenPxH = ReactNative.PixelRatio.getPixelSizeForLayoutSize(height);
// 设计稿尺寸
const designWidth = 188; //dp
const designHeight = 334; //dp
// 颜色
export const Color = {
  primary: '#F4732D', //主题色 （橙色）
  downPrimary: '#F3CCB7', //主题色  （浅橙色）
  deepPrimary: '#FFF1EA', //主题色  （淡橙色）
  success: '#328D43', //成功色
  successTint: '#D6E8D9', //成功色 (浅色)
  warning: '#EEBB4F', //警告色
  danger: '#E2463D', //提示色  （红色）
  dangerTint: '#F9DAD8', //提示色  （红色）
  bgColor: '#F6F6F6', //背景色 灰色
  mainText: '#353535', //主要文字色（黑）
  infoText: '#686868', //次要文字色 （灰）
  minText: '#9B9B9B', //提示文字色 （淡灰）
  mainBorder: '#E5E2E2', //主要边框色
  minBorder: '#EBEBEB', //次要边框色
  downBorder: '#F9F9F9', //次要边框色
};
/**
 * 设置text
 * @param size  dp /(px)
 * @returns {Number} dp
 */
export function setSize(size) {
  var scale = Math.min(width / designWidth, height / designHeight);
  return Math.round(size * scale + 0.5);
  //------------------[px]--------------------//
  //   return Math.round((size * scale) / fontScale + 0.5); //fontsize
}
/**
 * 设置宽度
 * @param size  dp /(px)
 * @returns {Number} dp
 */
export function setW(size) {
  const scaleWidth = width / designWidth; //dp
  return Math.round(size * scaleWidth + 0.5); //dp
  //------------------[px]--------------------//
  //   const scaleWidth = size * screenPxW / designWidth;
  //   return Math.round((size * scaleWidth)/pixelRatio + 0.5);
}
/**
 * 设置高度
 * @param size  dp /(px)
 * @returns {Number} dp
 */
export function setH(size) {
  const scaleHeight = height / designHeight;
  return Math.round(size * scaleHeight + 0.5);
  //------------------[px]--------------------//
  //   const scaleHeight = size * screenPxH / designHeight;
  //   return Math.round((size * scaleHeight)/pixelRatio + 0.5);
}
// 需要清除的storage
export function cleanStorage() {
  /**
   * @param userdata //用户登录数据
   * @param scoreInfo //存储积分支出详情
   * @param userId-equipmentId-equipment // 缓存折线图数据 用户id-设备id-equipment
   *
   */
  store.dispatch(remove_userdata());
  storage.remove('userdata');
  storage.remove('scoreInfo');
}
// 获取屏幕状态栏的高度
export function getBarHeight() {
  if (Platform.OS === 'ios') {
    const {StatusBarManager} = NativeModules;
    // iOS Only
    StatusBarManager.getHeight(statusBarHeight => {
      return statusBarHeight;
    });
  } else {
    const statusBarHeight = StatusBar.currentHeight;
    return statusBarHeight;
  }
}
