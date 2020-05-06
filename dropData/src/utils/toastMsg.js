import {Keyboard} from 'react-native';
const {DURATION} = require('react-native-easy-toast');
let _toast;
export function setToast(toast) {
  _toast = toast;
}
export default {
  show: (msg, num = 1000, callback) => {
    Keyboard.dismiss();
    _toast.show(msg, num === 0 ? DURATION.FOREVER : num, callback);
  },
  close: () => {
    _toast.close();
  },
};
