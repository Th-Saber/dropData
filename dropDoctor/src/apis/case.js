/**
 * @package 引流案例相关接口
 */
import newFetch from './fetch.js';

// 找回密码
/**
 * @param {*}  post传参formdata数据格式 需加入第三个参数 'formdata',
 */
//查询案例类别
export function getCaseClass() {
  return newFetch('drainage/find/all/classes', {
    type: 'get',
  });
}
