// 仿抖
export function debounce(fn, delay) {
  let handle;
  return () => {
    // 取消之前的延时调用
    clearTimeout(handle);
    handle = setTimeout(() => {
      fn();
    }, delay);
  };
}
// 判断数据类型
/**
 *
 * @param {*} change //传入的数据
 * @returns {String} //返回的数据类型
 */

export function judgeType(change) {
  if (arguments.length == 0) {
    return '0'; //无参数传入
  }
  if (change === null) {
    return 'null';
  }
  if (change === undefined && arguments.length > 0) {
    return 'undefined';
  }
  if (change instanceof Function) {
    return 'function';
  }
  if (change instanceof Array) {
    return 'array';
  }
  if (change instanceof Number || typeof change == 'number') {
    return 'number';
  }
  if (change instanceof String || typeof change == 'string') {
    return 'string';
  }
  if (change instanceof Boolean || typeof change == 'boolean') {
    return 'boolean';
  }
}

/**
 * @param {String} 判断是否为网络图片  加上私有地址
 *
 */
export function showImgUrl(url) {
  if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
    return url;
  } else {
    return global.imgUrl + url;
  }
}
/**
 * @param {Number} 过滤
 *
 */
export function filterNum(num) {
  let str = typeof num == 'string' ? num : num.toString();
  if (num >= 100 * 10) {
    return `${str.slice(0, 1)}k+`;
  } else if (num >= 100 * 100) {
    return `${str.slice(0, 1)}w+`;
  } else if (num >= 100 * 1000) {
    return `${str.slice(0, 2)}w+`;
  } else if (num >= 100 * 1000 * 10) {
    return `${str.slice(0, 3)}w+`;
  } else if (num >= 100 * 1000 * 100) {
    return `${str.slice(0, 4)}w+`;
  } else if (num >= 100 * 1000 * 1000) {
    return '9999w+';
  } else {
    return num;
  }
}
