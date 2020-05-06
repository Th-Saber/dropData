/**
 * Created by guangqiang on 2017/11/15.
 */
// import {storage} from './index'
/**
 * sync方法的名字必须和所存数据的key完全相同
 * 方法接受的参数为一整个object，所有参数从object中解构取出
 * 这里可以使用promise。或是使用普通回调函数，但需要调用resolve或reject
 * @type {{user: ((params))}}
 */
const sync = {
  //异步获取朋友节点
  // friendList(params) {
  //   let { id, resolve, reject, syncParams: { extraFetchOptions, someFlag } } = params
  //   storage.load("token",async (token)=>{
  //     try {
  //       let res = await getTelList(token)
  //       console.log('这个数据',res.data)
  //       if(resd.code==200){
  //         storage.save('user',res.data)
  //         resolve && resolve(res.data)
  //       }else{
  //         reject && reject('网络出错')
  //       }
  //     } catch (error) {
  //       reject && reject(error)
  //     }
  //   })
  // }
};

export { sync };
