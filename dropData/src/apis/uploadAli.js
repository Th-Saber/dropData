import {uploadFile} from './api';
import store from '@/store';
const url = 'http://duai-maney-images.oss-cn-beijing.aliyuncs.com';
export function uploadImg(imgUrl) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await uploadFile();
      let time = Date.parse(new Date());
      let filename = imgUrl.substring(imgUrl.lastIndexOf('.'), imgUrl.length); //后缀名
      let wename = `${store.getState().userdata.userId}_` + time + filename; //自定义文件名
      let file = {uri: imgUrl, type: 'multipart/form-data', name: wename};
      let formData = new FormData();
      let reslutUrl = res.data.dir + '/' + wename;
      formData.append('policy', res.data.policy);
      formData.append('signature', res.data.signature);
      formData.append('ossaccessKeyId', res.data.accessKeyId);
      // formData.append('key', res.data.dir + '/${fileName}');
      formData.append('key', reslutUrl);
      formData.append('dir', res.data.dir);
      formData.append('host', res.data.host);
      formData.append('file', file);
      //   return;
      aliUpload(
        formData,
        success => {
          //   console.log('陈工', success.url + reslutUrl);
          resolve(success.url + reslutUrl);
        },
        error => {
          // console.log('错误回调', error);
          reject(error);
        },
      );
    } catch (error) {
      console.log('错误', error);
    }
  });
}
function aliUpload(formData, successCallback, fileCallback) {
  let params = {
    method: 'post',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  fetch(url, params)
    .then(response => {
      successCallback && successCallback(response);
    })
    .catch(err => {
      fileCallback && fileCallback(err);
    });
}
