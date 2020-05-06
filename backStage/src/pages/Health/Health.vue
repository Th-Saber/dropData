<template>
  <div id="health">
    <div class="title">健康信息</div>
    <div class="acc_select_box">
      <div class="left">
        设备检测项：
        <div class="device" @click="device.firstState = !device.firstState">
          <div class="deviceTitle">{{device.deviceItem.first+'/'+device.deviceItem.second}}</div>
          <div class="gray">
            <img src="../../assets/imgs/triangle_gray_down.png" alt />
          </div>
          <dl class="selectList" v-show="device.firstState">
            <dd
              v-for="(v,i) in device.itemList"
              :key="i"
              @mouseenter="checkFirst(v.children,v.label,v.value,'device')"
            >{{ v.label }}</dd>
            <dl class="sublist" v-show="device.secondState">
              <dd
                v-for="(item,index) in device.children"
                :key="index+item.label"
                @click="changeSecond(item.label,item.value,'device')"
              >{{ item.label }}</dd>
            </dl>
          </dl>
        </div>&emsp;时间：
        <div
          :class="{time:true,noclick:device.value.first==2}"
          @click="time.timeState = !time.timeState"
        >
          <div>{{time.time}}</div>
          <div class="gray">
            <img src="../../assets/imgs/triangle_gray_down.png" alt />
          </div>
          <dl class="selectList" v-show="time.timeState">
            <dd
              v-for="(v,i) in time.timeList"
              :key="i"
              @click="checkTime(v.label,v.value)"
            >{{ v.label }}</dd>
          </dl>
        </div>
      </div>
      <div class="search">
        <input type="text" v-model="username" placeholder="搜索" />
        <div @click="searchUser">
          <img src="@/assets/imgs/search_icon.png" alt />
        </div>
      </div>
    </div>
    <div class="bottom_box">
      <div class="title">
        <div class="name">
          健康趋势
          <label style="color:#f8f57f">当前对象：{{ nowUser }}</label>
        </div>
      </div>
      <div class="bottom_ecahrts">
        <div id="bottom_ecahrts" ref="bottomEcahrts"></div>
        <div class="item_bar">
          <div class="item" v-for="(v,i) in itemBar" :key="i">
            <div class="color" :style="'background:'+v.color"></div>
            <div class="name">{{ v.name }}</div>
            <div>{{ v.score }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="title_box">
      <div class="title">
        健康信息统计：
        <span>{{ device.deviceItem.first }}</span>
      </div>
      <!-- <div class="export">
        <img src="../../assets/imgs/import.png" alt />&nbsp;导出
      </div>-->
    </div>
    <el-table
      v-show="device.device==1"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData1"
      :style="tabelStale"
      height="18rem"
      @row-click="rowclick"
    >
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="machineId" label="设备ID"></el-table-column>
      <el-table-column prop="score" label="健康分值"></el-table-column>
      <el-table-column prop="ph17" label="血氧%(≥95%)"></el-table-column>
      <el-table-column prop="ph18" label="心率(60~100次/分钟)"></el-table-column>
    </el-table>
    <el-table
      v-show="device.device==2"
      :data="tableData1"
      :style="tabelStale"
      height="18rem"
      @row-click="rowclick"
    >
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="machineId" label="设备ID" width="130px"></el-table-column>
      <el-table-column prop="ph01" label="白细胞"></el-table-column>
      <el-table-column prop="ph02" label="亚硝酸盐"></el-table-column>
      <el-table-column prop="ph03" label="尿胆原"></el-table-column>
      <el-table-column prop="ph04" label="蛋白质"></el-table-column>
      <el-table-column prop="ph05" label="酸碱度"></el-table-column>
      <el-table-column prop="ph06" label="潜血" width="70"></el-table-column>
      <el-table-column prop="ph07" label="比重" width="70"></el-table-column>
      <el-table-column prop="ph08" label="酮体" width="70"></el-table-column>
      <el-table-column prop="ph09" label="胆红素"></el-table-column>
      <el-table-column prop="ph10" label="葡萄糖"></el-table-column>
      <el-table-column prop="ph11" label="抗坏血酸" width="120px"></el-table-column>
      <el-table-column prop="ph12" label="钙" width="50"></el-table-column>
      <el-table-column prop="ph13" label="肌酐" width="70"></el-table-column>
      <el-table-column prop="ph14" label="微量白蛋白" width="120px"></el-table-column>
    </el-table>
    <div class="jumppage">
      <el-pagination
        @current-change="handleCurrentChange"
        background="true"
        pager-count="4"
        :current-page="current"
        :page-size="size"
        layout=" prev, pager, next, total,jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { memberInfoPpage, memberHealthInfo } from "@/apis/api";
import moment from "moment";
import echarts from "echarts";
export default {
  data() {
    return {
      loading: false,
      username: "", //用户搜索
      current: 1, //当前页
      size: 5, //每页请求数
      total: 100, //总数
      nowUser: "", //当前用户
      nowUserid: "", //当前用户id
      tabelStale:
        "width:100%;background:none;border:1px solid #274F60;border-radius:10px 10px 0 0;overflow:auto;font-size:1rem",
      tableData1: [],
      device: {
        deviceItem: {
          first: "生命体征仪",
          second: "血氧饱和度"
        },
        device: "1",
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
      },
      time: {
        timeState: false, //时间选择下拉状态
        time: "一周", //默认时间1
        timeList: [
          {
            value: "1",
            label: "一周"
          },
          {
            value: "2",
            label: "一月"
          },
          {
            value: "3",
            label: "一年"
          }
        ] //时间下拉表
      },
      itemBar: [
        {
          name: "极好",
          color: "#30C340",
          score: "90-100分"
        },
        {
          name: "健康",
          color: "#36A2FC",
          score: "70-89分"
        },
        {
          name: "一般",
          color: "#EEBB4F",
          score: "50-69分"
        },
        {
          name: "较差",
          color: "#C64E5A",
          score: "0-49分"
        }
      ], //分数对照表
      echartsData: {}
    };
  },
  methods: {
    // 查看一级
    checkFirst(children, label, value, key) {
      this[key].firstGrade = label;
      this[key].children = children;
      this[key].secondState = true;
      this[key].value.first = value;
    },
    // change二级
    changeSecond(label, value, key) {
      this[key].deviceItem.first = this[key].firstGrade;
      this[key].deviceItem.second = label;
      this[key].value.second = value;
      this[key].device = this[key].value.first;
      this.time.time = this[key].value.first == "1" ? "一周" : "一年";
      this.getMemberHealthInfo(this.nowUserid, this.device.value.first);
      this.getMemberInfoPpage(
        1,
        this.size,
        this.device.value.first,
        this.username == "" ? null : this.username
      );
    },
    //选择时间
    checkTime(label, value) {
      this.time.time = label;
      this.filterTime(this.echartsData);
    },
    // 换页
    handleCurrentChange(val) {
      this.getMemberInfoPpage(
        val,
        this.size,
        this.device.value.first,
        this.username == "" ? null : this.username
      );
    },
    // 查询用户
    searchUser() {
      this.getMemberInfoPpage(
        1,
        this.size,
        this.device.value.first,
        this.username == "" ? null : this.username
      );
    },
    //某行点击
    rowclick(row, column, event) {
      this.getMemberHealthInfo(row.uid, this.device.value.first);
      this.nowUserid = row.uid;
      this.nowUser = row.name;
    },
    // 获取用户分页信息
    async getMemberInfoPpage(page, size, machineType, username) {
      try {
        this.loading = true;
        let result = (await memberInfoPpage(page, size, machineType, username))
          .data;
        this.tableData1 = result.records;
        this.current = result.current;
        this.total = result.total;
        this.nowUser = result.records[0].name;
        this.nowUserid = result.records[0].uid;
        this.getMemberHealthInfo(
          result.records[0].uid,
          this.device.value.first
        );
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    // 获取用户健康数据
    async getMemberHealthInfo(uid, machineType) {
      let result = (await memberHealthInfo(uid, machineType)).data;
      this.echartsData = result;
      this.filterTime(this.echartsData, this.time.time);
    },
    // 时间过滤
    filterTime(data) {
      switch (this.time.time) {
        case "一周":
          this.filterItem(data.weeks);
          break;
        case "一月":
          this.filterItem(data.months);
          break;
        case "一年":
          if (this.device.value.first == 1) {
            this.filterItem(data.years);
          } else {
            this.filterItem(data.urineYears);
          }
          break;
      }
    },
    filterItem(data) {
      let healthData = data.map(v => {
        return {
          score: v[this.device.value.second + "Score"],
          date: moment(v["createTime"]).format("YYYY-MM-DD HH:mm:ss")
        };
      });
      this.lineEcharts(healthData);
    },
    // 折线
    lineEcharts(lineInfo) {
      const myCharts = echarts.init(this.$refs.bottomEcahrts);
      let options = {
        tooltip: {
          //鼠标悬浮框的提示文字
          trigger: "axis",
          formatter: "日期：{b0}<br />平均指数：{c0}",
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
          left: "4.5%",
          top: "4.5%",
          height: "85%",
          width: "95%"
        },
        xAxis: [
          {
            //x轴坐标数据
            type: "category",
            boundaryGap: true,
            data: lineInfo.map(v => {
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
            data: lineInfo.map(v => {
              return v.score;
            })
            // smooth: true
          }
        ],
        visualMap: {
          top: 10,
          right: 10,
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
  mounted() {
    this.getMemberInfoPpage(
      this.current,
      this.size,
      this.device.value.first,
      null
    );
    // this.getMemberHealthInfo(
    //   this.tableData1[0].uid,
    //     this.device.value.first,
    // )
  }
};
</script>

<style lang="less">
@white: #e8eaed;
@blue: #81fffb;
#health {
  width: 100%;
  height: 100%;
  .noclick {
    pointer-events: none;
  }
  & > .title {
    height: 2.5rem;
    width: 10.18%;
    color: @blue;
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(#1c4364 0%, #0a1127 100%);
    border: 1px solid #4c9db7;
    border-top-left-radius: 12px;
  }
  & > .acc_select_box {
    display: flex;
    color: @blue;
    justify-content: space-between;
    align-items: center;
    margin-top: 1%;
    margin-bottom: 1%;
    width: 100%;
    .left {
      display: flex;
      width: 50%;
      align-items: center;
      & > .device {
        width: 28%;
        height: 20px;
        background: #fff;
        text-indent: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #000;
        font-size: 0.875rem;
        position: relative;
        z-index: 30;
        margin-right: 3%;
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
            z-index: 30;
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
        .gray {
          height: 18px;
          width: 18px;
          background: #fafafa;
          border: 1px solid #747474;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      & > .time {
        height: 20px;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #000;
        background: #fff;
        font-size: 0.875rem;
        width: 10%;
        text-indent: 4px;
        white-space: nowrap;
        z-index: 30;
        &:hover {
          cursor: pointer;
        }
        .selectList {
          text-indent: 5px;
          position: absolute;
          top: 100%;
          background: #fff;
          color: #174162;
          width: 100%;
          border-radius: 5px;
          border: 1px solid #4b97a4;
          & > dd {
            &:hover {
              background: #174162;
              color: #fff;
              border-radius: 5px;
            }
          }
        }
        & > .gray {
          height: 18px;
          width: 18px;
          background: #fafafa;
          border: 1px solid #747474;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    & > .search {
      border-radius: 5px;
      height: 1.875rem;
      display: flex;
      align-items: center;
      border-radius: 5px;
      overflow: hidden;
      & > input {
        width: 20rem;
        outline: none;
        border: none;
        height: 100%;
        text-indent: 12px;
      }
      & > div {
        background: #f5f5f5;
        height: 1.875rem;
        width: 1.875rem;
        display: flex;
        align-items: center;
        justify-content: center;
        & > img {
          transform: scale(1.5);
        }
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  & > .bottom_box {
    width: 100%;
    height: 36%;

    border: 1px solid #4b97a4;
    border-radius: 5px 5px 0 0;

    .title {
      width: calc(100% - 20px);
      padding: 0 10px;
      display: flex;
      align-items: center;
      height: 11.2%;
      border-bottom: 1px solid #4b97a4;
      background: linear-gradient(#1c4364 0%, #0a1127 100%);
      border-radius: 5px 5px 0 0;
      .name {
        font-size: 1rem;
        flex-grow: 1;
        color: @blue;
      }
    }
    .bottom_ecahrts {
      width: 100%;
      height: 88.8%;
      display: flex;
      #bottom_ecahrts {
        height: 100%;
        width: 88%;
      }
      .item_bar {
        padding-top: 1%;

        flex-grow: 1;
        font-size: 0.875rem;
        color: @white;
        .item {
          display: flex;
          width: 100%;
          margin: 0 auto 5%;
          align-items: center;

          .color {
            width: 0.875rem;
            height: 0.875rem;
            margin-left: 10%;
          }
          .name {
            width: 30%;
            text-align: center;
          }
        }
      }
    }
  }
  & > .title_box {
    width: 100%;
    display: flex;
    margin-top: 1%;
    margin-bottom: 1%;
    font-size: 1rem;
    justify-content: space-between;
    align-items: centers;
    & > .title {
      height: 100%;
      color: @blue;
      font-size: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      & > span {
        color: #f8f57f;
      }
    }
    & > .export {
      display: flex;
      align-items: center;
      color: @blue;
      font-size: 1rem;
      &:hover {
        cursor: pointer;
      }
    }
  }
  & > .jumppage {
    width: 100%;
    text-align: center;
    margin-top: 1rem;
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background: #1c4364;
      color: @blue;
    }
    .el-pagination span:not([class*="suffix"]) {
      color: @white;
    }
    .number {
      &:hover {
        color: #1c4364;
      }
    }
    .el-pagination.is-background .el-pager li:not(.disabled):hover {
      color: #1c4364;
    }
  }
  .el-table th,
  .el-table tr {
    background: none;
    color: @white;
  }
  .el-table th {
    background: linear-gradient(#1c4364 0%, #0a1127 100%);
  }
  .el-table th.is-leaf {
    border-bottom: 1px solid @blue;
    padding: 2px 0;
    color: @blue;
  }
  .el-table th,
  .el-table td {
    border-bottom: 1px solid #183758;
  }
  .el-table .cell {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: rgba(21, 43, 72, 0.473);
  }
  .el-table [class*="el-table__row--level"] .el-table__expand-icon {
    color: #fff;
  }
  .el-table::before {
    height: 0;
  }
}
</style>