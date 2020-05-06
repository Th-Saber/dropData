export function scoreType(val) {
  //根据分数判断是否健康
  switch (true) {
    case val >= 90:
      return {
        name: '极好',
        color: '#55B569',
      };
    case val >= 70:
      return {
        name: '健康',
        color: '#38A9FC',
      };
    case val >= 50:
      return {
        name: '一般',
        color: '#EEBB4F',
      };
    case val >= 0:
      return {
        name: '较差',
        color: '#E2463D',
      };
    default:
      return {
        name: '无检测',
        color: '#ccc',
      };
  }
}
// 仿抖
export function debounce(fn, delay) {
  let handle;
  return function(e) {
    // 取消之前的延时调用
    clearTimeout(handle);
    handle = setTimeout(() => {
      fn(e);
    }, delay);
  };
}
