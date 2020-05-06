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
//当前选中店铺信息
function userInfo(state = {}, actions) {
  switch (actions.type) {
    case 'save_store':
      return actions.data;
    case 'remove_store':
      return {};
    default:
      return state;
  }
}

export default combineReducers({
  // key当前状态的状态名：value此状态对应的计算者
  userdata, //用户名
  userInfo,
});
