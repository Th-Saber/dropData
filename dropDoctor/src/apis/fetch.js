import store from '@/store';
import {toast} from '@/components/Toast';
import {Nav} from '@/navigators';
import {cleanStorage} from '@/utils/global.js';
import qs from 'qs';
import IP from './ip';
//拦截
export default function newFetch(url, obj, formdata) {
  // 设置请求头
  let userdata = store.getState().userdata;
  let params = {
    method: obj.type,
    headers: {
      tkt: userdata.tkt,
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
    } else if (formdata === 'file') {
      params.body = obj.data;
    } else {
      params.body = JSON.stringify(obj.data);
      params.headers['Content-Type'] = 'application/json';
    }
  }
  return new Promise((resolve, reject) => {
    let timer = setTimeout(() => {
      toast.close();
      toast.show('网络请求超时。。。');
    }, 20000);
    fetch(IP + url, params)
      .then(response => {
        response
          .clone()
          .json()
          .then(json => {
            timer && clearTimeout(timer);
            toast.close();
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
              case 500:
                toast.show('code:500');
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
            toast.close();
            toast.show('接收错误');
            reject(error);
          });
      })
      .catch(err => {
        timer && clearTimeout(timer);
        toast.close();
        toast.show('请求错误');
        reject(err);
      });
  });
}
