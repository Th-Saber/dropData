import ReactNative, {StatusBar, Platform} from 'react-native';
import {storage} from '@/storage';
import store from '@/store';
import {remove_userdata} from '@/store/actions';

export const Color = {
  //------------主题色------------//
  primary: '#ef314b', //主题色
  success: '#328D43', //成功色
  warning: '#EEBB4F', //警告色
  danger: '#E2463D', //提示色
  disClr: '#e3e3e3', //禁用背景色
  orange: '#F08531', //活动橘色
  //------------辅助色------------//
  auxClr1: '#f9ab40', //辅助色1
  auxClr2: '#629df8', //辅助色2
  auxClr3: '#7b94fb', //辅助色3
  auxClr4: '#fe8585', //辅助色4
  auxClr5: '#FFE8EE', //辅助色5
  //------------背景色------------//
  BbgClr: '#f1f1f1', //前背景色
  AbgClr: '#f5f5f5', //后背景色
  //------------投影------------//
  shadowClr: 'rgba(0,0,0,.1)', //投影色
  //------------文字------------//
  titleText: '#333', //标题文字颜色
  mainText: '#666', //主要文字色（黑）
  infoText: '#999', //次要文字色 （灰）
  minText: '#ccc', //提示文字色 （淡灰）
  mainBorder: '#eee', //主要边框色
  minBorder: '#b8b8b8', //次要边框色
  //------------按钮颜色------------//
  btnBgClr: '#FDE7E9',
  //------------其它色彩------------//
  aliClr: '#00A1E9', //支付宝
  wxClr: '#41AE34', //微信
  goldenClr: '#FFCC00', //金色
};

// 需要清除的storage
export function cleanStorage() {
  /**
   * @param userdata //用户登录数据
   * @param storeList //店铺列表
   *
   */
  store.dispatch(remove_userdata());
  storage.remove('userdata');
  storage.remove('storeList');
}
// 获取屏幕状态栏的高度
export function getBarHeight() {
  const X_WIDTH = 375;
  const X_HEIGHT = 812;
  const XSMAX_WIDTH = 414;
  const XSMAX_HEIGHT = 896;
  let isIPhoneX = false;
  if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
    isIPhoneX =
      (W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) ||
      (W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT);
  }
  return Platform.select({
    ios: isIPhoneX ? 44 : 20,
    android: StatusBar.currentHeight,
    default: 0,
  });
}
