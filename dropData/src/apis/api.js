import newFetch from './fetch.js';

//上传文件
export function uploadFile() {
  return newFetch('/aliyun/oss/policy', {
    type: 'get',
  });
}
//--------------登录------------------//
// 获取图形验证码
export function getImgCode(params) {
  return newFetch('/tool/images/captcha', {
    type: 'get',
    data: params,
  });
}
// 登录验证码
export function loginCode(params) {
  return newFetch('/tool/tel/code/lg', {
    type: 'get',
    data: params,
  });
}
//修改密码验证码
export function editCode(params) {
  return newFetch('/tool/tel/code/pw', {
    type: 'get',
    data: params,
  });
}
// 注册验证码
export function regCode(params) {
  return newFetch('/tool/tel/code/reg', {
    type: 'get',
    data: params,
  });
}

//-----------接口-----------//
// 登录
export function login(params) {
  return newFetch('/user/login', {
    type: 'get',
    data: params,
  });
}
// 注册
export function regist(params) {
  return newFetch('/user/login', {
    type: 'get',
    data: params,
  });
}
// 找回密码
export function findWePwd(params) {
  return newFetch(
    '/user/phone/update/pw.do',
    {
      type: 'post',
      data: params,
    },
    'formdata',
  );
}
// 获取首页基础数据
export function indexInfo() {
  return newFetch('/index/fetchInfo', {
    type: 'get',
  });
}
// 根据uid查找用户轨迹
export function indexInfoHistory(params) {
  return newFetch('/index/fetchHistoryRoute', {
    type: 'get',
    data: params,
  });
}
// 获取首页顶部轮播
export function findSlideImg() {
  return newFetch('/scrolling/fetchImage', {
    type: 'get',
  });
}
// 获取轮播消息数据
export function indexTipInfo() {
  return newFetch('/index/fetchTipsMessages', {
    type: 'get',
  });
}
// 获取健康数据列表
export function getHealthList() {
  return newFetch('/index/fetchHealthData', {
    type: 'get',
  });
}
// 获取健康数据详细数据
export function getHealthInfo(params) {
  return newFetch('/index/fetchMachineHealthData', {
    type: 'get',
    data: params,
  });
}
// 获取指数解读
export function getIndexInfo(params) {
  return newFetch('/index/fetchInterpret', {
    type: 'get',
    data: params,
  });
}
// 获取指数解读折线图数据
export function getInfoLine(params) {
  return newFetch('/index/fetchStatisticsHealthData', {
    type: 'get',
    data: params,
  });
}
// 获取用户关注列表
export function getFocusUserList(params) {
  return newFetch('/community/pageUserFollow', {
    type: 'get',
    data: params,
  });
}
// 获取用户粉丝列表
export function getFansUserList(params) {
  return newFetch('/community/pageFollowUser', {
    type: 'get',
    data: params,
  });
}
// 获取人员设备列表
export function getEquipmentList(params) {
  return newFetch(`/user/fetch/family/members/page`, {
    type: 'get',
    data: params,
  });
}
// 发送已有账户验证码
export function findUserCode(params) {
  return newFetch(`/user/sendMsg`, {
    type: 'get',
    data: params,
  });
}
// 添加已有家庭成员
export function addRefUser(params) {
  return newFetch(
    `/user/addRefUser`,
    {
      type: 'post',
      data: params,
    },
    'formdata',
  );
}
// 通过密码添加已有家庭成员
export function addUserForPass(params) {
  return newFetch(
    `/user/addRefUserByPass`,
    {
      type: 'post',
      data: params,
    },
    'formdata',
  );
}
// 添加未注册家庭用户
export function addUserIs(params) {
  return newFetch(`/user/addUser?code=1933`, {
    type: 'post',
    data: params,
  });
}
// 添加人员绑定设备
export function addMachine(params) {
  return newFetch(
    `/user/bind/machine`,
    {
      type: 'post',
      data: params,
    },
    'formdata',
  );
}
// 地址分页管理
export function getAddressPage(params) {
  return newFetch(`/receiveAddress/fetchPage`, {
    type: 'get',
    data: params,
  });
}
// 添加地址
export function addAddress(params) {
  return newFetch(`/receiveAddress/fetchPage`, {
    type: 'get',
    data: params,
  });
}
// 编辑地址
export function editAddress(params) {
  return newFetch(`/receiveAddress/save`, {
    type: 'post',
    data: params,
  });
}
// 删除地址
export function delAddress(params) {
  return newFetch(
    `/receiveAddress/delete`,
    {
      type: 'post',
      data: params,
    },
    'formdata',
  );
}
// 积分详情
export function scoreInfoData(params) {
  return newFetch(`/user/integral/record/page`, {
    type: 'get',
    data: params,
  });
}
// 获取用户列表
export function listUser(params) {
  return newFetch(`/enterpris/page`, {
    type: 'get',
    data: params,
  });
}
// 获取日报列表
export function dailyList(params) {
  return newFetch(`/user/fetch/abnormal/info`, {
    type: 'get',
    data: params,
  });
}
// 更新用户个人资料
export function updateUserInfo(params) {
  return newFetch(`/user/update.do`, {
    type: 'post',
    data: params,
  });
}
// 获取紧急联系人列表
export function getContact() {
  return newFetch(`/user/fetch/emergency/contact`, {
    type: 'get',
  });
}
// 添加紧急联系人
export function addContact(params) {
  return newFetch(`/user/save/emergency/contact`, {
    type: 'post',
    data: params,
  });
}
// 删除紧急联系人
export function delContact(params) {
  return newFetch(
    `/user/delete/emergency/contact`,
    {
      type: 'post',
      data: params,
    },
    'formdata',
  );
}
// 修改密码
export function editPass(params) {
  return newFetch(
    `/user/update/pw.do`,
    {
      type: 'post',
      data: params,
    },
    'formdata',
  );
}
// 获取产品演示视频
export function getVidioDom(params) {
  return newFetch(`/machine/fetchIntroduceById`, {
    type: 'get',
    data: params,
  });
}
// 产品分页
export function getProduct(params) {
  return newFetch(`/product/fetch/page`, {
    type: 'get',
    data: params,
  });
}

//----------------社区--------------------//
// 获取社区分页推荐消息
export function getCommunity(params) {
  let {page, size, data} = params;
  return newFetch(`/community/page?page=${page}&size=${size}`, {
    type: 'post',
    data,
  });
}
// 获取社区分页关注消息
export function getFocus(params) {
  let {page, size} = params;
  return newFetch(`/community/pageFollow?page=${page}&size=${size}`, {
    type: 'post',
  });
}
// 根据用户id查询详细信息
export function getFocusUserInfo(params) {
  return newFetch(`/community/pageCommunityByUser`, {
    type: 'get',
    data: params,
  });
}
// 根据用户id查询动态分页
export function getNewsInfoTwo(params) {
  return newFetch(`/community/pageCommunityNextByUser`, {
    type: 'get',
    data: params,
  });
}
// 点赞
export function likeNewsZan(params) {
  return newFetch(
    `/community/zan`,
    {
      type: 'post',
      data: params,
    },
    'formdata',
  );
}
// 添加关注
export function focusTA(params) {
  return newFetch(
    `/user/follow/addFollow`,
    {
      type: 'post',
      data: params,
    },
    'formdata',
  );
}
// 取消关注
export function unFocusTA(params) {
  return newFetch(
    `/user/follow/unFollow`,
    {
      type: 'post',
      data: params,
    },
    'formdata',
  );
}
// 发布动态
export function releaseNews(params) {
  return newFetch(`/community/add`, {
    type: 'post',
    data: params,
  });
}
// 删除动态
export function delNews(params) {
  return newFetch(
    `/community/delete/community`,
    {
      type: 'post',
      data: params,
    },
    'formdata',
  );
}
//--------------------聊天--------------------------//
//获取聊天列表
export function getMsgList() {
  return newFetch(`/chat/fetchTimelyMsg`, {
    type: 'get',
  });
}
//发送聊天
export function sendMsg(params) {
  return newFetch(`/chat/sendMsg`, {
    type: 'post',
    data: params,
  });
}
//获取专家id和名字
export function getExpertsInfo() {
  return newFetch(`/chat/fetchSpecialist`, {
    type: 'get',
  });
}
//获取机器人对答
export function getRobot() {
  return newFetch(`/consult/list`, {
    type: 'get',
  });
}
//分页获取评论
export function getComments(params) {
  return newFetch(`/community/pageComment`, {
    type: 'get',
    data: params,
  });
}
//发送评论
export function sendComments(params) {
  return newFetch(`/community/addComment`, {
    type: 'post',
    data: params,
  });
}
//删除评论
export function delComments(params) {
  return newFetch(
    `/community/delete/comment`,
    {
      type: 'post',
      data: params,
    },
    'formdata',
  );
}

//-------------------供方平台------------------------//
// 获取webview内容
export function getWebContent(params) {
  return newFetch(`/feedback/fetchCmsContent`, {
    type: 'get',
    data: params,
  });
}
// 发送意见反馈
export function sendfeedMsg(params) {
  return newFetch(`/feedback/add`, {
    type: 'get',
    data: params,
  });
}
