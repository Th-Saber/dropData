import store from '@/store';
import toast from '@/utils/toastMsg';
import Nav from '@/navigators/NavigationService';
import {cleanStorage} from '@/utils/global.js';
import qs from 'qs';
import IP from './ip';
//拦截
export default function newFetch(url, obj, formdata) {
  let header = {
    'Content-Type': 'application/json',
  };
  // 设置请求头
  let userdata = store.getState().userdata;
  let params = {
    method: obj.type,
    headers: {
      'tkt-user': userdata.tkt,
      ...header,
    },
  };
  if (params.method == 'get') {
    delete params.body;
    let dataStr = ''; //数据拼接字符串
    obj.data &&
      Object.keys(obj.data).forEach(key => {
        dataStr += key + '=' + obj.data[key] + '&';
      });
    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
  } else {
    if (formdata === 'formdata') {
      params.body = qs.stringify(obj.data);
      params.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      params.body = JSON.stringify(obj.data);
      params.headers['Content-Type'] = 'application/json';
    }
  }
  return new Promise((resolve, reject) => {
    let timer = setTimeout(() => {
      toast.show('网络请求超时。。。');
    }, 10000);
    fetch(IP + url, params)
      .then(response => {
        response
          .clone()
          .json()
          .then(json => {
            timer && clearTimeout(timer);
            switch (json.code) {
              case 200:
                resolve(json);
                break;
              case 1001:
                cleanStorage();
                toast.show('登录失效，请重新登录');
                Nav.resetRouter('Login');
                reject(json);
                break;
              default:
                toast.show(json.msg);
                reject(json);
                break;
            }
          })
          .catch(error => {
            timer && clearTimeout(timer);
            toast.show('接收错误');
            reject(error);
          });
      })
      .catch(err => {
        timer && clearTimeout(timer);
        toast.show('请求错误');
        reject(err);
      });
  });
}
