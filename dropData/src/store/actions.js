//储存userdata
export function save_userdata(data) {
  return {
    type: 'save_userdata',
    data,
  };
}
//移除userdata
export function remove_userdata(data) {
  return {
    type: 'remove_userdata',
    data,
  };
}
// ==============消息相关-----------///
// 添加消息列表
export function save_msgList(data) {
  return {
    type: 'save_msgList',
    data,
  };
}
//发送消息
export function send_msg(data) {
  return {
    type: 'send_msg',
    data,
  };
}
//未读消息 小红点
export function change_num(data) {
  return {
    type: 'change_num',
    data,
  };
}
// 保存uid
export function save_uid(data) {
  return {
    type: 'save_uid',
    data,
  };
}
// 删除uid
export function del_uid() {
  return {
    type: 'del_uid',
  };
}
