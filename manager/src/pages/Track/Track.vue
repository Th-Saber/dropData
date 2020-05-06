<template>
  <div id="track">
    <div class="select-saerch">
      <div class="select">
        <label>成员选择</label>&nbsp;
        <el-select v-model="member" placeholder="请选择" filterable @change="getMember($event)">
          <el-option
            v-for="item in memberList"
            :key="item.uid"
            :label="item.name"
            :value="item.uid"
          ></el-option>
        </el-select>
      </div>
      <div class="date">
        <label class="title">时间</label>
        <el-date-picker
          v-model="time"
          :clearable="false"
          align="right"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          @change="getTime"
        ></el-date-picker>
      </div>
    </div>
    <div id="container"></div>
    <!-- <div id="message_box">
      <div class="title_box">
        <div>
          <div class="name">{{ messageBox.name }}</div>
          <div class="acc">{{ messageBox.acc }}</div>
        </div>
        <div>{{ messageBox.date }}</div>
      </div>
      <div class="id_state">
        <div>ID:{{ messageBox.id }}</div>
        <div>
          设备状态：
          <label class="state">{{ messageBox.state }}</label>
        </div>
      </div>
      <div class="location_time">
        <div>
          <img src="../../assets/imgs/map.png" alt />
          <div class="location">{{messageBox.location}}</div>
        </div>
        <div>{{messageBox.time}}</div>
      </div>
      <div class="value_list">
        <div v-for="(v,i) in messageBox.valueList" :key="i">
          {{ v.name }}
          <br />
          {{ v.value }}
          <img src="../../assets/imgs/up.png" v-show="v.change===2" />
          <img src="../../assets/imgs/down.png" v-show="v.change===0" />
        </div>
      </div>
    </div>-->
  </div>
</template>
<script>
import { historyRoute } from "@/apis/api";
import moment from "moment";
export default {
  data() {
    return {
      memberList: [], //成员下拉列表
      member: "", //成员
      searchInput: "", //搜索
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      time: "" //日期选择
    };
  },
  methods: {
    //获取成员
    getMember(val) {
      if (this.time == "") {
        this.getHistoryRoute(val, this.time);
      } else {
        this.getHistoryRoute(val, this.time + "T23:59:59");
      }
    },

    //获取时间
    getTime(val) {
      this.getHistoryRoute(this.member, val + "T23:59:59");
    }
  },
  created() {
    this.memberList = JSON.parse(sessionStorage.family);
    this.member = JSON.parse(sessionStorage.family)[0].uid;
  },
  mounted() {
    //获取轨迹
    this.getHistoryRoute = function(id, time) {
      let acc = JSON.parse(sessionStorage.family).map(v => {
        if ((v.uid = id)) return v;
      });
      historyRoute(id, time).then(res => {
        if (res.data != "") {
          // 逆地理编码获取地址
          AMap.plugin("AMap.Geocoder", function() {
            var geocoder = new AMap.Geocoder({
              // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
              city: "010"
            });
            console.log(res);
            res.data.forEach(v => {
              geocoder.getAddress([v.longitude, v.latitude], function(
                status,
                result
              ) {
                if (status === "complete" && result.info === "OK") {
                  // result为对应的地理位置详细信息
                  v["address"] = result.regeocode.formattedAddress;
                }
              });
            });
          });
          initAMapUI();
          //地图实例
          var map = new AMap.Map("container", {
            resizeEnable: true,
            center: [res.data[0].longitude, res.data[0].latitude],
            zoom: 17
          });

          AMapUI.load(["ui/misc/PathSimplifier", "lib/$"], function(
            PathSimplifier,
            $
          ) {
            if (!PathSimplifier.supportCanvas) {
              alert("当前环境不支持 Canvas！");
              return;
            }
            var pathSimplifierIns = new PathSimplifier({
              zIndex: 100,
              autoSetFitView: false,
              map: map, //所属的地图实例

              getPath: function(pathData, pathIndex) {
                return pathData.path;
              },

              getHoverTitle: function(pathData, pathIndex, pointIndex) {
                if (pointIndex >= 0) {
                  return `<div id="message_box">
                        <div class="title_box">
                          <div>
                            <div class="name">${acc[0].name}</div>
                            <div class="acc">${
                              acc[0].isMaster == true ? "主账户" : "成员"
                            }</div>
                          </div>
                          <div>
                          ${moment(res.data[pointIndex].createTime).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )}
                          </div>
                        </div>
                        <div class="id_state">
                          <div>Tel:${acc[0].phone}</div>
                        </div>
                        <div class="location_time">
                          <div>
                            <img src=${require("../../assets/imgs/map.png")} alt />
                            <div class="location">${
                              res.data[pointIndex].address
                            }</div>
                          </div>
                        </div>
                        <div class="value_list">
                          <div>
                          <p>血氧(Sa02)</p>
           
                            ${res.data[pointIndex].bloodOxygenConcentration}
                          </div>
                          <div>
                         <p> 脉搏(次)</p>
     
                            ${res.data[pointIndex].heartRate}
                          
                          </div>
                          <div>
                              <p>      温度(℃)  </p>
          
                            ${res.data[pointIndex].temperature}
                          
                          </div>
                          <div>
                             <p> 海拔(m)</p>
         
                            ${res.data[pointIndex].height}
                      
                          </div>
                        </div>
                      </div>`;
                }
                return pathData.name + "，点数量" + pathData.path.length;
                // return pathData.name + "，点数量" + pathData.path.length;
              },
              renderOptions: {
                renderAllPointsIfNumberBelow: 100, //绘制路线节点，如不需要可设置为-1
                hoverTitleStyle: {
                  position: "top",
                  offset: [0, 40]
                }
              }
            });

            window.pathSimplifierIns = pathSimplifierIns;

            let endIdx = 0,
              data = [
                {
                  name: "轨迹路线",
                  path: [[res.data[0].longitude, res.data[0].latitude]]
                  // path: myPath.slice(0, 1)
                }
              ];

            pathSimplifierIns.setData(data);
            //对第一条线路（即索引 0）创建一个巡航器
            var navg1 = pathSimplifierIns.createPathNavigator(0, {
              loop: true, //循环播放
              speed: 20000 * 10 //巡航速度，单位千米/小时
            });

            function expandPath() {
              function doExpand() {
                endIdx++;

                // if (endIdx >= myPath.length) {
                //   return false;
                // }

                if (endIdx >= res.data.length) {
                  return false;
                }

                var cursor = navg1.getCursor().clone(), //保存巡航器的位置
                  status = navg1.getNaviStatus();
                data[0].path = res.data.slice(0, endIdx + 1).map(v => {
                  return [v.longitude, v.latitude];
                });

                // data[0].path = myPath.slice(0, endIdx + 1);
                pathSimplifierIns.setData(data); //延展路径

                //重新建立一个巡航器
                navg1 = pathSimplifierIns.createPathNavigator(0, {
                  loop: false, //循环播放
                  speed: 300, //巡航速度，单位千米/小时
                  pathNavigatorStyle: {
                    width: 20,
                    height: 20,
                    //使用图片
                    content: "defaultPathNavigator",
                    fillStyle: "#087EC4",
                    //经过路径的样式
                    pathLinePassedStyle: {
                      lineWidth: 6,
                      strokeStyle: "#087EC4",
                      dirArrowStyle: {
                        stepSpace: 15,
                        strokeStyle: "#fff"
                      }
                    }
                  }
                });

                if (status !== "stop") {
                  navg1.start();
                }

                //恢复巡航器的位置
                if (cursor.idx >= 0) {
                  navg1.moveToPoint(cursor.idx, cursor.tail);
                }

                return true;
              }

              if (doExpand()) {
                setTimeout(expandPath, 1000);
              }
            }

            navg1.start();

            expandPath();
          });
          map.setFitView();
        } else {
          this.$message.error("当前暂无轨迹信息");
          var map = new AMap.Map("container", {
            resizeEnable: true,
            zoom: 17
          });
        }
      });
    };
    // 默认获取登录用户当天轨迹数据
    this.getHistoryRoute(
      sessionStorage.userId,
      moment()
        .subtract(1, "days")
        .format("YYYY-MM-DD") + "T23:59:59"
    );
  }
};
</script>

<style lang="less">
@color: #19e1e8;

#track {
  .select-saerch {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 0.7273rem;
    color: @color;
    & > .select {
      display: flex;
      align-items: center;
      color: @color;
    }
    & > .date {
      display: flex;
      align-items: center;
      .title {
        margin-right: 10px;
        margin-left: 20px;
      }
    }
  }
  #container {
    width: 100%;
    height: 90%;
    margin-top: 20px;
  }
  #message_box {
    // display: none;
    position: relative;
    width: 360px;
    padding-bottom: 10px;
    color: #444;
    & > .title_box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      & > div:nth-of-type(1) {
        align-items: center;
        display: flex;

        .name {
          font-size: 18px;
        }
        .acc {
          height: 14px;
          line-height: 14px;
          text-align: center;
          color: #f60;
          font-size: 12px;
          background: #fbede5;
          border-radius: 7px;
          width: 46px;
          margin-left: 8px;
        }
      }
      & > div:nth-of-type(2) {
        font-size: 12px;
      }
    }
    & > .id_state {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-top: 10px;
    }
    & > .location_time {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-size: 14px;
      color: #f60;
      margin-top: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid #f1f1f1;
      & > div:nth-of-type(1) {
        align-items: flex-start;
        display: flex;
        & > img {
          width: 20px;
          height: 18px;
          margin: 0 10px;
        }
        & > .location {
          width: 280px;
          font-size: 16px;
          white-space: pre-wrap;
        }
      }
    }
    & > .value_list {
      display: flex;
      justify-content: space-around;
      margin-top: 4px;
      & > div {
        font-size: 16px;
        text-align: center;
        position: relative;
        & > p {
          font-size: 14px;
          margin: 0;
        }
        & > img {
          position: absolute;
          right: -12px;
          bottom: 3px;
        }
      }
    }
  }
}
</style>