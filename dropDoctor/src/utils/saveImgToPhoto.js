import {Platform} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import RNFS from 'react-native-fs';
/**
 2  * 下载网页图片
 3  * @param uri  图片地址
 4  * @returns {*}
 5  */
export const DownloadImage = uri => {
  if (!uri) return null;
  return new Promise((resolve, reject) => {
    let timestamp = new Date().getTime(); //获取当前时间错
    let random = String((Math.random() * 1000000) | 0); //六位随机数
    let dirs =
      Platform.OS === 'ios'
        ? RNFS.LibraryDirectoryPath
        : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
    const downloadDest = `${dirs}/${timestamp + random}.jpg`;
    const formUrl = uri;
    const options = {
      fromUrl: formUrl,
      toFile: downloadDest,
      background: true,
      begin: res => {
        // console.log('begin', res);
        // console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
      },
    };
    try {
      const ret = RNFS.downloadFile(options);
      ret.promise
        .then(res => {
          // console.log('success', res);
          // console.log('file://' + downloadDest)
          var promise = CameraRoll.saveToCameraRoll(downloadDest);
          promise
            .then(function(result) {
              // alert('保存成功！地址如下：\n' + result);
              resolve(result);
            })
            .catch(function(error) {
              reject(error);
              // alert('保存失败！\n' + error);
            });
        })
        .catch(err => {
          reject(new Error(err));
        });
    } catch (e) {
      reject(new Error(e));
    }
  });
};
/**
2  * 保存图片到相册
3  * @param ImageUrl  图片地址
4  * @returns {*}
5  */
export const DownloadLocalImage = ImageUrl => {
  if (!ImageUrl) return null;
  return new Promise((resolve, reject) => {
    try {
      var promise = CameraRoll.saveToCameraRoll(ImageUrl);
      promise
        .then(function(result) {
          resolve({statusCode: 200});
          //alert('保存成功！地址如下：\n' + result);
        })
        .catch(function(error) {
          console.log('error', error);
          // alert('保存失败！\n' + error);
        });
    } catch (e) {
      reject(new Error(e));
    }
  });
};
