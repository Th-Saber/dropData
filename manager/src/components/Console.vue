<template>
  <div class="console">
    <!-- 头部 -->
    <div class="con_top">
      <div class="con_top_menu">
        <div class="top_text" @click="backWork">{{ title }}</div>
        <div class="time">{{ timeOut }}</div>
        <div class="user_info">
          <div>
            <span class="span"
              >{{ $store.state.userdata.status | usertype }}：</span
            >{{ $store.state.userdata.nam }}
          </div>
          <div>
            <span class="span">所属部门：</span
            >{{ $store.state.userdata.dName | workname }}
          </div>
        </div>
      </div>
      <!-- <img :src="titleImg" alt="图片" /> -->
    </div>
    <!-- 统计数据 -->
    <div class="info_data_box">
      <div class="info_box" v-for="(v, i) in infoData" :key="i + v.title">
        <div>{{ v.title }}</div>
        <div>{{ v.data }}</div>
      </div>
    </div>
    <!-- 统计图 -->
    <div class="record_map">
      <div class="record_left_box">
        <!-- 扇形图 -->
        <div class="pie_data">
          <p>综合趋势</p>
          <ve-ring
            :data="chartDataPie"
            :data-empty="chartDataPie.dataEmpty"
            :settings="pieSetting.chartSettingsRing"
            :legend="pieSetting.legend"
            :series="pieSetting.series"
            width="400px"
            height="300px"
          ></ve-ring>
        </div>
        <!-- 折线图 -->
        <div class="line_data">
          <p>得分趋势</p>
          <ve-line
            :data="chartDataLine"
            :data-empty="chartDataLine.dataEmpty"
            :grid="lineSetting.grid"
            :xAxis="lineSetting.xAxis"
            :yAxis="lineSetting.yAxis"
            :legend-visible="false"
            :settings="lineSetting.chartSettings"
            width="500px"
            height="380px"
          ></ve-line>
        </div>
      </div>
      <!-- 地图 -->
      <div class="bg_box">
        <div id="container" class="map_box"></div>
      </div>
      <!-- 右边数据 -->
      <div class="right_data_box">
        <div class="right_data" v-for="item in dataCom" :key="item + 'right'">
          <div class="data_title">
            <span>{{item.name}}</span>
          </div>
          <div class="data_menu">
            <table>
              <thead>
                <tr>
                  <th><span>区域</span></th>
                  <!-- quest -->
                  <th><span>抽查数</span></th>
                  <th><span>整改数</span></th>
                  <th><span>{{item.title==='ranking'?'满意率':'问题数'}}</span></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(v, i) in item.data" :key="i + item.title">
                  <td>
                    <el-tooltip effect="dark" :content="v.dname" placement="top">
                      <div class="item_span">{{ v.dname }}</div>
                    </el-tooltip>
                    <!-- {{ v.dname }} -->
                  </td>
                  <td>{{ v.excelCount }}</td>
                  <td>{{ v.modifyCount }}</td>
                  <td>{{ item.title==='ranking'?(v.buyBranch*100).toFixed(2)+'%':v.noGoodCount}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import VePie from "v-charts/lib/pie.common";
import VeLine from "v-charts/lib/line.common";
import VeRing from "v-charts/lib/ring.common";
import { findPolyline, findRanking } from "@api";
export default {
  components: { VePie, VeLine, VeRing },
  data() {
    this.lineSetting = {
      // 主配置项
      chartSettings: {
        labelMap: {
          excelCount:"录件数",
          checkCount:"抽查数",
          gobackCount:"满意数"
        }
      },
      // 大网格线
      grid: {
        right: 20,
        top: 30
      },
      //横轴配置
      xAxis: {
        type: "time",
        // 网格线
        splitLine: {
          show: true,
          lineStyle: {
            width: 0
          }
        },
        //轴线文本
        axisLabel: {
          color: "#65d9ed"
        },
        // 轴线
        axisLine: {
          lineStyle: {
            color: "#2288C7",
            width: 2
          }
        }
      },
      // 纵轴配置
      yAxis: {
        // 网格线
        splitLine: {
          show: true,
          lineStyle: {
            width: 0
          }
        },
        //轴线文本
        axisLabel: {
          color: "#65d9ed"
        },
        // 轴线
        axisLine: {
          show: true,
          lineStyle: {
            color: "#2288C7",
            width: 2
          }
        }
      }
    };
    // 玫瑰图
    this.pieSetting = {
      chartSettingsRing: {
        roseType: "radius",
        label: {
          color: "#65d9ed"
        },
        offsetY: 130
      },
      // 文本
      legend: {
        textStyle: {
          color: "#65d9ed"
        },
        top: "bottom"
      }
    };
    return {
      title: "成华作风监督评议系统",
      infoData: [
        { title: "录件数", data: 1320 },
        { title: "抽查数", data: 1527 },
        { title: "问题数", data: 1931 }
      ],
      // 折线图搜索
      lineSearch: {
        beginTime: moment()
          .subtract(1, "month")
          .format("YYYY-MM-DD 00:00:00"),
        endTime: moment().format("YYYY-MM-DD HH:mm:ss")
      },
      // 排名表格数据
      rankingData: [],
      // 问题表格数据
      questData: [],
      // 扇形图
      chartDataPie: {
        columns: ["日期", "访问用户"],
        rows: [
          { 日期: "录件率", 访问用户: 2792 },
          { 日期: "抽查率", 访问用户: 1723 },
          { 日期: "回复率", 访问用户: 2530 },
          { 日期: "满意率", 访问用户: 2100 },
          { 日期: "整改率", 访问用户: 1560 }
        ],
        dataEmpty: false
      },
      // 折线图
      chartDataLine: {
        columns: ["time", "excelCount", "checkCount", "gobackCount"],
        rows: [],
        dataEmpty: false
      }
    };
  },
  methods: {
    //折线图方法
    RankChatFn() {
      let { lineSearch } = this;
      axios
        .all([findRanking({ ...lineSearch, wasDesc: true }),
          findRanking({ ...lineSearch, wasDesc: false })])
        .then(
          axios.spread((RankTrue,RankFalse) => {
            // 两个请求现在都执行完成
            // console.log(RankTrue.data,RankFalse.data)
            this.rankingData = RankTrue.data
            this.questData = RankFalse.data
          })
        )
        .catch(error => {
          console.log(error);
        });
    },
    setFnChart() {
      let { lineSearch } = this;
      axios
        .all([findPolyline(lineSearch)])
        .then(
          axios.spread(Polyline => {
            // 两个请求现在都执行完成
            // console.log("数据", Polyline.data);
            this.chartDataLine.rows = Polyline.data;
            this.chartDataLine.dataEmpty = Polyline.data > 0 ? false : true;
          })
        )
        .catch(error => {
          console.log(error);
        });
    },
    // 获取高德地图实例
    afterSet(echarts) {
      this.map = new AMap.Map("container", {
        zoom: 12.45,
        center: [104.153, 30.682187],
        pitch: 0,
        viewMode: "3D",
        //设置地图背景图
        mapStyle: "amap://styles/40035571fa9fdd05a26fe1b05f48fdc9"
      });
      var marker = new AMap.Marker({
        icon: "https://vdata.amap.com/icons/b18/1/2.png",
        position: [104.108958, 30.665187],
        title: "成华区纪检委"
      });
      // 信息窗体的内容
      // infoWindow.open(map,new AMap.LngLat("104.118958", "30.665187"))

      new AMap.DistrictSearch({
        extensions: "all",
        subdistrict: 0
      }).search("成华区", (status, result) => {
        // 外多边形坐标数组和内多边形坐标数组
        var outer = [
          new AMap.LngLat(-360, 90, true),
          new AMap.LngLat(-360, -90, true),
          new AMap.LngLat(360, -90, true),
          new AMap.LngLat(360, 90, true)
        ];
        var holes = result.districtList[0].boundaries;
        var pathArray = [outer];
        pathArray.push.apply(pathArray, holes);
        var polygon = new AMap.Polygon({
          pathL: pathArray,
          //线条颜色，使用16进制颜色代码赋值。默认值为#006600
          strokeColor: "#0B5F6D",
          strokeWeight: 4,
          //轮廓线透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
          strokeOpacity: 0.5,
          //多边形填充颜色，使用16进制颜色代码赋值，如：#FFAA00
          fillColor: "rgb(0,0,0,0)",
          //多边形填充透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
          fillOpacity: 0.1,
          //轮廓线样式，实线:solid，虚线:dashed
          strokeStyle: "solid",
          /*勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效， 此属性在
                    ie9+浏览器有效 取值：
                    实线：[0,0,0]
                    虚线：[10,10] ，[10,10] 表示10个像素的实线和10个像素的空白（如此反复）组成的虚线
                    点画线：[10,2,10]， [10,2,10] 表示10个像素的实线和2个像素的空白 + 10个像素的实
                    线和10个像素的空白 （如此反复）组成的虚线*/
          strokeDasharray: [10, 2, 10]
        });
        polygon.setPath(pathArray);
        this.map.add([polygon, marker]);
        // 绘制点
        this.drawDrop();
      });
    },
    //绘制点标记
    drawDrop() {
      setTimeout(() => {
        var marker1 = new AMap.CircleMarker({
          center: new AMap.LngLat("104.118958", "30.665187"), // 圆心位置
          radius: 10,
          extData: { title: "哈哈哈" } //自定义数据
          // strokeColor:'#ff6600',
          // fillColor:'#409eff'
        });
        AMap.event.addListener(marker1, "mouseover", e => {
          this.drawInfoBox([e.lnglat.lng, e.lnglat.lat], e.target.B.extData);
        });
        AMap.event.addListener(marker1, "mouseout", e => {
          this.infoWindow && this.infoWindow.close();
        });
        // 添加修改
        this.map.add([marker1]);
      }, 3000);
    },
    // 绘制地图信息框
    drawInfoBox(lnglat, extData) {
      // 数组
      this.infoWindow = new AMap.InfoWindow({
        isCustom: true,
        anchor: "top-left",
        content: `<div class="map_text">${extData.title}</div>`
      });
      this.infoWindow.open(this.map, lnglat);
    },
    // 跳转到工作台
    backWork() {
      this.$router.push("/work");
    }
  },
  computed: {
    // 时间
    timeOut() {
      return moment().format("YYYY年MM月DD日 dddd");
    },
    //右边表格数据
    dataCom(){
      let arr= [
        {title:'ranking',name:'区域排名前五',data:this.rankingData},
        {title:'quest',name:'区域问题前五',data:this.questData},
      ]
      return arr
    }
  },
  filters: {
    usertype(type) {
      switch (type) {
        case "ADMIN":
          return "管理员";
        case "EXCEL":
          return "录件人员";
        case "QUERY":
          return "纪工委";
        case "INSPECT":
          return "纪检组";
        case "OFFICE":
          return "委机关";
        default:
          return "游客";
      }
    },
    workname(val) {
      if (val) {
        return val;
      } else {
        return "暂无部门";
      }
    }
  },
  // 实例化地图
  mounted() {
    this.afterSet();
  },
  created() {
    this.setFnChart();
    this.RankChatFn()
  }
};
</script>

<style lang="less" scoped>
@c: #65d9ed;
.console {
  height: 100%;
  background: url("../assets/imgs/console_bg.jpg") no-repeat;
  background-size: cover;

  .bg_box {
    background: url("../assets/imgs/map_bg.png") no-repeat;
    background-size: 100% 100%;
    flex: 1;
    padding: 15px;
    margin: 50px;
    box-sizing: border-box;
    .map_box {
      width: 100%;
      height: 100%;
      border-radius: 20px;
    }
  }
  // 自定义显示框的样式
  /deep/ .map_text {
    text-align: center;
    color: #fff;
    border: 1px solid @c;
    border-radius: 6px;
  }
  // 头部显示信息框
  .con_top {
    height: 80px;
    color: @c;
    background: url("../assets/imgs/console_title_bg.png") no-repeat;
    background-size: 100% 100%;
    padding: 0 30px;
    .con_top_menu {
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 14px;
      .top_text {
        flex: 1;
        cursor: pointer;
        font-size: 30px;
        font-weight: 400;
        align-items: flex-end;
      }
      .time {
        margin-right: 100px;
        margin-bottom: 20px;
      }
      .user_info {
        margin-bottom: 20px;
      }
    }
  }
  //详细信息显示框
  .info_data_box {
    display: flex;
    justify-content: center;
    .info_box {
      background: url("../assets/imgs/info_data_box.png") no-repeat;
      background-size: 100% 100%;
      margin: 0 40px;
      padding: 20px;
      width: 238px;
      height: 88px;
      box-sizing: border-box;
      color: #fff;
      div {
        &:first-child {
          font-size: 18px;
        }
        &:last-child {
          font-size: 30px;
          text-align: right;
        }
      }
    }
  }
  .record_map {
    display: flex;
    margin: 0 20px;
    // 左侧盒子
    .record_left_box {
      .line_data {
        margin-top: 20px;
      }
      p {
        font-size: 22px;
        color: @c;
        margin-bottom: 8px;
      }
    }
    // 右侧盒子
    .right_data_box {
      width: 30%;
      min-width: 536px;
      box-sizing: border-box;
      // 文字提示
      .item_span{
        overflow: hidden;/*超出部分隐藏*/
        text-overflow:ellipsis;/* 超出部分显示省略号 */
        white-space: nowrap;/*规定段落中的文本不进行换行 */
        width:200px;/*需要配合宽度来使用*/
      }
      .right_data {
        height: 344px;
        &:first-child {
          margin: 20px 0;
        }
        .data_title {
          color: #fff;
          font-size: 22px;
          span {
            // cursor: pointer;
            color: @c;
          }
        }
        .data_menu {
          padding: 20px;
          background: url("../assets/imgs/data_box.png") no-repeat;
          background-size: 100% 100%;
          height: 320px;
          box-sizing: border-box;
          table {
            width: 100%;
            text-align: center;
            font-size: 18px;
            thead {
              th {
                height: 60px;
                line-height: 60px;
                min-width: 96px;
                color: #fff;
                span {
                  background: url("../assets/imgs/tip_title.png") no-repeat;
                  background-size: 100% 100%;
                  padding: 10px 20px;
                }
              }
            }
            tbody {
              tr {
                td {
                  height: 40px;
                  line-height: 40px;
                  color: @c;
                  border-bottom: 1px solid #122444;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>