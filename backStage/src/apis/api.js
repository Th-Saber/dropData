import axios from "axios"
import qs from "qs";

//开发IP
// const  IP= "/dev"
// 测试IP
const IP = "/test"
//正式IP地址  上线用的接口地址
// const IP = "http://47.110.145.22/drop/admin";
//暴露公用IP
export default IP;
/**
 * @param {get} (url,{params:{参数a,参数b}})
 * @param {post} (url,params:{参数a,参数b})  注：post参数如果要求formdata格式  需要用qs.stringify(params)转换一下
 */

export function policy() {
    return axios.get(IP + '/aliyun/oss/policy')
}
//=================登录页 ===========//
// 登录
export function login(params) {
    return axios.get(IP + "/back/login", {
        params
    });
}
// 获取图像验证码
export function getImgCode(params) {
    return axios.get(IP + "/back/images/captcha", {
        params: {
            currentTimes: params
        }
    });
}
// // 获取短信验证码
// export function getMsgLoginCode(params) {
//   console.log(params.captcha)
//   return axios.get(IP + "/tool/tel/code/lg", {
//     params: {
//       tel: params.tel,
//       currentTimes: params.currentTimes,
//       captcha: params.captcha
//     }
//   });
// }
// // 验证码登录
// export function msgLogin(params) {
//   console.log(params)
//   return axios.get(IP + "/user/login", {
//     params
//   });
// }



//=================首页 ===========//

// 获取首页统计信息（饼图，右侧列表）
export function getHome() {
    return axios.get(IP + "/back/home/find/count");
}

// 获取首页折线图信息
export function getHomeLine(date, phName) {
    return axios.get(IP + "/back/home/fetch/trend/line/data", {
        params: {
            date,
            phName
        }
    });
}

//获取各省数据
export function getProvinceData(province) {
    return axios.get(IP + "/back/home/fetch/city", {
        params: {
            province
        }
    });
}

//=================系统设置------>规则设置设置 ----->称呼管理 ===========//
// 称呼配置分页
export function getNamedPage(jumppage) {
    return axios.get(IP + "/physical/page", {
        params: {
            page: jumppage.current,
            size: jumppage.size
        }
    });
}
//称呼配置修改
export function editNamed(params) {

    return axios.post(IP + "/physical/save",

        params
    );
}

//=================系统设置------>规则设置设置 ----->指数解读管理 ===========//
export function stateList() {
    return axios.get(IP + "/physical/state/list");
}
export function stateSave(item) {
    return axios.post(IP + "/physical/state/save", item);
}





//=================用户管理------>用户资料 ===========//
// 获取分页用户信息
export function homeUserInfo(page, size, username, wasSuper) {
    return axios.get(IP + "/user/manager/search/master/info/page", {
        params: {
            page,
            size,
            username,
            wasSuper
        }
    });
}
// 检索是否有子用户
export function checkChildren(masterId) {
    return axios.get(IP + "/user/manager/search/member/info", {
        params: {
            masterId
        }
    });
}
//设置超级用户
export function superUser(uid, state) {
    return axios.post(IP + "/user/manager/setting/super/user", qs.stringify({
        uid,
        state
    }), {
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'

        }
    });
}
//删除用户
export function deleteUser(uid) {
    return axios.post(IP + "/user/manager/delete/user", qs.stringify({
        uid
    }), {
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        }
    });
}




//=================用户管理------>健康信息 ===========//
// 用户健康信息分页
export function memberInfoPpage(page, size, machineType, username) {
    return axios.get(IP + "/user/manager/fetch/member/info/page", {
        params: {
            page,
            size,
            machineType,
            username
        }
    });
}
// 具体用户健康数据
export function memberHealthInfo(uid, machineType) {
    return axios.get(IP + "/user/manager/fetch/member/health/info", {
        params: {
            uid,
            machineType
        }
    });
}


//=================轮播图管理===========//
// 获取轮播列表
export function imgFetchPage() {
    return axios.get(IP + "/img/fetchPage");
}
// 删除图片
export function deleteImg(id) {
    return axios.post(IP + "/img/delete", qs.stringify({
        id
    }), {
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        }
    });
}
// 添加修改
export function imgSave(obj) {
    return axios.post(IP + "/img/save", obj);
}

//================反馈管理===========//

//查询反馈全部
export function feedbackFindAll(params) {
    return axios.get(IP + "/feedback/find/all", {
        params
    });
}

// 查询标记
export function feedbackSign(params) {
    return axios.get(IP + "/feedback/tag", {
        params
    });
}

// 删除
export function delFeedback(params) {
    return axios.get(IP + "/feedback/del", {
        params
    });
}




//================角色管理===========//

//查询角色
export function roleFindAll(params) {
    return axios.get(IP + "/back/find/all/page", {
        params
    });
}

// 筛选人数
export function screeningRole() {
    return axios.get(IP + "back/find/statistics");
}

//新增角色
export function addRole(params) {

    return axios.post(IP + "/back/save", params);
}

// 修改角色 
export function updateRole(params) {

    return axios.post(IP + "/back/update", params);
}

// 删除员工
export function delRole(params) {
    return axios.get(IP + "/back/del", {
        params
    });
}

// 冻结员工
export function freezeRole(params) {
    return axios.get(IP + "/back/freeze", {
        params
    });
}

// 恢复员工

export function restoreRole(params) {
    return axios.get(IP + "/back/normal", {
        params
    });
}
//================消息管理===========//
export function questionList(machineType) {
    return axios.get(IP + "/question/fetchSpecialistMessage", {
        params: {
            machineType
        }
    });
}
// 根据id查找用户数据
export function fetchUserInfoById(machineType, uid) {
    return axios.get(IP + "/question/fetchUserInfoById", {
        params: {
            machineType,
            uid
        }
    });
}
// 设置备注
export function settingExpertRemarks(uid, expertRemarks) {
    return axios.post(IP + "/question/settingExpertRemarks", qs.stringify({
        uid,
        expertRemarks
    }), {
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        }
    });
}
// 标记
export function settingUserPoint(uid, state) {
    return axios.post(IP + "/question/settingUserPoint", qs.stringify({
        uid,
        state
    }), {
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        }
    });
}
// 标记
export function sendMsg(receiveId, message, type, receiveType) {
    return axios.post(IP + "/question/sendMsg", {
        receiveId,
        message,
        type,
        receiveType
    });
}
// 根据id查找用户数据
export function searchUserPage(name, current, size) {
    return axios.get(IP + "/question/searchUserPage", {
        params: {
            name,
            current,
            size
        }
    });
}
// 根据id查找用户历史消息
export function questionFetchMessageRecord(uid, lastTime, page, size) {
    return axios.get(IP + "/question/fetchMessageRecord", {
        params: {
            uid,
            lastTime,
            page,
            size
        }
    });
}



// ========================内容管理===================//
export function contentSave(content, id) {
    return axios.post(IP + "/content/save", qs.stringify({
        content,
        id
    }), {
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        }
    });
}
export function contentFetchList() {
    return axios.get(IP + "/content/fetchList");
}



// ==================自动回复 ============//
export function autoQuestionList() {
    return axios.get(IP + "/question/list");
}
export function autoQuestionSave(obj) {
    return axios.post(IP + "/question/save", obj);
}
export function autoQuestionDelete(id) {
    return axios.post(IP + "/question/delete", qs.stringify({
        id
    }), {
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        }
    });
}

// ===========设备管理=============//
export function machineFetchMachineType() {
    return axios.get(IP + "/machine/fetchMachineType");
}
export function saveMachineType(obj) {
    return axios.post(IP + "/machine/save/machineType", obj);
}
export function fetchMachineTypeById(id) {
    return axios.get(IP + "/machine/fetchMachineTypeById", {
        params: {
            id
        }
    });
}

export function deleteMachineType(id) {
    return axios.post(IP + "machine/delete/machineType", qs.stringify({
        id
    }), {
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        }
    });
}
//-----------设备列表
export function machinePageMachine(page, size) {
    return axios.get(IP + "/machine/pageMachine", {
        params: {
            page,
            size
        }
    });
}

//---------设备厂商
export function machinePageManufacture(page, size) {
    return axios.get(IP + "/machine/pageManufacture", {
        params: {
            page,
            size
        }
    });
}
// 保存厂商
export function saveManufacturer(obj) {
    return axios.post(IP + "/machine/save/manufacturer", obj);
}
// 删除厂商
export function deleteManufacturere(id) {
    return axios.post(IP + "/machine/delete/manufacturer", qs.stringify({
        id
    }), {
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        }
    });
}

export function uploadCvsMachine(file) {

    return axios.post(IP + "/machine/uploadCvsMachine",
        file, {
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        });
}
export function saveMachine(obj) {
    return axios.post(IP + "/machine/save/machine", obj);
}
export function machineDeleteMachine(id) {
    return axios.post(IP + "/machine/deleteMachine", qs.stringify({
        id
    }), {
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        }
    });
}