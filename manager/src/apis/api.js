import axios from "axios"
import qs from "qs";

//开发IP
// const IP = "/dev"
// 测试IP
const IP = "/test"
//正式IP地址  上线用的接口地址
// const IP = "http://47.110.145.22/drop/restful";
//暴露公用IP
export default IP;
/**
 * @param {get} (url,{params:{参数a,参数b}})
 * @param {post} (url,params:{参数a,参数b})  注：post参数如果要求formdata格式  需要用qs.stringify(params)转换一下
 */
// 登录
export function login(params) {
  return axios.get(IP + "/user/pc/login", {
    params
  });
}
// 获取图像验证码
export function getImgCode(params) {
  return axios.get(IP + "/tool/images/captcha", {
    params: {
      currentTimes: params
    }
  });
}
// 获取短信验证码
export function getMsgLoginCode(params) {
  return axios.get(IP + "/tool/tel/code/lg", {
    params: {
      tel: params.tel,
      currentTimes: params.currentTimes,
      captcha: params.captcha
    }
  });
}
// 验证码登录
export function msgLogin(params) {
  return axios.get(IP + "/user/login", {
    params
  });
}

//-------------------- 点位展示 -------------------------
// 首页
export function getIndex() {
  return axios.get(IP + "/index/fetchInfo");
}
//-------------------- 轨迹展示 -------------------------
// 轨迹
export function historyRoute(id, time) {
  return axios.get(IP + "/index/fetchHistoryRoute", {
    params: {
      userId: id,
      time: time
    }
  });
}
//-------------------- 基本信息 -------------------------
//用户信息列表并排序
export function infoType(current, size, type) {
  return axios.get(IP + '/enterpris/page', {
    params: {
      current,
      size,
      type
    }
  })
}



// 根据id获取单个用户信息
export function getUserInfo(uid) {
  return axios.get(IP + '/enterpris/fetchUserInfoById', {
    params: {
      uid
    }
  })
}
//-------------------- 健康信息 -------------------------
export function healthInfo(uid, machineType, queryHistorys) {

  return axios.get(IP + '/enterpris/fetchUserMachineData', {
    params: {
      uid,
      machineType,
      queryHistorys,
    }
  })
}



//-------------------- 健康信息 -------------------------
export function fetchTimingStatistics(searchDate) {

  return axios.get(IP + '/enterpris/fetchTimingStatistics', {
    params: {
      searchDate,
    }
  })
}
export function fetchTimingSegmentInfosByUser(searchDate, uid) {

  return axios.get(IP + '/enterpris/fetchTimingSegmentInfosByUser', {
    params: {
      searchDate,
      uid
    }
  })
}
export function fetchTimingInfosByUser(searchDate, uid) {

  return axios.get(IP + '/enterpris/fetchTimingInfosByUser', {
    params: {
      searchDate:'2019-11-20',
      uid
    }
  })
}
export function fetchTimingInfosBySegmentId(segmentId, limit, uid) {

  return axios.get(IP + '/enterpris/fetchTimingInfosBySegmentId', {
    params: {
      segmentId,
      limit,
      uid
    }
  })
}