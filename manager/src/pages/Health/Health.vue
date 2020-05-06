<template>
  <div id="health">
    <div class="service_item_date_search">
      <div class="item">
        <label class="title">成员选择</label>
        <el-select v-model="member" filterable @change="checkMember($event)" placeholder="请选择成员">
          <el-option
            v-for="item in memberList"
            :key="item.uid"
            :label="item.name"
            :value="item.uid"
          ></el-option>
        </el-select>
      </div>
      <div class="service">
        <label class="title">设备/项目选择</label>
        <el-cascader v-model="deviceItem" :options="itemList" @change="handleChange"></el-cascader>
      </div>
      <div class="date">
        <label class="title">时间</label>
        <el-select
          v-model="date"
          placeholder="请选择时间段"
          :disabled="dateState"
          @change="checkTime($event)"
        >
          <el-option v-for="item in time" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
    </div>
    <div class="echarts_title">健康趋势</div>
    <div class="echarts">
      <div id="echarts_container" ref="myCharts"></div>
      <div class="item_bar">
        <div class="title">指数范围</div>
        <ul class="list">
          <li v-for="(v,i) in itemBar" :key="i">
            <div class="color" :style="`background:${v.color}`"></div>
            <label class="name">{{ v.text }}</label>
            <label class="value">{{ v.score }}</label>
          </li>
        </ul>
      </div>
    </div>
    <div class="title_box">
      <div class="health_info_title">健康信息统计</div>
      <div class="import_export">
        <div @click="exportMembersHealthData">
          <img src="../../assets/imgs/export.png" alt /> 导出
        </div>
      </div>
    </div>
    <div class="table">
      <table rules="none">
        <thead>
          <tr v-show="deviceItem[0] ==1">
            <th>用户名</th>
            <th>设备ID</th>
            <th>健康分数</th>
            <th>血氧饱和度</th>
            <th>心率</th>
          </tr>
          <tr v-show="deviceItem[0] ==2">
            <th>用户名</th>
            <th>设备ID</th>
            <th>健康分数</th>
            <th>白细胞</th>
            <th>亚硝酸盐</th>
            <th>尿胆原</th>
            <th>蛋白质</th>
            <th>酸碱度</th>
            <th>潜血</th>
            <th>比重</th>
            <th>酮体</th>
            <th>胆红素</th>
            <th>葡萄糖</th>
            <th>抗坏血酸</th>
            <th>钙</th>
            <th>肌酐</th>
            <th>微量白蛋白</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(v,i) in tableData" :key="i" v-show="deviceItem[0] ==1">
            <td>{{v.name}}</td>
            <td>{{v.deviceId}}</td>
            <td>{{v.score}}</td>
            <td>{{v.ph17}}</td>
            <td>{{v.ph18}}</td>
          </tr>
          <tr v-for="(v,i) in tableData" :key="i" v-show="deviceItem[0] ==2">
            <td>{{v.name}}</td>
            <td>{{v.deviceId}}</td>
            <td>{{v.score}}</td>
            <td>{{v.ph01}}</td>
            <td>{{v.ph02}}</td>
            <td>{{v.ph03}}</td>
            <td>{{v.ph04}}</td>
            <td>{{v.ph05}}</td>
            <td>{{v.ph06}}</td>
            <td>{{v.ph07}}</td>
            <td>{{v.ph08}}</td>
            <td>{{v.ph09}}</td>
            <td>{{v.ph10}}</td>
            <td>{{v.ph11}}</td>
            <td>{{v.ph12}}</td>
            <td>{{v.ph13}}</td>
            <td>{{v.ph14}}</td>
          </tr>
        </tbody>
      </table>
      <img src="../../assets/imgs/rhombus.png" alt class="rhombuss" />
    </div>
    <!-- <div class="jupmPage">
      <el-pagination
        background="true"
        pager-count="4"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        layout=" prev, pager, next,total, jumper"
        :total="400"
      ></el-pagination>
    </div>-->
  </div>
</template>

<script>
// import "./cover.css"; //覆盖样式
import IP, { healthInfo } from "@/apis/api";
import moment from "moment";
import echarts from "echarts";
export default {
  data() {
    return {
      IP,
      memberList: [], //成员下拉list
      member: "", //成员
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
      deviceItem: ["1", "oxygen"], //设备项目,默认
      time: [
        {
          value: 7,
          label: "一周"
        },
        {
          value: 30,
          label: "一月"
        },
        {
          value: 365,
          label: "一年"
        }
      ], //时间段下拉list
      queryHistorys: true, //是否查询历史数据 默认查询
      date: 7, //时间,默认一周
      dateState: false, //日期框禁用状态
      currentPage4: 4, //当前页数
      itemBar: [
        {
          color: "#30C340",
          text: "极好指数范围",
          score: "90分~100分"
        },
        {
          color: "#38A9FC",
          text: "健康指数范围",
          score: "70分~90分"
        },
        {
          color: "#EEBB4F",
          text: "一般指数范围",
          score: "50分~70分"
        },
        {
          color: "#E2463D",
          text: "极差指数范围",
          score: "<50分"
        }
      ], //检测分数指示
      echartsData: [], //ecahrts数据组
      tableData: [] //table数据
    };
  },
  methods: {
    // id查询成员
    checkMember(id) {
      this.date = 7;
      this.getHealthInfo(id, this.deviceItem[0], this.queryHistorys);
    },
    // 选择时间
    checkTime(val) {
      this.getHealthInfo(this.member, this.deviceItem[0], this.queryHistorys);
    },
    exportMembersHealthData() {
      window.open(
        IP +
          `/enterpris/exportMembersHealthData?uid=${this.member}&machineType=${
            this.deviceItem[0]
          }&tkt-user=${sessionStorage.tkt}`
      );
      // downloadHealthData(this.member, this.deviceItem[0]).then(res => {
      //   console.log(res);
      //   downJs(res)
      // });
    },
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    // },
    // handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`);
    // },
    // 切换设备和项目
    handleChange(value) {
      if (value[0] == 2) {
        this.date = 365;
        this.dateState = true;
      } else {
        this.date = 7;
        this.dateState = false;
      }
      this.getHealthInfo(this.member, this.deviceItem[0], this.queryHistorys);
    },
    // 获取健康信息
    getHealthInfo(uid, machineType, queryHistorys) {
      healthInfo(uid, machineType, queryHistorys).then(res => {
        console.log(res.data.members.records);
        this.tableData = res.data.members.records;
        this.dateFilter(res.data.historyDatas, this.deviceItem[1], this.date);
      });
    },
    //日期过滤
    dateFilter(data, item, date) {
      switch (date) {
        case 7:
          this.itemFilter(data.weeks, item);
          break;
        case 30:
          this.itemFilter(data.months, item);
          break;
        case 365:
          if (this.deviceItem[0] == 1) {
            this.itemFilter(data.years, item);
          } else {
            this.itemFilter(data.urineYears, item);
          }
          break;
      }
    },
    // 项目过滤
    itemFilter(data, item) {
      this.echartsData = data.map(v => {
        return {
          date: moment(v.createTime).format("YYYY-MM-DD HH:mm:ss"),
          value: v[item + "Score"]
        };
      });
      this.initEcharts();
    }
  },

  created() {
    this.memberList = JSON.parse(sessionStorage.family);
    this.member = JSON.parse(sessionStorage.family)[0].uid;
    this.getHealthInfo(this.member, this.deviceItem[0], this.queryHistorys);
  },
  mounted() {
    this.initEcharts = function() {
      const myCharts = echarts.init(this.$refs.myCharts);
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
          left: "4.5%",
          top: "4.5%",
          width: "90%",
          height: "85%"
        },
        xAxis: [
          {
            //x轴坐标数据
            type: "category",
            boundaryGap: true,
            data: this.echartsData.map(v => {
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
            data: this.echartsData.map(v => {
              return v.value;
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
    };
  }
};
</script>

<style lang="less" scoped>
#health {
  width: 100%;
  height: 100%;
  & > .service_item_date_search {
    color: #1ae8ff;
    font-size: 0.7273rem;
    display: flex;
    align-items: flex-end;
    .item,
    .service {
      display: flex;
      align-items: center;
      margin-right: 1.818rem;

      & > .title {
        margin-right: 0.4545rem;
      }
      .el-input__inner {
        height: 1rem;
      }
    }
    .date {
      display: flex;
      align-items: center;
      margin-left: 1.5rem;
      flex-grow: 1;
      & > .title {
        margin-right: 10px;
      }
    }
  }
  & > .echarts_title {
    font-size: 16px;
    color: #1ae8ff;
    margin-top: 1rem;
    background: url("../../assets/imgs/title_border.png") no-repeat;
    background-size: 100% 100%;
    width: 100px;
    text-align: center;
    padding: 8px 0;
  }
  & > .echarts {
    width: 100%;
    height: 16.5rem;
    display: flex;
    #echarts_container {
      width: 72%;
      height: 100%;
      border-radius: 5px;
    }
    .item_bar {
      flex-grow: 1;
      height: 75%;
      background: url("../../assets/imgs/item_bar_border.png") no-repeat;
      background-size: 100% 100%;
      margin-left: 1.3636rem;
      position: relative;
      padding: 1rem 1.2rem;
      & > .title {
        font-size: 0.7273rem;
        color: #1ae8ff;
      }
      & > .list {
        list-style: none;
        padding: 0;
        margin: 15.4px 0 0;
        & > li {
          display: flex;
          align-items: center;
          color: #fff;
          font-size: 0.6364rem;
          .color {
            width: 0.8182rem;
            height: 2rem;
            margin-right: 12px;
          }
          .name {
            flex-grow: 1;
          }
        }
      }
      & > .rhombuss {
        width: 1.2rem;
        height: 0.5455rem;
        position: absolute;
        bottom: 0.5455rem;
        left: 0.9091rem;
      }
    }
  }
  & > .title_box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #1ae8ff;

    & > .health_info_title {
      font-size: 16px;
      margin-top: 1rem;
      background: url("../../assets/imgs/title_border.png") no-repeat;
      background-size: 100% 100%;
      width: 130px;
      text-align: center;
      padding: 8px 0;
    }
    .import_export {
      display: flex;
      & > div {
        height: 0.8182rem;
        display: flex;
        align-items: center;
        font-size: 0.8182rem;
        margin: 0 0.6rem;
        &:hover {
          cursor: pointer;
        }
        & > img {
          height: 0.8182rem;
          margin-right: 2px;
        }
      }
    }
  }
  & > .table {
    width: calc(100% - 20px);
    padding: 10px;
    background: url("../../assets/imgs/table_bar_border.png") no-repeat;
    background-size: 100% 100%;
    position: relative;
    table > tbody > tr,
    table > thead {
      display: table;
      width: 100%;
      table-layout: fixed; /* 重要  表格固定算法 */
    }
    & > table {
      width: 100%;
      font-size: 0.7273rem;
      & > thead {
        width: calc(100% - 8px);
        tr {
          height: 2rem;
          line-height: 2rem;
          color: #fff;
          background: #090d23;
          font-family: fzhtjt;
          th {
            font-weight: 500;
          }
        }
      }
      & > tbody {
        height: 10rem;
        overflow: hidden;
        display: block;
        overflow-y: auto;
        overflow-y: auto;
        tr:nth-child(odd) {
          background: #21344ba9;
        }
        tr:nth-child(even) {
          background: #122339a1;
        }
        tr {
          height: 2rem;
          line-height: 2rem;
          color: #1ae8ff;
          td {
            text-align: center;
          }
        }
      }
    }

    & > .rhombuss {
      position: absolute;
      left: 0.5rem;
      bottom: 0.5rem;
    }
  }
  // & > .jupmPage {
  //   display: flex;
  //   justify-content: center;
  //   margin-top: 0.5rem;
  // }
}
</style>