import {getMsgList} from './api';
import {storage} from '@/storage';
import store from '@/store'; //引入redux
import {save_msgList, send_msg, change_num} from '@/store/actions'; //引入redux
global.timer = '';
var message = {
  // 默认数据  评论 赞
  defaultData: [
    {
      username: '评论',
      messages: [],
      avator: require('@/assets/imgs/pinglun.png'),
      userId: -1,
      unread: 0,
    },
    {
      username: '赞',
      messages: [],
      avator: require('@/assets/imgs/xin.png'),
      userId: -2,
      unread: 0,
    },
  ],
  open: function() {
    this.close(); //先判断是否有个定时器了
    let userId = store.getState().userdata.userId;
    storage.load(userId + '-MsgList', result => {
      if (result != undefined) {
        let unread = 0;
        result.forEach(v => {
          unread += v.unread;
        });
        store.dispatch(change_num(unread));
        store.dispatch(save_msgList(result));
      } else {
        store.dispatch(save_msgList(this.defaultData));
        storage.save(userId + '-MsgList', this.defaultData);
      }
      //   可能出现重复系统消息
      this.request();
      global.timer = setInterval(this.request.bind(this), 1000 * 15);
    });
  },
  close: function() {
    global.timer && clearInterval(global.timer);
  },
  //   轮询
  request: function(callback) {
    let that = this;
    let msgNum = store.getState().msgNum;
    getMsgList().then(res => {
      callback && callback(true);
      if (res.data) {
        console.log('请求', res.data);
        let num = 0;
        let deData = JSON.parse(JSON.stringify(that.defaultData));
        let arr = [];
        res.data.forEach(v => {
          let unread = v.messages.length;
          let len = v.messages.length;
          if (v.userId === -3) {
            v.avator = require('@/assets/icon/icon_doctor.png');
          }
          while (len--) {
            let {sendId} = v.messages[len];
            if (sendId === -1) {
              deData[0].messages.push({
                ...v.messages[len],
                isread: false,
              });
              deData[0].unread++;
              v.messages.splice(len, 1);
            } else if (sendId === -2) {
              deData[1].messages.push({
                ...v.messages[len],
                isread: false,
              });
              deData[1].unread++;
              v.messages.splice(len, 1);
            }
          }
          if (v.userId !== msgNum.uid) {
            num += unread;
          } else {
            unread = 0;
          }
          //  因为如果是系统消息要删除  删除后数组可能为空
          if (v.messages.length > 0) {
            arr.push({...v, unread: v.messages.length});
          }
        });
        let len = deData.length;
        while (len--) {
          if (deData[len].unread === 0) {
            deData.splice(len, 1);
          }
        }
        store.dispatch(change_num(num));
        that.filtersData(deData.concat(arr));
      }
    });
  },
  //   过滤数据
  filtersData: function(data) {
    let userId = store.getState().userdata.userId;
    storage.load(userId + '-MsgList', result => {
      if (result !== undefined) {
        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (result[i].userId === data[j].userId) {
              result[i] = Object.assign({}, data[j], {
                messages: result[i].messages.concat(data[j].messages),
                unread: result[i].unread + data[j].unread,
              });
              data.splice(j, 1);
              break;
            }
          }
        }
        // 判断索引是否存在
        store.dispatch(save_msgList(result.concat(data)));
        storage.save(userId + '-MsgList', result.concat(data));
      } else {
        store.dispatch(save_msgList(data));
        storage.save(userId + '-MsgList', [...this.defaultData, ...data]);
      }
    });
  },

  //   消除红点点
  /**
   *
   * @param {'del':长按删除,'unread':消除红点,'systemMsg':清除系统消息小红点,'cleanSystem':消除系统消息} type
   * @param {'用户id'} uid
   * @param {'index'} 索引--当type=systemMsg 必传
   */
  finUserIdEdit: function(type, uid, index) {
    let userId = store.getState().userdata.userId;
    storage.load(userId + '-MsgList', result => {
      for (let i = 0; i < result.length; i++) {
        if (result[i].userId === uid) {
          if (type === 'del') {
            result.splice(i, 1);
          } else if (type === 'unread') {
            result[i].unread = 0;
          } else if (type === 'systemMsg') {
            result[i].unread--;
            result[i].messages[index].isread = true;
          } else if (type === 'cleanSystem') {
            result[i].messages = [];
            result[i].unread = 0;
          }
          break;
        }
      }
      store.dispatch(save_msgList(result));
      storage.save(userId + '-MsgList', result);
    });
  },
  //   发送数据
  sendMsg: function(msg, user) {
    store.dispatch(send_msg({msg, user}));
    let userId = store.getState().userdata.userId;
    storage.load(userId + '-MsgList', result => {
      let flag = false;
      for (const v of result) {
        if (v.userId === user.saveId) {
          v.messages = [...v.messages, msg];
          flag = true;
          break;
        }
      }
      //   判读是否存在
      if (flag) {
        storage.save(userId + '-MsgList', result);
      } else {
        storage.save(userId + '-MsgList', [
          ...result,
          {
            username: user.username,
            avator: user.avator,
            messages: [msg],
            userId: user.saveId,
            unread: 0,
          },
        ]);
      }
    });
  },
};

export default message;
