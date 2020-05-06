import newFetch from './fetch.js';

//上传文件
export function uploadFile() {
  return newFetch('aliyun/oss/policy', {
    type: 'get',
  });
}
//上传图片
export function uploadImg(params) {
  return newFetch(
    'file/upload/image',
    {
      type: 'post',
      data: params,
    },
    'file',
  );
}
