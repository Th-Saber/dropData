<template>
  <div id="message">
    <div class="top_box">
      <div class="left">
        <div class="item">
          <div class="value">
            {{ currentNewMessageCount }}
            <!-- <img src="@/assets/imgs/new_msg.png" alt /> -->
          </div>
          <div class="title">昨日新增留言（条）</div>
        </div>
        <div class="item">
          <div class="value">
            {{ expertCount }}
            <!-- <img src="@/assets/imgs/new_msg.png" alt /> -->
          </div>
          <div class="title">标记过的留言（条）</div>
        </div>
        <div class="item">
          <div class="value">
            {{ userMessageCount }}
            <!-- <img src="@/assets/imgs/new_msg.png" alt /> -->
          </div>
          <div class="title">留言用户总数（人）</div>
        </div>
        <div class="item">
          <div class="value">
            {{ yesterdayMessageCount }}
            <!-- <img src="@/assets/imgs/new_msg.png" alt /> -->
          </div>
          <div class="title">昨日处理留言（条）</div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="title">专家答疑</div>
      <div class="dialog">
        <div class="left">
          <div class="search">
            <input type="text" v-model="search" placeholder="搜索" />
            <div @click="searchUser">
              <i class="el-icon-search"></i>
            </div>
          </div>
          <div class="itemList">
            <div
              class="item"
              :style="i==itemActive?'background: #1e577d;color:#fff':''"
              v-for="(v,i) in listData"
              :key="i"
              @contextmenu.prevent="showContextMenu($event,v,i)"
              @dblclick="checkedChat(v,i)"
            >
              <div
                class="avatar"
                :style="`background:url(${v.avator==undefined?defaultImg:v.avator}) 0% 0% / cover no-repeat`"
              ></div>
              <div class="name">
                <div>{{v.username}}</div>
                <div>{{ v.tel }}</div>
              </div>
              <div class="mark" v-show="v.pointUser"></div>
            </div>
            <div class="searchList" v-show="searchListState">
              <div class="close" @click="searchListState = false">
                <img src="../../assets/imgs/triangle_gray_down.png" alt />
              </div>
              <div class="list">
                <div class="item" v-for="(v,i) in searchList" :key="i" @dblclick="checkedList(v)">
                  <div
                    class="avatar"
                    :style="`background:url(${v.avator==undefined?defaultImg:v.avator}) 0% 0% / cover no-repeat`"
                  ></div>
                  <div class="name">
                    <div>{{v.username}}</div>
                    <div>{{ v.tel }}</div>
                  </div>
                  <div class="mark" v-show="v.pointUser"></div>
                </div>
              </div>
              <div class="jumppage">
                <div v-show="current!=1" @click="jumppage(-1)">上一页</div>
                <div v-show="(total-size*current)>0" @click="jumppage(1)">下一页</div>
              </div>
            </div>
          </div>
        </div>
        <div class="center">
          <div class="top" ref="messageBox">
            <div
              class="history"
              @click="handelHistory"
              v-show="moreMsg&&listData.length!=0&&!userData['moreMsg']"
            >
              <img
                src="../../assets/imgs/loading.gif"
                alt
                v-show="loading"
                style="width:20px;height:20px"
              />
              <img src="../../assets/imgs/triangle_gray_down.png" alt v-show="!loading" />&nbsp;历史记录
            </div>
            <div
              class="msgitem"
              v-for="(v,i) in messages"
              :key="i"
              :style="v.receiveType==2?'color:#119E6E':'color:#4A9DFF'"
            >
              <div class="title">
                <label>{{v.receiveType==2?userData.username+'：':'专家回复：' }}</label>
                <label class="time">{{ v.createTime }}</label>
              </div>
              <div class="content">{{ v.message }}</div>
            </div>
          </div>
          <div class="bottom">
            <div class="title">回复：</div>
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="textarea"
              maxlength="100"
              show-word-limit
              rows="5"
              resize="none"
            ></el-input>
            <div class="btn">
              <div class="button" @click="sendMassege">发送</div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="main_user">
            <div
              :style="`background:url(${userData.avator==undefined?defaultImg:userData.avator}) 0% 0% / cover no-repeat`"
              class="right_avatar"
            ></div>
            <div class="acc">
              <div class="name_tel">
                <div class="name">{{ userData.username }}</div>
                <div>{{userData.tel}}</div>
              </div>
            </div>
            <div class="alter" @click="editRemark">{{alter}}</div>
          </div>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="userData.expertRemarks"
            maxlength="30"
            resize="none"
            show-word-limit
            :disabled="readonly"
          ></el-input>
          <div class="btn_box">
            <div :style="material==1?'color:#81fffb':''" @click="changeMaterial(1)">个人资料</div>&emsp;
            <div :style="material!=1?'color:#81fffb':''" @click="changeMaterial(2)">健康资料</div>
          </div>
          <div class="listbox" v-show="material==1">
            <div class="title"></div>
            <dl class="infolist">
              <dd>
                <label>生日</label>
                <label>{{userData.birthday}}</label>
              </dd>
              <dd>
                <label>性别</label>
                <label>{{userData.sex==0?'女':'男'}}</label>
              </dd>
              <dd>
                <label>身高(cm)</label>
                <label>{{userData.height}}</label>
              </dd>
              <dd>
                <label>体重(kg)</label>
                <label>{{userData.weight}}</label>
              </dd>
              <dd>
                <label>血型</label>
                <label>{{userData.bloodType}}</label>
              </dd>
              <dd>
                <label>吸烟</label>
                <label>{{userData.wasSmoke==0?'否':"是"}}</label>
              </dd>
              <dd>
                <label>饮酒</label>
                <label>{{userData.wasWine==0?'否':"是"}}</label>
              </dd>
              <dd>
                <label>运动时间</label>
                <label>{{ userData.sportsTime==0?'1小时以下':userData.sportsTime==1?'3小时以下': '3小时以上'}}</label>
              </dd>
            </dl>
          </div>
          <div class="ecahrts_box" v-show="material==2">
            <div class="title">
              <div class="device" @click="deviceItem.firstState = !deviceItem.firstState">
                <div
                  class="deviceTitle"
                >{{deviceItem.deviceItem.first+'/'+deviceItem.deviceItem.second}}</div>
                <img src="../../assets/imgs/yellow_triangle.png" alt />
                <dl class="selectList" v-show="deviceItem.firstState">
                  <dd
                    v-for="(v,i) in deviceItem.itemList"
                    :key="i"
                    @mouseenter="checkFirst(v.children,v.label,v.value,'deviceItem')"
                  >{{ v.label }}</dd>
                  <dl class="sublist" v-show="deviceItem.secondState">
                    <dd
                      v-for="(item,index) in deviceItem.children"
                      :key="index+item.label"
                      @click="changeSecond(item.label,item.value,'deviceItem')"
                    >{{ item.label }}</dd>
                  </dl>
                </dl>
              </div>
            </div>
            <div class="score">
              <div class="item" v-for="(v,i) in scoreItem" :key="i">
                <div class="color" :style="'background:'+v.color"></div>
                <label class="name">{{ v.name }}</label>
                <label>{{ v.score }}</label>
              </div>
            </div>
            <div id="container1" ref="container1"></div>
            <div class="time">
              <div
                v-show="deviceItem.value.first!=2"
                :style="time==1?'color:#4298FF':''"
                @click="changeTime(1)"
              >周</div>
              <div
                v-show="deviceItem.value.first!=2"
                :style="time==2?'color:#4298FF':''"
                @click="changeTime(2)"
              >月</div>
              <div :style="time==3 ?'color:#4298FF':''" @click="changeTime(3)">年</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ki-context
      ref="kiContext"
      backgroundColor="#fff"
      fontSize="15px"
      textColor="#35495e"
      borderRadius="0.1"
    />
  </div>
</template>

<script>
import {
  questionList,
  fetchUserInfoById,
  settingExpertRemarks,
  settingUserPoint,
  sendMsg,
  searchUserPage,
  questionFetchMessageRecord
} from "@/apis/api";
import moment from "moment";
import echarts from "echarts";
export default {
  data() {
    return {
      defaultImg: require("../../assets/imgs/default_avatar.png"),
      readonly: true, //编辑框支只读
      loading: false, //加载
      moreMsg: true, //更多消息
      itemActive: 0, //默认选择对话框
      messages: [],
      textarea: "", //对话内容
      alter: "编辑", //备注编辑按钮
      material: 2, //默认选中状态个人资料1，2健康资料
      deviceItem: {
        deviceItem: {
          first: "生命体征仪",
          second: "血氧饱和度"
        },
        value: {
          first: "1",
          second: "oxygen"
        },
        itemList: [
          {
            value: "1",
            label: "生命体征仪",
            children: [
              {
                value: "oxygen",
                label: "血氧饱和度"
              },
              {
                value: "heart",
                label: "心率"
              }
            ]
          },
          {
            value: "2",
            label: "尿常规检测仪",
            children: [
              {
                value: "ph01",
                label: "白细胞(Leu)"
              },
              {
                value: "ph02",
                label: "亚硝酸盐(NIT)"
              },
              {
                value: "ph03",
                label: "尿胆原(URO)"
              },
              {
                value: "ph04",
                label: "蛋白质(Pro)"
              },
              {
                value: "ph05",
                label: "酸碱度(PH)"
              },
              {
                value: "ph06",
                label: "潜血(BLD)"
              },
              {
                value: "ph07",
                label: "比重(SG)"
              },
              {
                value: "ph08",
                label: "酮体(Ket)"
              },
              {
                value: "ph09",
                label: "胆红素(BiL)"
              },
              {
                value: "ph10",
                label: "葡萄糖(GLU)"
              },
              {
                value: "ph11",
                label: "抗坏血酸(Vc)"
              },
              {
                value: "ph12",
                label: "钙(Ca)"
              },
              {
                value: "ph13",
                label: "肌酐(CRE)"
              },
              {
                value: "ph14",
                label: "微量白蛋白(MAC)"
              }
            ]
          }
        ], //设备项目级联
        firstState: false, //级联一级状态
        secondState: false, //级联一级状态
        firstGrade: "", //一级设备暂存
        children: [] //二级列表
      }, //
      scoreItem: [
        {
          name: "极好",
          score: "90-100分",
          color: "#2FB85C"
        },
        {
          name: "健康",
          score: "70-89分",
          color: "#36A2FC"
        },
        {
          name: "一般",
          score: "50-69分",
          color: "#EEBB4F"
        },
        {
          name: "较差",
          score: "0-49分",
          color: "#C64E5A"
        }
      ], //echarts分数
      time: 1, //时间，1周2月3年
      listData: [],
      currentNewMessageCount: "", //新增留言
      expertCount: "", //标记留言
      userMessageCount: "", //留言用户总数
      yesterdayMessageCount: "", //昨日处理留言
      userData: {}, //选中用户数据
      current: 1,
      size: 6,
      total: 10,
      search: "", //搜索内容
      searchList: [],
      searchListState: false, //搜索列表状态
      historyCurrent: 1,
      historySize: 10
    };
  },
  created() {
    this.itemActive = sessionStorage.itemActive ? sessionStorage.itemActive : 0;
    if (!localStorage.dropDataHistoryMessage) {
      localStorage.dropDataHistoryMessage = JSON.stringify([]);
    }

    this.getQuestionList(this.deviceItem.value.first);
    this.clearHistoryLasttime();
    // this.timer();
  },
  methods: {
    saveData(local, res) {
      let arr = local;
      if (local.length != 0) {
        if (res.length != 0) {
          for (let i = 0; i < local.length; i++) {
            for (let j = 0; j < res.length; j++) {
              if (local[i].userId == res[j].userId) {
                if (local[i].messages != undefined) {
                  res[j].messages = local[i].messages.concat(res[j].messages);
                }
                local[i] = Object.assign(local[i], res[j]);
                this.listData = local;
              } else {
                arr.concat(res[j]);
                this.listData = arr;
              }
            }
          }
          this.scrollBottom();
        } else {
          this.listData = local.concat(res);
        }
      } else {
        this.listData = local.concat(res);
      }
      localStorage.dropDataHistoryMessage = JSON.stringify(this.listData);
      this.filterMessage(this.listData[this.itemActive].messages);
      this.filterUserData(this.listData[this.itemActive]);
    },
    filterUserData(obj) {
      this.userData = obj;
      this.getFetchUserInfoById(this.deviceItem.value.first, obj.userId);
    },
    // 双击选择聊天用户
    checkedChat(v, i) {
      this.itemActive = i;
      sessionStorage.itemActive = i;
      this.historyCurrent = 1;
      this.moreMsg = false;
      this.clearHistoryLasttime();
      this.saveData(this.listData, []);
    },
    // 跳页
    jumppage(val) {
      this.getsearchUserPage(this.search, this.current + val, this.size);
    },
    //搜索列表提前
    checkedList(v) {
      let arr1 = [];
      if (this.listData.length == 0) {
        arr1 = [v];
      } else {
        let arr = this.listData;
        arr.forEach((item, i) => {
          if (arr[i].userId == v.userId) {
            if (arr[i].messages != undefined) {
              v["messages"] = arr[i].messages;
            }
            arr.splice(i, 1);
            arr1 = [v, ...arr];
          } else {
            arr1 = [v, ...arr];
          }
        });
      }
      this.clearHistoryLasttime();
      this.itemActive = 0;
      sessionStorage.itemActive = 0;
      this.moreMsg = true;
      this.historyCurrent = 1;
      this.deviceItem.deviceItem.first = "生命体征仪";
      this.deviceItem.deviceItem.second = "血氧饱和度";
      this.deviceItem.value.first = "1";
      this.deviceItem.value.second = "oxygen";
      this.time = 1;
      this.searchListState = false;
      this.saveData(arr1, []);
    },
    // 根据设备类型和id查找用户信息
    async getFetchUserInfoById(machineType, uid) {
      let result = await fetchUserInfoById(machineType, uid);
      let res = result.data;
      let obj = Object.assign(res, this.userData);
      this.userData = obj;
      this.listData[this.itemActive] = this.userData;
      localStorage.dropDataHistoryMessage = JSON.stringify(this.listData);
      this.filterTime(this.time);
    },
    //搜索
    searchUser() {
      if (this.search == "") {
        this.$message.error("请输入正确内容");
      } else {
        this.getsearchUserPage(this.search, this.current, this.size);
      }
    },
    // 搜索分页
    async getsearchUserPage(name, current, size) {
      let result = await searchUserPage(name, current, size);
      let res = result.data;
      console.log(res);
      if (res.records.length != 0) {
        this.searchList = res.records;
        this.searchListState = true;
        this.current = res.current;
        this.total = res.total;
      } else {
        this.$message.error("查询暂无数据");
      }
    },
    // 右键菜单
    showContextMenu(event, v, index) {
      // 在items数组中定义所需的右键菜单选项
      let items = [
        {
          text: v.pointUser ? "取消标记" : "标记",
          click: () => {
            this.setPoint(v, index);
          }
        },
        {
          text: "删除",
          divider: true,
          click: () => {
            this.deleteChat(v, index);
          }
        },
        {
          text: "取消",
          divider: true,
          click: () => {
            this.hideContextMenu();
          }
        }
        // {
        //   text: "Disabled",
        //   disabled: true,
        //   click: () => {
        //     alert("Option3!");
        //   }
        // }
      ];
      this.$refs.kiContext.show(event, items);
    },
    // 关闭右键菜单
    hideContextMenu() {
      this.$refs.kiContext.hide();
    },
    // 清除当前聊天
    deleteChat(v, i) {
      this.$confirm("此操作将删除当前聊天, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.listData.splice(this.itemActive, 1);
          this.itemActive = 0;
          sessionStorage.itemActive = 0;
          if (this.listData.lemgth != 1) {
            this.saveData(this.listData, []);
          } else {
            this.saveData([], []);
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.hideContextMenu();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
          this.hideContextMenu();
        });
    },
    // 发送消息按钮
    sendMassege() {
      if (this.textarea != "") {
        this.getSendMassege(this.userData.userId, this.textarea, 1, 1);
      } else {
        this.$message.error("消息不能为空");
      }
    },
    // 发送消息
    async getSendMassege(receiveId, message, type, receiveType) {
      let result = await sendMsg(receiveId, message, type, receiveType);
      if (result.msg == "成功") {
        let obj = {
          username: "专家回复",
          createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
          message: message,
          receiveType: 1
        };
        if (this.listData[this.itemActive].messages != undefined) {
          this.listData[this.itemActive].messages = [
            ...this.listData[this.itemActive].messages,
            obj
          ];
        } else {
          this.listData[this.itemActive]["messages"] = [obj];
        }
        this.textarea = "";
        this.saveData(this.listData, []);
        this.scrollBottom();
      }
    },
    // 获取历史记录
    handelHistory() {
      if (this.listData[this.itemActive]["moreMsg"]) {
        this.$message.error("暂无更多历史记录");
        return;
      }
      this.loading = true;
      if (this.messages.length != 0) {
        sessionStorage.historyLasttime = sessionStorage.historyLasttime
          ? sessionStorage.historyLasttime
          : moment(this.messages[0].createTime).format("YYYY-MM-DDTHH:mm:ss");
        this.getQuestionFetchMessageRecord(
          this.userData.userId,
          sessionStorage.historyLasttime,
          this.historyCurrent,
          this.historySize
        );
      } else {
        sessionStorage.historyLasttime = sessionStorage.historyLasttime
          ? sessionStorage.historyLasttime
          : moment().format("YYYY-MM-DDTHH:mm:ss");
        this.getQuestionFetchMessageRecord(
          this.userData.userId,
          sessionStorage.historyLasttime,
          this.historyCurrent,
          this.historySize
        );
      }
    },
    // 获取历史接口
    async getQuestionFetchMessageRecord(uid, lastTime, page, size) {
      let res = await questionFetchMessageRecord(uid, lastTime, page, size);
      this.historyCurrent++;
      if (res.data.records.length != 0) {
        if (
          res.data.records[0].createTime != lastTime &&
          res.data.records.length > 1
        ) {
          if (!this.listData[this.itemActive]["messages"]) {
            this.listData[this.itemActive][
              "messages"
            ] = res.data.records.reverse();
          } else {
            this.listData[this.itemActive]["messages"] = [
              ...res.data.records.reverse(),
              ...this.listData[this.itemActive]["messages"]
            ];
          }
        } else {
          this.moreMsg = false;
          this.listData[this.itemActive]["moreMsg"] = true;
          this.$message.error("暂无更多历史记录");
        }
        this.loading = false;
      } else {
        this.listData[this.itemActive]["moreMsg"] = true;
        this.moreMsg = false;
        this.$message.error("暂无更多历史记录");
      }
      this.saveData(this.listData, []);
    },
    // 编辑
    editRemark() {
      if (this.alter == "编辑") {
        this.readonly = false;
        this.alter = "完成";
      } else {
        try {
          settingExpertRemarks(
            this.userData.userId,
            this.userData.expertRemarks
          ).then(res => {
            this.listData[this.itemActive] = this.userData;
            localStorage.dropDataHistoryMessage = JSON.stringify(this.listData);
            this.$message({
              message: "备注成功",
              type: "success"
            });
            this.readonly = true;
            this.alter = "编辑";
          });
        } catch (error) {
          throw error;
        }
      }
    },
    // 是否标记用户
    setPoint(v, index) {
      switch (v.pointUser) {
        case true:
          this.setMark(v, 0, index);
          break;
        case false:
          this.setMark(v, 1, index);
          break;
        default:
          this.$message.error("参数错误");
          break;
      }
    },
    // 标记用户
    async setMark(v, state, index) {
      try {
        let res = await settingUserPoint(v.userId, state);
        this.listData[index].pointUser = !this.listData[index].pointUser;
        localStorage.dropDataHistoryMessage = JSON.stringify(this.listData);
        this.$message({
          type: "success",
          message: "设置成功!"
        });
        this.hideContextMenu();
      } catch (error) {
        throw error;
      }
    },
    // 时间过滤
    filterTime(time) {
      try {
        switch (time) {
          case 1:
            this.filterItem(this.userData.weeks);
            break;
          case 2:
            this.filterItem(this.userData.months);
            break;
          case 3:
            if (this.deviceItem.value.first == 1) {
              this.filterItem(this.userData.years);
            } else {
              this.filterItem(this.userData.urineYears);
            }
            break;
        }
      } catch (error) {
        throw error;
        this.$message.error("暂无数据123165");
      }
    },
    //项目过滤
    filterItem(data) {
      try {
        if (data != undefined) {
          let healthData = data.map(v => {
            return {
              score: v[this.deviceItem.value.second + "Score"],
              date: moment(v["createTime"]).format("YYYY-MM-DD HH:mm:ss")
            };
          });
          this.lineEcharts(healthData);
        } else {
          this.$message.error("暂无当前用户健康数据");
        }
      } catch (error) {
        throw error;
        this.$message.error("暂无当前用户健康数据");
      }
    },
    // 折线图
    lineEcharts(healthData) {
      try {
        if (healthData == "") {
          this.$message.error("暂无数据");
          return;
        }
        const myCharts = echarts.init(this.$refs.container1);
        let options = {
          tooltip: {
            //鼠标悬浮框的提示文字
            trigger: "axis",
            formatter: "日期：{b0}<br />指数：{c0}",
            backgroundColor: "#1E577D",
            textStyle: {
              color: "#12C8CE"
            },
            axisPointer: {
              lineStyle: {
                color: "#12C8CE",
                width: 1
              }
            }
          },
          grid: {
            left: "6%",
            top: "4.5%",
            width: "94%",
            height: "85%"
          },
          xAxis: [
            {
              //x轴坐标数据
              type: "category",
              boundaryGap: true,
              data: healthData.map(v => {
                return v.date;
              }),

              axisLine: {
                lineStyle: {
                  color: "#12C8CE",
                  width: 1
                }
              },
              axisTick: {
                alignWithLabel: true,
                inside: true
              }
            }
          ],
          yAxis: [
            {
              //y轴坐标数据
              type: "value",
              axisLine: {
                lineStyle: {
                  color: "#12C8CE",
                  width: 1
                }
              },
              axisTick: {
                show: true,
                length: 5,
                alignWithLabel: true,
                interval: 0,
                lineStyle: {
                  width: 1,
                  color: "#12C8CE"
                }
              },
              boundaryGap: false,
              axisLabel: {
                interval: 0,
                margin: 10,
                color: "#12C8CE"
              },
              splitLine: {
                show: true, // 网格线是否显示
                //  改变样式
                lineStyle: {
                  color: "#1ae8ff85" // 修改网格线颜色
                }
              },
              splitArea: {
                show: true,
                areaStyle: {
                  color: "rgba(9, 28, 50, 0.5)"
                }
              }
              // axisPointer: {
              //   show: true,
              //   type: "line",
              //   snap: true,
              //   label: {
              //     color: "#12C8CE",
              //     backgroundColor: "#205C90"
              //   }
              // }
            }
          ],
          series: [
            //驱动图表生成的数据内容数组，几条折现，数组中就会有几个对应对象，来表示对应的折线
            {
              // name: "最高气温",
              type: "line", //pie->饼状图  line->折线图  bar->柱状图
              data: healthData.map(v => {
                return v.score;
              })

              // smooth: true
            }
          ],
          visualMap: {
            top: 10,
            right: 10,
            // showLabel :true,

            pieces: [
              {
                gt: 0,
                lte: 50,
                color: "#e2463d"
              },
              {
                gt: 50,
                lte: 70,
                color: "#eebb4f"
              },
              {
                gt: 70,
                lte: 90,
                color: "#38a9fc"
              },
              {
                gt: 90,
                lte: 100,
                color: "#30c340"
              }
            ],
            show: false,
            textStyle: {
              color: "#12C8CE"
            },
            showLabel: false,
            outOfRange: {
              color: "#999"
            },
            right: "2%",
            top: "10%"
          }
        };
        myCharts.setOption(options);
      } catch (error) {
        throw error;
        this.$message.error("暂无数据");
      }
    },
    //切换资料框
    changeMaterial(val) {
      this.material = val;
      if (val == 2) {
        this.filterTime(this.time);
      }
    },
    // 查看二级联动一级
    checkFirst(children, label, value, key) {
      this[key].firstGrade = label;
      this[key].children = children;
      this[key].secondState = true;
      this[key].value.first = value;
    },
    // change二级联动二级
    changeSecond(label, value, key) {
      this[key].value.first == 2 ? (this.time = 3) : (this.time = 1);
      this[key].deviceItem.first = this[key].firstGrade;
      this[key].deviceItem.second = label;
      this[key].value.second = value;
      this.getFetchUserInfoById(this[key].value.first, this.userData.userId);
    },
    //改变时间
    changeTime(val) {
      this.time = val;
      console.log(this.userData);
      this.getFetchUserInfoById(
        this.deviceItem.value.first,
        this.userData.userId
      );
    },
    // 定时器
    timer() {
      try {
        const timer = setInterval(async () => {
          this.getQuestionList();
        }, 5000);
        this.$once("hook:beforeDestroy", () => {
          clearInterval(timer);
        });
      } catch (error) {
        throw error;
      }
    },

    // 请求消息列表
    async getQuestionList(machineType) {
      try {
        let res = (await questionList(machineType)).data;
        this.currentNewMessageCount = res.currentNewMessageCount; //新增留言
        this.expertCount = res.expertCount; //新增留言
        this.userMessageCount = res.userMessageCount; //新增留言
        this.yesterdayMessageCount = res.yesterdayMessageCount; //新增留言
        let localData = JSON.parse(localStorage.dropDataHistoryMessage);
        this.saveData(localData, res.infos);
      } catch (error) {
        console.log(error);
      }
    },
    // 消息过滤
    filterMessage(arr) {
      try {
        if (arr == [] || arr == undefined) {
          this.messages = [];
          return;
        } else {
          arr.forEach(v => {
            v.createTime = moment(v["createTime"]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          });
          this.messages = arr;
        }
      } catch (error) {
        throw error;
      }
    },
    clearHistoryLasttime() {
      sessionStorage.removeItem("historyLasttime");
    },
    scrollBottom() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight;
        }, 13);
      });
    }
  }
};
</script>

<style lang="less" scoped>
@white: #e8eaed;
@blue: #81fffb;
#message {
  width: 100%;
  height: 100%;
  & > .top_box {
    display: flex;
    width: 100%;
    height: 13.1%;
    justify-content: center;

    & > div {
      display: flex;
      align-items: center;
      border-radius: 10px;
      background: #174162;
    }
    .item .value {
      font-size: 1.5rem;
      color: @blue;
      position: relative;
      top: -30%;
      & > img {
        position: absolute;
        right: 50%;
        top: -30%;
        margin-right: -3.5rem;
        height: 1.25rem;
        width: 1.25rem;
      }
    }
    .item .title {
      color: @white;
      font-size: 1rem;
    }
    .left {
      width: 60%;
      height: 100%;
      .item:nth-last-of-type(1) {
        border: none;
      }
      .item {
        height: 42%;
        flex-grow: 1;
        border-right: 1px solid #4d89b0;
        text-align: center;
      }
    }
  }
  & > .main {
    width: 100%;
    height: 78%;
    margin-top: 1.25%;
    border: 1px solid #4b97a47c;
    border-radius: 5px 5px 0 0;
    & > .title {
      background: linear-gradient(#1c4364 0%, #0a1127 100%);
      border-radius: 5px 5px 0 0;
      display: flex;
      justify-content: space-between;
      width: calc(100% - 20px);
      padding: 0 10px;
      height: 5%;
      font-size: 0.875rem;
      color: #81fffb;
      align-items: center;
      border-bottom: 1px solid #4b97a479;
    }
    .dialog {
      width: 100%;
      height: calc(95% - 1px);
      display: flex;
      font-size: 1rem;
      .left {
        height: 100%;
        width: 240px;
        background: #e6e5e6;
        .search {
          width: 92%;
          height: 1.875rem;
          background: #fff;
          display: flex;
          margin: 0.625rem auto 1.25rem;
          border-radius: 5px;
          color: #cbcbcb;

          & > input {
            flex-grow: 1;
            border: none;
            outline: none;
            text-indent: 6px;
            font-size: 14px;
            color: #cbcbcb;
            border-radius: 5px;
            color: #0a1127;
          }
          & > div {
            height: 1.875rem;
            line-height: 1.875rem;
            width: 1.875rem;
            color: #b1b1b1;
            font-size: 1.25rem;
            &:hover {
              cursor: pointer;
            }
          }
        }
        .itemList {
          width: 100%;
          height: calc(100% - 3.75rem);
          overflow-y: auto;
          position: relative;
          .searchList {
            position: absolute;
            width: 100%;
            height: 70%;
            bottom: 0;
            z-index: 50;
            background: #fff;
            & > .close {
              width: 100%;
              height: 5%;
              display: flex;
              justify-content: center;
              align-items: center;
              &:hover {
                background: #1e577d7a;
              }
            }
            & > .list {
              width: 100%;
              height: 85%;

              overflow: auto;
              & > .item {
                width: calc(100% - 20px);
                height: 40px;
                padding: 10px;
                display: flex;
                justify-content: space-between;
                color: #666666;
                font-size: 16px;
                align-items: center;
                background: #d2d7db;
                &:hover {
                  background: #1e577d7a;
                  color: #fff;
                }
                .avatar {
                  width: 40px;
                  height: 40px;
                  border-radius: 5px;
                  margin-right: 4px;
                }
                .name {
                  flex-grow: 1;
                  & > div:nth-of-type(1) {
                  }
                }
                .mark {
                  width: 8px;
                  height: 8px;
                  border-radius: 4px;
                  background: #fffb81;
                }
              }
            }
            & > .jumppage {
              height: 10%;
              width: 100%;
              display: flex;
              & > div {
                width: 50%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: #fafafa;
                background: #0a1127;
                &:hover {
                  cursor: pointer;
                }
              }
            }
          }
          .item {
            width: calc(100% - 20px);
            height: 40px;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            color: #666666;
            font-size: 16px;
            align-items: center;
            &:hover {
              background: #1e577d7a;
              color: #fff;
            }
            .avatar {
              width: 40px;
              height: 40px;
              text-align: center;
              border-radius: 5px;
              margin-right: 4px;
            }
            .name {
              flex-grow: 1;
              & > div:nth-of-type(1) {
              }
            }
            .mark {
              width: 8px;
              height: 8px;
              border-radius: 4px;
              background: #fffb81;
            }
          }
          .selecteditem {
            background: #1e577d;
            color: #fff;
          }
        }
      }
      .center {
        height: 100%;

        width: calc(50% - 1.25rem);
        padding-right: 1.25rem;
        background: #f6f6f6;

        .top {
          width: 100%;
          height: 22.5rem;
          background: #fff;
          // padding-top: 1.25rem;
          overflow-y: auto;
          .history {
            width: 100%;
            height: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover {
              cursor: pointer;
              background: #4a4a4a31;
            }
          }
          &::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          &::-webkit-scrollbar-track {
            background-color: #fff;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 4px;
            background-color: #999;
          }

          &::-webkit-scrollbar-thumb:active {
            background-color: #cccccc;
          }
          .more {
            width: 70px;
            display: flex;
            color: #8894a8;
            font-size: 12px;
            align-items: center;
            margin: 0 auto 1rem;
            justify-content: space-between;
            &:hover {
              cursor: pointer;
            }
          }
          .msgitem {
            width: calc(100% -2.5rem);
            width: calc(100% -1rem);
            padding: 0.5rem 1.25rem;
            border-bottom: 1px solid #efefef;
            & > .title {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 1rem;
              .time {
                color: #8894a8;
              }
            }
            & > .content {
              width: 80%;
            }
          }
        }
        .bottom {
          width: 100%;
          height: calc(40% - 1rem);
          padding-top: 1rem;
          & > .title {
            color: #000;
            text-indent: 5px;
            margin-bottom: 10px;
          }
          .textarea {
            width: calc(100% - 1.25rem);
            height: calc(55% - 1.25rem);
            overflow-y: auto;
            padding: 0.625rem;
            background: #fff;
            outline: none;
            border: none;
            font-size: 1rem;
            color: #999;
          }

          .btn {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            & > .button {
              width: 6.25rem;
              height: 2.375rem;
              text-align: center;
              line-height: 2.375rem;
              color: @blue;
              font-weight: 500;
              background: linear-gradient(#1c4364 0%, #0a1127 100%);
              border: 1px solid @blue;
              outline: none;
              border-radius: 5px;
              margin-top: 12px;
              &:hover {
                cursor: pointer;
              }
            }
          }
        }
      }
      .right {
        flex-grow: 1;
        padding: 1rem 12px 0;
        background: #fff;
        height: calc(100% - 1rem);
        .main_user {
          width: 100%;
          height: 10%;
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          position: relative;
          .right_avatar {
            width: 3.125rem;
            height: 3.125rem;
            border-radius: 5px;
          }
          .acc {
            width: calc(96% - 3.125rem);
            height: 3.125rem;
            color: #333;
            font-size: 16px;
            .name_tel {
              width: 100%;
              height: 3.125rem;
              & > .name {
                display: flex;
                align-items: center;
              }
            }
            .remark {
              padding: 0.875rem 12px;
              width: calc(100% - 24px);
              border: 1px solid #efefef;
              outline: none;
              font-size: 0.875rem;
              color: #999;
              height: 28px;
              overflow: hidden;
            }
          }
          .alter {
            position: absolute;
            right: 0;
            top: 0;
            color: #4a9dff;
            font-size: 1rem;
            &:hover {
              cursor: pointer;
            }
          }
        }
        .btn_box {
          display: flex;
          font-size: 1rem;
          margin-top: 10px;
          & > div {
            height: 1.75rem;
            width: 6.25rem;
            line-height: 1.75rem;
            text-align: center;
            background: linear-gradient(#1c4364 0%, #0a1127 100%);
            color: @white;
            border: solid 1px @blue;
            border-radius: 5px;
            &:hover {
              cursor: pointer;
            }
          }
        }
        .listbox {
          width: 100%;
          height: 70%;
          margin-top: 10px;
          & > .title {
            width: calc(100% - 20px);
            padding: 0 10px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 6.1%;
            font-size: 1rem;
            color: @blue;
            border: 1px solid #4b97a4;
            background: linear-gradient(#1c4364 0%, #0a1127 100%);
            border-radius: 5px 5px 0 0;
          }
          .infolist {
            width: calc(100% - 2rem);
            border: 1px solid #f4f4f4;
            padding: 0 1rem;
            color: #4a4a4a;
            & > dd {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 2.5rem;
              font-size: 0.875rem;
              border-bottom: 1px solid #f4f4f4;
            }
          }
        }
        .ecahrts_box {
          width: 100%;
          height: 70%;
          margin-top: 10px;
          & > .title {
            width: calc(100% - 20px);
            padding: 0 10px;
            display: flex;
            align-items: center;
            height: 6.1%;
            border: 1px solid #4b97a4;
            border-bottom: 1px solid #4b97a4;
            background: linear-gradient(#1c4364 0%, #0a1127 100%);
            border-radius: 5px 5px 0 0;
            .device {
              width: 150px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              color: #e1de77;
              font-size: 0.875rem;
              position: relative;
              margin-right: 4%;
              .deviceTitle {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              &:hover {
                cursor: pointer;
              }
              .selectList {
                position: absolute;
                z-index: 30;
                top: 100%;
                width: 70%;
                background: #fff;
                color: #174162;
                border-radius: 5px;
                border: 1px solid #4b97a4;
                text-indent: 5px;
                & > dd {
                  &:hover {
                    background: #174162;
                    color: #fff;
                    border-radius: 5px;
                  }
                }
                .sublist {
                  font-size: 0.875rem;
                  width: 120%;
                  max-height: 300%;
                  overflow-y: auto;
                  background: #fff;
                  color: #174162;
                  position: absolute;
                  border-radius: 5px;
                  border: 1px solid #4b97a4;
                  text-indent: 5px;
                  left: 100%;
                  top: 0;
                  & > dd {
                    &:hover {
                      cursor: pointer;
                      background: #174162;
                      color: #fff;
                      border-radius: 5px;
                    }
                  }
                }
              }
            }
          }
        }
        .score {
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          color: #999;
          margin-top: 0.875rem;
          & > .item {
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            .color {
              width: 0.875rem;
              height: 0.875rem;
            }
            & > .name {
              margin: 0 4px;
            }
          }
        }
        #container1 {
          width: 100%;
          height: 70%;
        }
        .time {
          display: flex;
          width: 100%;
          justify-content: center;
          align-items: center;
          color: #999;
          & > div {
            margin: 0 3rem;
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  #rightkey {
    width: 100px;
    height: 72px;
    border: 1px solid #a8b3bc;
    background: #fff;
    font-size: 16px;
    display: none;
    position: absolute;
    & > div {
      width: 100%;
      height: 36px;
      line-height: 36px;
      align-self: center;
      text-indent: 18px;
      &:hover {
        background: #c9d5e9;
        cursor: pointer;
      }
    }
  }
}
</style>