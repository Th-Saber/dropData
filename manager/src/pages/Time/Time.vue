<template>
  <div id="time">
    <div class="check_bar">
      成员：
      <el-select v-model="uid" placeholder="请选择" @change="checkUser">
        <el-option v-for="item in userlist" :key="item.uid" :label="item.name" :value="item.uid"></el-option>
      </el-select>&emsp;&emsp;&emsp;日期：
      <el-select v-model="searchDate" placeholder="请选择" @change="checkTime">
        <el-option v-for="item in timelist" :key="item.time" :label="item.name" :value="item.time"></el-option>
      </el-select>
    </div>
    <br />
    <div class="title">计次数据</div>
    <br />
    <div class="box">
      <div class="table">
        <div class="list">
          <div
            :class="{item:true, scale:slectedNum==i}"
            v-for="(v,i) in userInfos"
            :key="i"
            :style="`background:${backgroundColor(v.score)}`"
            @click="checkItem(v,i)"
          >
            <div class="title">
              <div>{{ v.name }}</div>
              <div>{{ v.createTime }}</div>
            </div>
            <div class="item_main">
              <div v-show="v.score != -1">时长</div>
              <div v-show="v.score != -1">{{v.timingCount}}</div>
              <div v-show="v.score == -1">无数据</div>
            </div>
          </div>
        </div>
        <div class="echarts_bar"></div>
      </div>
      <div class="title1">生命检测仪数据分析：刘虎虎</div>
      <div class="echarts_box">
        <div class="echrats_box1">
          <div class="title">血氧(Sa02)</div>
          <div class="echarts" ref="echratsBox1"></div>
        </div>
        <div class="echrats_box2">
          <div class="title">心率(次/分)</div>
          <div class="echarts" ref="echratsBox2"></div>
        </div>

        <div class="score_box">
          <div class="score_item" v-for="(v,i) in scoreList" :key="i">
            <div class="color" :style="`background:${v.color}`"></div>&emsp;
            <div>{{ v.text }}</div>&emsp;&emsp;
            <div>{{ v.score }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fetchTimingStatistics,
  fetchTimingSegmentInfosByUser,
  fetchTimingInfosByUser,
  fetchTimingInfosBySegmentId
} from "@/apis/api";
import echarts from "echarts";
import moment from "moment";
export default {
  data() {
    return {
      slectedNum: 0,
      userlist: [],
      uid: "",
      timelist: [],
      scoreList: [
        {
          color: "#30C340",
          text: "极好",
          score: "90分~100分"
        },
        {
          color: "#38A9FC",
          text: "健康",
          score: "70分~89分"
        },
        {
          color: "#EEBB4F",
          text: "一般",
          score: "50分~69分"
        },
        {
          color: "#E2463D",
          text: "极差",
          score: "<50分"
        }
      ], //检测分数指示
      searchDate: "",
      list: [
        {
          heartRate: 70,
          bloodOxygenConcentration: 90,
          createTime: "2019-11-20T16:20:24",
          oxygenScore: 90,
          heartScore: 90
        },
        {
          heartRate: 70,
          bloodOxygenConcentration: 90,
          createTime: "2019-11-20T16:20:22",
          oxygenScore: 90,
          heartScore: 90
        },
        {
          heartRate: 70,
          bloodOxygenConcentration: 90,
          createTime: "2019-11-20T16:20:21",
          oxygenScore: 90,
          heartScore: 90
        },
        {
          heartRate: 70,
          bloodOxygenConcentration: 90,
          createTime: "2019-11-20T16:20:20",
          oxygenScore: 90,
          heartScore: 90
        },
        {
          heartRate: 70,
          bloodOxygenConcentration: 90,
          createTime: "2019-11-20T16:20:19",
          oxygenScore: 90,
          heartScore: 90
        },
        {
          heartRate: 70,
          bloodOxygenConcentration: 90,
          createTime: "2019-11-20T16:20:18",
          oxygenScore: 90,
          heartScore: 90
        },
        {
          heartRate: 70,
          bloodOxygenConcentration: 90,
          createTime: "2019-11-20T16:20:17",
          oxygenScore: 90,
          heartScore: 90
        },
        {
          heartRate: 70,
          bloodOxygenConcentration: 90,
          createTime: "2019-11-20T16:20:16",
          oxygenScore: 90,
          heartScore: 90
        },
        {
          heartRate: 70,
          bloodOxygenConcentration: 90,
          createTime: "2019-11-20T16:20:15",
          oxygenScore: 90,
          heartScore: 90
        },
        {
          heartRate: 70,
          bloodOxygenConcentration: 90,
          createTime: "2019-11-20T16:20:14",
          oxygenScore: 90,
          heartScore: 90
        },
        {
          heartRate: 70,
          bloodOxygenConcentration: 90,
          createTime: "2019-11-20T16:20:13",
          oxygenScore: 90,
          heartScore: 90
        },
        {
          heartRate: 70,
          bloodOxygenConcentration: 90,
          createTime: "2019-11-20T16:20:12",
          oxygenScore: 90,
          heartScore: 90
        },
        {
          heartRate: 70,
          bloodOxygenConcentration: 90,
          createTime: "2019-11-20T16:20:11",
          oxygenScore: 90,
          heartScore: 90
        },
        {
          heartRate: 70,
          bloodOxygenConcentration: 90,
          createTime: "2019-11-20T16:20:10",
          oxygenScore: 90,
          heartScore: 90
        },
        {
          heartRate: 70,
          bloodOxygenConcentration: 90,
          createTime: "2019-11-20T16:20:09",
          oxygenScore: 90,
          heartScore: 90
        }
      ],
      list1: [
        {
          name: "新用户",
          score: -1,
          timingCount: 0,
          uid: 1,
          createTime: "12:30"
        },
        {
          name: "新用户",
          score: 30,
          timingCount: 0,
          uid: 2,
          createTime: "12:30"
        },
        {
          name: "阿萨德",
          score: 65,
          timingCount: 5000,
          uid: 9,
          createTime: "12:30"
        },
        {
          name: "新用户",
          score: 75,
          timingCount: 0,
          uid: 2,
          createTime: "12:30"
        },
        {
          name: "阿萨达",
          score: -1,
          timingCount: 899,
          uid: 3,
          createTime: "12:30"
        },
        {
          name: "新用户",
          score: 90,
          timingCount: 500,
          uid: 9,
          createTime: "12:30"
        },
        {
          name: "新用户",
          score: 71,
          timingCount: 0,
          uid: 2,
          createTime: "12:30"
        },
        {
          name: "新用户",
          score: 90,
          timingCount: 1000,
          uid: 1,
          createTime: "12:30"
        },
        {
          name: "新用户",
          score: 85,
          timingCount: 0,
          uid: 1,
          createTime: "12:30"
        }
      ],
      userInfos: [],
      timingInfo: []
    };
  },
  methods: {
    checkItem(v, i) {
      this.slectedNum = i;
      console.log("asdasdasdasd", v, i);
      if (v.name != undefined) {
        if (v.score != -1) {
          this.getFetchTimingInfosByUser(this.searchDate, v.uid);
        } else {
          this.$message.error("当前时间暂无记录");
        }
      } else {
        this.getFetchTimingInfosBySegmentId(v.endTimingId, v.times, this.uid);
      }
    },
    // 背景色筛选
    backgroundColor(val) {
      if (val >= 90 && val <= 100) {
        return "#30C340";
      } else if (val >= 70 && val < 90) {
        return "#38A9FC";
      } else if (val >= 50 && val < 70) {
        return "#EEBB4F";
      } else if (val >= 0 && val < 50) {
        return "#E2463D";
      } else if (val == -1) {
        return "#CECECE";
      }
    },
    // 时间格式过滤
    timeFilter(arr) {
      arr.forEach(v => {
        if (v.createTime != undefined) {
          v.createTime = moment(v.createTime).format("HH:mm");
          let ss = v.timingCount % 60;
          let mm = Math.floor(v.timingCount / 60);
          let hh = Math.floor(v.timingCount / 60 / 60);
          v.timingCount = `${hh < 10 ? "0" + hh : hh}:${
            mm < 10 ? "0" + mm : mm
          }:${ss < 10 ? "0" + ss : ss}`;
        }
      });
      return arr;
    },
    // id查询最新消息
    async getFetchTimingInfosByUser(searchDate, uid) {
      try {
        let res = await fetchTimingInfosByUser(searchDate, uid);
        console.log(res);
        this.timingInfo = res.data;
        this.initEcharts(this.timingInfo);
        this.initEcharts1(this.timingInfo);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    // 获取页面信息
    async getFetchTimingStatistics(searchDate) {
      let res = (await fetchTimingStatistics(searchDate)).data;
      res.userInfos = this.timeFilter(res.userInfos);
      this.timingInfo = res.timingInfo;
      this.userInfos = res.userInfos;
      this.initEcharts(this.timingInfo);
      this.initEcharts1(this.timingInfo);
      console.log(123132132121, res);
    },
    // 获取具体段的详情信息
    async getFetchTimingInfosBySegmentId(segmentId, limit, uid) {
      try {
        let res = await fetchTimingInfosBySegmentId(segmentId, limit, uid);

        this.timingInfo = res.data;
        this.initEcharts(this.timingInfo);
        this.initEcharts1(this.timingInfo);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    // 根据id日期查询计时
    async getFetchTimingSegmentInfosByUser(searchDate, uid) {
      let res = await fetchTimingSegmentInfosByUser(searchDate, uid);
      this.userInfos = this.timeFilter(res.data);
      this.slectedNum = 0;
      console.log(res);
    },
    //人员列表查询
    checkUser(val) {
      this.getFetchTimingSegmentInfosByUser(this.searchDate, val);
    },
    checkTime(val) {
      if (this.uid != "") {
        this.getFetchTimingSegmentInfosByUser(val, this.uid);
      } else {
        this.$message.error("请选择成员！");
      }
      console.log(val);
    },
    initEcharts(arr) {
      const myCharts = echarts.init(this.$refs.echratsBox1);
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
          left: "8%",
          top: "4.5%",
          width: "90%",
          height: "85%"
        },
        xAxis: [
          {
            //x轴坐标数据
            type: "category",
            boundaryGap: true,
            data: arr.map(v => {
              return moment(v.createTime).format("YYYY-MM-DD HH:mm:ss");
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
            data: arr.map(v => {
              return v.oxygenScore;
            })
            // smooth: true
          }
        ],
        visualMap: {
          top: 10,
          right: 10,
          // showLabel :true,
          show: false,
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
          textStyle: {
            color: "#12C8CE"
          },
          showLabel: false,
          outOfRange: {
            color: "#999"
          },
          right: "2%"
        }
      };
      myCharts.setOption(options);
    },
    initEcharts1(arr) {
      const myCharts = echarts.init(this.$refs.echratsBox2);
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
          left: "8%",
          top: "4.5%",
          width: "90%",
          height: "85%"
        },
        xAxis: [
          {
            //x轴坐标数据
            type: "category",
            boundaryGap: true,
            data: arr.map(v => {
              return moment(v.createTime).format("YYYY-MM-DD HH:mm:ss");
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
            data: arr.map(v => {
              return v.heartScore;
            })
            // smooth: true
          }
        ],
        visualMap: {
          top: 10,
          right: 10,
          // showLabel :true,
          show: false,
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
          textStyle: {
            color: "#12C8CE"
          },
          showLabel: false,
          outOfRange: {
            color: "#999"
          },
          right: "2%"
        }
      };
      myCharts.setOption(options);
    }
  },
  created() {
    this.userlist = JSON.parse(sessionStorage.family);
    this.searchDate = moment().format("YYYY-MM-DD");
    for (let i = 0; i < 7; i++) {
      let obj = {
        time: moment()
          .subtract(i, "days")
          .format("YYYY-MM-DD"),
        name: moment()
          .subtract(i, "days")
          .format("YYYY-MM-DD")
      };
      this.timelist.push(obj);
    }
    // moment().subtract(10, "days").format("YYYY-MM-DD HH:mm:ss"); //当前时间的前10天时间
    // this.searchDate = moment().format("YYYY-MM-DD");
    this.getFetchTimingStatistics(this.searchDate);
  },
  mounted() {},
  computed: {
    echartsData() {
      return this.timingInfo;
    }
  }
};
</script>

<style lang="less">
@color: #18f7fa;
#time {
  width: 100%;
  height: 100%;
  color: @color;
  font-size: 16px;
  .check_bar {
    display: flex;
    align-items: center;
  }
  & > .title {
    background: url("../../assets/imgs/title_border.png") no-repeat;
    background-size: 100% 100%;
    width: 100px;
    height: 32px;
    line-height: 32px;
    text-align: center;
  }

  .box {
    width: calc(100% - 20px);
    height: calc(100% - 140px);
    background-image: url("../../assets/imgs/big_border.png");
    background-color: rgba(9, 13, 35, 0.336);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding: 10px;
    & > .title1 {
      color: #dedc74;
      font-size: 14px;
    }
    .table {
      width: 100%;
      height: 42%;

      .list {
        width: 100%;
        height: 100%;
        overflow: auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-content: flex-start;
        &:hover {
          cursor: pointer;
        }
        & > .item {
          width: calc(14.2% - 10px);
          height: calc(33.3% - 10px);
          margin: 0 10px 10px 0;
          color: #fafafa;

          & > div {
            padding: 6px;
            width: calc(100% - 12px);
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .title {
            height: calc(40% - 12px);
            background: rgba(0, 0, 0, 0.301);
            & > div:nth-of-type(2) {
              font-size: 16px;
            }
          }
          .item_main {
            height: calc(60% - 12px);
            & > div:nth-of-type(2) {
              font-size: 24px;
            }
          }
        }
        .scale {
          transform: scale(1.05);
          transition: transform 0.5s;
          border: 1px solid #fff;
          zoom: 1.05;
        }
      }
    }
    .echarts_box {
      width: 100%;
      height: 55%;
      display: flex;
      .echrats_box1,
      .echrats_box2 {
        width: 42.5%;
        height: calc(100% - 10px);
        padding-top: 10px;
        & > .title {
          width: 100px;
          height: 24px;
          background: rgba(27, 76, 129, 0.582);
          text-align: center;
          line-height: 24px;
          border-radius: 5px;
          font-size: 14px;
        }
        .echarts {
          height: calc(100% - 24px);
          width: 100%;
        }
      }
      .score_box {
        width: 15%;
        height: 100%;
        .score_item {
          width: 100%;
          display: flex;
          align-items: center;
          font-size: 14px;
          margin-bottom: 20px;
          .color {
            width: 12px;
            height: 12px;
          }
        }
      }
    }
  }
}
</style>