<template>
  <div id="home">
    <div class="top_box">
      <div class="left">
        <div class="item">
          <div class="value">{{ homeInfo.yesterdayReg }}</div>
          <div class="title">昨日新增用户</div>
        </div>
        <div class="item">
          <div class="value">{{ homeInfo.yesterdayOnline }}</div>
          <div class="title">昨日在线用户</div>
        </div>
        <div class="item">
          <div class="value">{{ homeInfo.exchange}}</div>
          <div class="title">产品兑换用户</div>
        </div>
        <div class="item">
          <div class="value">{{ homeInfo.allPeople}}</div>
          <div class="title">用户总人数</div>
        </div>
      </div>
      <div class="center">
        <div class="item">
          <div class="value">{{ homeInfo.msgSize}}</div>
          <div class="title">未处理留言</div>
        </div>
        <div class="check" @click="checkMsg('/message')">查看</div>
      </div>
      <div class="right">
        <div class="item">
          <div class="value">{{ homeInfo.feedbackSize}}</div>
          <div class="title">未读反馈</div>
        </div>
        <div class="check" @click="checkMsg('/feedback')">查看</div>
      </div>
    </div>
    <div class="center_box">
      <div class="left">
        <div class="title">
          <div class="title_text">{{state}}检测状态人数统计</div>
          <div class="device" @click="device.deviceState = !device.deviceState">
            <div class="deviceTitle">{{device.value==1?'生命体征仪':'尿常规检测仪'}}</div>
            <img src="../../assets/imgs/yellow_triangle.png" alt />
            <dl class="selectList" v-show="device.deviceState">
              <dd
                v-for="(v,i) in device.device"
                @click.stop="changeDevice(v.label,v.value)"
                :key="i"
              >{{ v.label }}</dd>
            </dl>
          </div>
        </div>
        <div class="item">
          <div>极好</div>
          <div>{{ pieFilter.fabulous }}人</div>
          <div>{{ (pieFilter.fabulous/pieFilter.count)*100 }}%</div>
        </div>
        <div class="item">
          <div>健康</div>
          <div>{{ pieFilter.health }}人</div>
          <div>{{ (pieFilter.health/pieFilter.count)*100 }}%</div>
        </div>
        <div class="item">
          <div>一般</div>
          <div>{{ pieFilter.general }}人</div>
          <div>{{ (pieFilter.general/pieFilter.count)*100 }}%</div>
        </div>
        <div class="item">
          <div>较差</div>
          <div>{{ pieFilter.different }}人</div>
          <div>{{ (pieFilter.different/pieFilter.count)*100 }}%</div>
        </div>
        <div id="echarts_pie" ref="echartsPie"></div>
      </div>
      <div id="container"></div>
      <div class="right">
        <div class="title">
          <div class="title_text">{{state}}用户男女人数统计</div>
          <div class="select" @click="sort.sortState = !sort.sortState">
            {{sort.sort ==1?'降序':"升序"}}
            <img src="@/assets/imgs/yellow_triangle.png" alt />
            <dl class="selectList" v-show="sort.sortState">
              <dd
                v-for="(v,i) in sort.sortTypes"
                :key="i"
                @click="checkSort(v.label,v.value)"
              >{{ v.label }}</dd>
            </dl>
          </div>
        </div>
        <div class="table">
          <div class="thead">
            <div>地区（省）</div>
            <div>男（人数）</div>
            <div>女（人数）</div>
          </div>
          <div class="tbody">
            <div class="tr" v-for="(v,i) in peopleSort" :key="i">
              <div>{{ v.state }}</div>
              <div>{{ v.man }}</div>
              <div>{{ v.lady }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom_box">
      <div class="title">
        <div class="name">全国设备检测数据趋势分析</div>
        <div class="device" @click="deviceItem.firstState = !deviceItem.firstState">
          <div class="deviceTitle">{{deviceItem.deviceItem.first+'/'+deviceItem.deviceItem.second}}</div>
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
        <!-- 时间选择 -->
        <div :class="{time:true,noclick:time.year}" @click="time.timeState = !time.timeState">
          <div>{{time.time==1?'一周':time.time==2?'一月':'一年'}}</div>
          <img src="../../assets/imgs/yellow_triangle.png" alt />
          <dl class="selectList" v-show="time.timeState">
            <dd
              v-for="(v,i) in time.timeList"
              :key="i"
              @click="checkTime(v.label,v.value)"
            >{{ v.label }}</dd>
          </dl>
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
  </div>
</template>

<script>
import echarts from "echarts";
import moment from "moment";
// import adcode from "@/assets/json/adcode.json";
import { getHome, getHomeLine, getProvinceData } from "@/apis/api";
export default {
  data() {
    return {
      homeInfo: {}, //首页信息
      state: "全国", //默认范围
      peopleCounting: [], //各省人数
      pieInfo: {}, //饼图信息
      device: {
        value: 1,
        device: [
          {
            label: "生命体征仪",
            value: 1
          },
          {
            label: "尿常规检测仪",
            value: 2
          }
        ],
        deviceState: false //设备栏显示状态
      }, //饼图设备选择
      sort: {
        sortState: false, //排序选择列表显示状态
        sort: 1, //默认排序方式
        sortTypes: [
          {
            value: 1,
            label: "降序"
          },
          {
            value: 2,
            label: "升序"
          }
        ] //排序选择列表
      }, //右边列表排序

      time: {
        timeState: false, //时间选择下拉状态
        time: 1, //默认时间1
        year: false,
        timeList: [
          {
            value: 1,
            label: "一周"
          },
          {
            value: 2,
            label: "一月"
          },
          {
            value: 3,
            label: "一年"
          }
        ] //时间下拉表
      }, //折线图时间
      deviceItem: {
        deviceItem: {
          first: "生命体征仪",
          second: "血氧饱和度",
          value: "ph17"
        },
        value: {
          first: "",
          second: ""
        },
        itemList: [
          {
            value: "1",
            label: "生命体征仪",
            children: [
              {
                value: "ph17",
                label: "血氧饱和度"
              },
              {
                value: "ph18",
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
      ] //分数对照表
    };
  },
  methods: {
    // 查看处理消息，处理反馈
    checkMsg(path) {
      this.$router.push(path);
      sessionStorage.dropdatapathname = path;
    },
    // 全国状态设备切换
    changeDevice(label, val) {
      this.device.value = val;
      this.device.deviceState = false;
      this.echartsPie();
    },
    // 右侧排序
    checkSort(label, value) {
      this.sort.sort = value;
    },
    checkTime(label, value) {
      if (this.time.time == value) return;
      this.time.time = value;
      this.getHomeLineInfo(value, this.deviceItem.deviceItem.value);
    },
    // 查看一级
    checkFirst(children, label, value, key) {
      this[key].firstGrade = label;
      this[key].children = children;
      this[key].secondState = true;
      this[key].value.first = value;
    },
    // 查看二级
    changeSecond(label, value, key) {
      if (this.deviceItem.deviceItem.value == value) return;
      if (this[key].firstGrade == "尿常规检测仪") {
        this.time.time = 3;
        this.time.year = true;
      } else {
        this.time.year = false;
        this.time.time = 1;
      }
      this[key].deviceItem.value = value;
      this[key].deviceItem.first = this[key].firstGrade;
      this[key].deviceItem.second = label;
      this[key].value.second = value;

      this.getHomeLineInfo(this.time.time, value);
    },
    // 获取首页信息
    async getHomeInfo() {
      let homeInfo = (await getHome()).data;
      this.homeInfo = homeInfo;
      // 添加省市人数总数
      homeInfo.statePeopleCounts.forEach(v => {
        v["allPeople"] = v.lady + v.man;
      });
      this.peopleCounting = homeInfo.statePeopleCounts;
      this.pieInfo = homeInfo.scoreStatistics;
      this.echartsPie();
    },
    // 获取首页折线图
    async getHomeLineInfo(date, phName) {
      let lineInfo = (await getHomeLine(date, phName)).data;
      this.lineEcharts(lineInfo);
    },
    //获取各省信息
    async getHomemap(province) {
      let mapInfo = (await getProvinceData(province)).data;
      if (mapInfo.statePeopleCounts.length != 0) {
        for (let v of mapInfo.statePeopleCounts) {
          v["allPeople"] = v.man + v.lady;
        }
      } else {
        mapInfo.statePeopleCounts = [
          { lady: 0, man: 0, state: province, allPeople: 0 }
        ];
      }

      this.peopleCounting = mapInfo.statePeopleCounts;
      if (!mapInfo.scoreStatistics) {
        mapInfo["scoreStatistics"] = {
          oxygenCount: 0,
          oxygenDifferent: 0,
          oxygenFabulous: 0,
          oxygenGeneral: 0,
          oxygenHealth: 0,
          urineCount: 0,
          urineDifferent: 0,
          urineFabulous: 0,
          urineGeneral: 0,
          urineHealth: 0
        };
      }
      this.pieInfo = mapInfo.scoreStatistics;
      this.echartsPie();
    },
    // 居中地图
    map() {
      let _this = this;
      //创建地图
      var map = new AMap.Map("container", {
        zoom: 4
      });
      //just some colors
      var colors = [
        "#3366cc",
        "#dc3912",
        "#ff9900",
        "#109618",
        "#990099",
        "#0099c6",
        "#dd4477",
        "#66aa00",
        "#b82e2e",
        "#316395",
        "#994499",
        "#22aa99",
        "#aaaa11",
        "#6633cc",
        "#e67300",
        "#8b0707",
        "#651067",
        "#329262",
        "#5574a6",
        "#3b3eac"
      ];

      AMapUI.load(["ui/geo/DistrictExplorer", "lib/$"], function(
        DistrictExplorer,
        $
      ) {
        //创建一个实例
        var districtExplorer = (window.districtExplorer = new DistrictExplorer({
          eventSupport: true, //打开事件支持
          map: map
        }));

        //当前聚焦的区域
        var currentAreaNode = null;

        //鼠标hover提示内容
        var $tipMarkerContent = $('<div class="tipMarker top"></div>');

        var tipMarker = new AMap.Marker({
          content: $tipMarkerContent.get(0),
          offset: new AMap.Pixel(0, 0),
          bubble: true
        });

        //根据Hover状态设置相关样式
        function toggleHoverFeature(feature, isHover, position) {
          tipMarker.setMap(isHover ? map : null);
          if (!feature) {
            return;
          }

          var props = feature.properties;

          if (isHover) {
            //更新位置
            tipMarker.setPosition(position || props.center);
            for (let v of _this.peopleCounting) {
              if (v.state == props.name) {
                $tipMarkerContent.html(
                  `${props.name}<br/>当前用户：${v.allPeople}人`
                );
                break;
              } else {
                $tipMarkerContent.html(`${props.name}<br/>当前用户：0人`);
              }
            }
          }

          //更新相关多边形的样式
          var polys = districtExplorer.findFeaturePolygonsByAdcode(
            props.adcode
          );
          for (var i = 0, len = polys.length; i < len; i++) {
            polys[i].setOptions({
              fillOpacity: isHover ? 0.5 : 0.2
            });
          }
        }

        //监听feature的hover事件
        districtExplorer.on("featureMouseout featureMouseover", function(
          e,
          feature
        ) {
          toggleHoverFeature(
            feature,
            e.type === "featureMouseover",
            e.originalEvent ? e.originalEvent.lnglat : null
          );
        });

        //监听鼠标在feature上滑动
        districtExplorer.on("featureMousemove", function(e, feature) {
          //更新提示位置
          tipMarker.setPosition(e.originalEvent.lnglat);
        });

        //feature被点击
        districtExplorer.on("featureClick", function(e, feature) {
          var props = feature.properties;

          //如果存在子节点
          if (props.childrenNum > 0 && props.level != "city") {
            //切换聚焦区域
            _this.getHomemap(props.name);
            _this.state = props.name;
            switch2AreaNode(props.adcode);
          }
        });

        //外部区域被点击
        districtExplorer.on("outsideClick", function(e) {
          districtExplorer.locatePosition(
            e.originalEvent.lnglat,
            function(error, routeFeatures) {
              if (routeFeatures && routeFeatures.length > 1) {
                //切换到省级区域
                _this.getHomemap(routeFeatures[1].properties.name);
                _this.state = routeFeatures[1].properties.name;
                switch2AreaNode(routeFeatures[1].properties.adcode);
              } else {
                //切换到全国
                _this.state = "全国";
                _this.getHomeInfo();
                switch2AreaNode(100000);
              }
            },
            {
              levelLimit: 2
            }
          );
        });

        //填充某个节点的子区域列表
        function renderAreaPanel(areaNode) {
          var props = areaNode.getProps();

          var $subBox = $("#area-tree")
            .find('h2[data-adcode="' + props.adcode + '"]')
            .siblings("ul.sublist");

          if ($subBox.attr("data-loaded") === "rendered") {
            return;
          }

          $subBox.attr("data-loaded", "rendered");

          var subFeatures = areaNode.getSubFeatures();
        }

        //绘制某个区域的边界
        function renderAreaPolygons(areaNode) {
          //更新地图视野
          map.setBounds(areaNode.getBounds(), null, null, true);

          //清除已有的绘制内容
          districtExplorer.clearFeaturePolygons();

          //绘制子区域
          districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
            var fillColor = colors[i % colors.length];
            var strokeColor = colors[colors.length - 1 - (i % colors.length)];

            return {
              cursor: "default",
              bubble: true,
              strokeColor: strokeColor, //线颜色
              strokeOpacity: 1, //线透明度
              strokeWeight: 1, //线宽
              fillColor: fillColor, //填充色
              fillOpacity: 0.35 //填充透明度
            };
          });

          //绘制父区域
          districtExplorer.renderParentFeature(areaNode, {
            cursor: "default",
            bubble: true,
            strokeColor: "black", //线颜色
            strokeOpacity: 1, //线透明度
            strokeWeight: 1, //线宽
            fillColor: null, //填充色
            fillOpacity: 0.35 //填充透明度
          });
        }

        //切换区域后刷新显示内容
        function refreshAreaNode(areaNode) {
          districtExplorer.setHoverFeature(null);
          renderAreaPolygons(areaNode);
        }

        //切换区域
        function switch2AreaNode(adcode, callback) {
          if (
            currentAreaNode &&
            "" + currentAreaNode.getAdcode() === "" + adcode
          ) {
            return;
          }

          loadAreaNode(adcode, function(error, areaNode) {
            if (error) {
              if (callback) {
                callback(error);
              }

              return;
            }

            currentAreaNode = window.currentAreaNode = areaNode;

            //设置当前使用的定位用节点
            districtExplorer.setAreaNodesForLocating([currentAreaNode]);

            refreshAreaNode(areaNode);

            if (callback) {
              callback(null, areaNode);
            }
          });
        }

        //加载区域
        function loadAreaNode(adcode, callback) {
          districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
            if (error) {
              if (callback) {
                callback(error);
              }

              console.error(error);

              return;
            }

            renderAreaPanel(areaNode);

            if (callback) {
              callback(null, areaNode);
            }
          });
        }

        //全国
        switch2AreaNode(100000);
      });
    },
    // 左侧饼图
    echartsPie() {
      const myCharts = echarts.init(this.$refs.echartsPie);
      let options = {
        title: {
          subtext: "全国统计",
          x: "left"
        },
        color: ["#2FB85C", "#33ACEB", "#D1B169", "#E2463D"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        legend: {
          bottom: "bottom",
          data: ["极好90-100分", "健康70-89分", "一般50-59分", "较差0-49分"],
          textStyle: {
            color: "#e8eaed"
          }
        },
        series: [
          {
            name: "当前状态",
            type: "pie",
            radius: "50%",
            center: ["50%", "42%"],
            data: [
              { value: this.pieFilter.fabulous, name: "极好90-100分" },
              { value: this.pieFilter.health, name: "健康70-89分" },
              { value: this.pieFilter.general, name: "一般50-59分" },
              { value: this.pieFilter.different, name: "较差0-49分" }
            ],
            labelLine: {
              length: 8,
              length2: 10
            },

            label: {
              normal: {
                position: "outer", // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
                // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
                // {a}指series.name  {b}指series.data的name
                // {c}指series.data的value  {d}%指这一部分占总数的百分比
                formatter: "{b}"
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      myCharts.setOption(options);
    },
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
              return v.avgScore;
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
  computed: {
    // 右侧省市人数排序
    peopleSort() {
      switch (this.sort.sort) {
        case 1:
          let arr = this.peopleCounting;
          for (let j = 0; j < arr.length - 1; j++) {
            //两两比较，如果前一个比后一个大，则交换位置。
            for (let i = 0; i < arr.length - 1 - j; i++) {
              if (arr[i].allPeople < arr[i + 1].allPeople) {
                let temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
              }
            }
          }
          return arr;
          break;
        case 2:
          let arr2 = this.peopleCounting;
          for (let j = 0; j < arr2.length - 1; j++) {
            //两两比较，如果前一个比后一个大，则交换位置。
            for (let i = 0; i < arr2.length - 1 - j; i++) {
              if (arr2[i].allPeople > arr2[i + 1].allPeople) {
                let temp = arr2[i];
                arr2[i] = arr2[i + 1];
                arr2[i + 1] = temp;
              }
            }
          }
          return arr2;
          break;
      }
    },
    pieFilter() {
      switch (this.device.value) {
        case 1:
          return {
            fabulous: this.pieInfo.oxygenFabulous, //极好
            general: this.pieInfo.oxygenGeneral, //一般
            health: this.pieInfo.oxygenHealth, //健康
            different: this.pieInfo.oxygenDifferent, //较差
            count: this.pieInfo.oxygenCount //血氧总人数
          };
          break;
        case 2:
          return {
            fabulous: this.pieInfo.urineFabulous, //极好
            general: this.pieInfo.urineGeneral, //一般
            health: this.pieInfo.urineHealth, //健康
            different: this.pieInfo.urineDifferent, //较差
            count: this.pieInfo.urineCount //尿检总人数
          };
      }
    }
  },
  created() {},
  mounted() {
    this.getHomeInfo(); //获取首页统计信息
    this.getHomeLineInfo(this.time.time, this.deviceItem.deviceItem.value); //获取首页折线图数据
    this.map();
  }
};
</script>

<style lang="less" >
@white: #e8eaed;
@blue: #81fffb;
.tipMarker {
  color: #fff;
  background: dodgerblue;
  white-space: nowrap;
  padding: 10px;
  border-radius: 5px;
}
// top
#home {
  width: 100%;
  height: 100%;
  & > .top_box {
    display: flex;
    width: 100%;
    height: 13.1%;
    justify-content: space-between;

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
    .center,
    .right {
      width: 18.5%;
      height: 100%;
      display: flex;

      .item {
        height: 42%;
        width: 56.5%;
        border-right: 1px solid #4d89b0;
        text-align: center;
      }
      .check {
        flex-grow: 1;
        height: 42%;
        justify-content: center;
        display: flex;
        align-items: center;
        font-size: 1rem;
        color: @blue;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .right {
      width: 18.5%;
      height: 100%;
    }
  }
  & > .center_box {
    width: 100%;
    height: 53.7%;
    justify-content: space-between;
    margin-top: 2%;
    display: flex;
    .left {
      width: 24.6%;
      height: 99.5%;
      align-self: flex-end;
      border: 1px solid #4b97a47c;
      border-radius: 5px 5px 0 0;

      .title {
        background: linear-gradient(#1c4364 0%, #0a1127 100%);
        border-radius: 5px 5px 0 0;
        display: flex;
        justify-content: space-between;
        width: calc(100% - 20px);
        padding: 0 10px;
        height: 5.3%;
        font-size: 0.875rem;
        color: #81fffb;
        align-items: center;
        border-bottom: 1px solid #4b97a479;
        .title_text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .device {
          width: 28%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #e1de77;
          font-size: 0.875rem;
          position: relative;
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
            width: 100%;
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
          }
        }
      }
      .item {
        width: 100%;
        height: 8.2%;
        display: flex;

        align-items: center;
        border-bottom: 1px solid #1e577d;
        color: @white;
        & > div {
          width: calc(100% / 3);
          text-align: center;
        }
      }
      #echarts_pie {
        width: 100%;
        height: 60%;
      }
    }
    #container {
      width: 45.5%;
      height: 97%;
    }
    .right {
      width: 25%;
      height: 96.8%;
      border: 1px solid #4b97a4;
      border-radius: 5px 5px 0 0;
      .title {
        width: calc(100% - 20px);
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 6.1%;
        font-size: 1rem;
        color: @blue;
        border-bottom: 1px solid #4b97a4;
        background: linear-gradient(#1c4364 0%, #0a1127 100%);
        border-radius: 5px 5px 0 0;
        .title_text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .select {
          font-size: 0.875rem;
          position: relative;
          color: #e1de77;
          width: 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &:hover {
            cursor: pointer;
          }
          .selectList {
            position: absolute;
            top: 100%;
            width: 100%;
            background: #fff;
            color: #174162;
            border: 1px solid @blue;
            text-indent: 5px;
            border-radius: 5px;
            & > dd {
              &:hover {
                background: #174162;
                color: #fff;
                border-radius: 5px;
              }
            }
          }
        }
      }
      .table {
        width: 100%;
        height: 93.5%;
        font-size: 1rem;
        .thead {
          display: flex;
          height: 9%;
          width: 100%;
          align-items: center;
          border-bottom: 1px solid #1e577d;
          color: @blue;
          div {
            flex-grow: 1;
            text-align: center;
          }
        }
        .tbody {
          width: 100%;
          height: 91%;
          overflow-y: auto;
          .tr {
            width: 100%;
            display: flex;
            align-items: center;
            height: 9.8%;
            border-bottom: 1px solid #1e577d;
            color: @white;
            & > div {
              width: calc(33.3% - 8px);
              padding: 0 4px;
              text-align: center;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
  & > .bottom_box {
    width: 100%;
    height: 28%;
    border: 1px solid #4b97a4;
    border-radius: 5px 5px 0 0;
    margin-top: 0.5%;
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
      .time {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #e1de77;
        font-size: 0.875rem;
        width: 4%;
        white-space: nowrap;
        &:hover {
          cursor: pointer;
        }
        .selectList {
          text-indent: 5px;
          position: absolute;
          z-index: 30;
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
      }
      .device {
        width: 11%;
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
  //禁止点击
  .noclick {
    pointer-events: none;
  }
}
</style>