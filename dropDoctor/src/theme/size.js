import {Dimensions, PixelRatio} from 'react-native';

const {width, height} = Dimensions.get('window');
const fontScale = PixelRatio.getFontScale();
const pixelRatio = PixelRatio.get();
// 根据dp获取屏幕的px  设计稿为dp的时候可忽略
const screenPxW = PixelRatio.getPixelSizeForLayoutSize(width);
const screenPxH = PixelRatio.getPixelSizeForLayoutSize(height);
// 设计稿尺寸
const designWidth = 750; //px
const designHeight = 1334; //px
// 颜色
/**
 * 设置text
 * @param size  px
 * @returns {Number} dp
 */
function setSize(size) {
  var scale = Math.min(width / designWidth, height / designHeight);
  return Math.round((size * scale) / fontScale + 0.5); //fontsize
}
/**
 * 设置宽度
 * @param size  px
 * @returns {Number} dp
 */
function setW(size) {
  const scaleWidth = (size * screenPxW) / designWidth;
  return Math.round((size * scaleWidth) / pixelRatio + 0.5);
}
/**
 * 设置高度
 * @param size  px
 * @returns {Number} dp
 */
function setH(size) {
  const scaleHeight = (size * screenPxH) / designHeight;
  return Math.round((size * scaleHeight) / pixelRatio + 0.5);
}
export default {
  setSize,
  setW,
  setH,
};
