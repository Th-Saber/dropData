import {combineReducers} from 'redux';
//userdata
function userdata(state = {}, actions) {
  switch (actions.type) {
    case 'save_userdata':
      return actions.data;
    case 'remove_userdata':
      return {};
    default:
      return state;
  }
}
// 未读消息 小红点
function msgNum(
  state = {
    num: 0,
    uid: 0,
  },
  actions,
) {
  switch (actions.type) {
    case 'change_num':
      return Object.assign({}, state, {
        num: state.num + actions.data,
      });
    case 'save_uid':
      state.uid = actions.data;
      return state;
    case 'del_uid':
      state.uid = 0;
      return state;
    default:
      return state;
  }
}
// 聊天数据
function MsgList(state = [], actions) {
  switch (actions.type) {
    case 'save_msgList':
      return actions.data;
    case 'send_msg':
      let {user, msg} = actions.data;
      for (const v of state) {
        if (v.userId === user.saveId) {
          v.messages = [...v.messages, msg];
          return state;
        }
      }
      let params = {
        username: user.username,
        avator: user.avator,
        messages: [msg],
        userId: user.saveId,
        unread: 0,
      };
      return [...state, params];
    default:
      return state;
  }
}

export default combineReducers({
  // key当前状态的状态名：value此状态对应的计算者
  userdata, //测试
  MsgList,
  msgNum,
});
