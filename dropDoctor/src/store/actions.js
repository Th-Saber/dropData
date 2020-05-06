//储存userdata
export function save_userdata(data) {
  return {
    type: 'save_userdata',
    data,
  };
}
//移除userdata
export function remove_userdata() {
  return {
    type: 'remove_userdata',
  };
}
// ------------选中店铺------------//
//设置选中的店铺
export function save_store(data) {
  return {
    type: 'save_store',
    data,
  };
}
//移除选中的店铺
export function remove_store() {
  return {
    type: 'remove_store',
  };
}
// ------------金额------------//
//设置首页数据
export function save_index(data) {
  return {
    type: 'save_index',
    data,
  };
}
//删除首页数据
export function remove_index() {
  return {
    type: 'remove_index',
  };
}
