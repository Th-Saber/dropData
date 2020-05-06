<template>
  <div id="point">
    <div class="select-saerch">
      <div class="select">
        <label>成员选择</label>&nbsp;
        <el-select
          v-model="value"
          placeholder="请选择 "
          @change="onSelectedDrug($event)"
          filterable
          class="cover"
        >
          <el-option v-for="item in options" :key="item.uid" :label="item.name" :value="item.uid"></el-option>
        </el-select>
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
import IP, { getIndex } from "@/apis/api";
import moment from "moment";
export default {
  inject: ["reload"],
  data() {
    return {
      options: [], //成员下拉
      value: "", //下拉
      searchInput: "", //搜索
      userList: [] //marker经纬数组
    };
  },
  methods: {
    onSelectedDrug(val) {
      this.userList.forEach(v => {
        if (v.uid == val) {
          this.setcenter(v.longitude, v.latitude);
        }
      });
    }
  },
  created() {},
  mounted() {
    let userData = [];
    getIndex().then(res => {
      console.log(res.data);
      this.options = res.data.family;
      sessionStorage.family = JSON.stringify(res.data.family);
      let userList = (this.userList = res.data.family);
      // 地图实例
      let map = new AMap.Map("container", {
        zoom: 12, //级别
        resizeEnable: true,
        center: [userList[0].longitude, userList[0].latitude], //中心点坐标
        viewMode: "3D" //使用3D视图
      });

      let infoWindow = new AMap.InfoWindow();
      for (let i = 0; i < userList.length; i++) {
        // 设置marker头像
        console.log(userList[i]);
        let markerIcon = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(50, 50),
          // 图标的取图地址

          image: `${
            userList[i].imageUrl == undefined
              ? require("../../assets/imgs/avatar.png")
              : "http://duai-maney-images.oss-cn-beijing.aliyuncs.com/" +
                userList[i].imageUrl
          }`,
          // 图标所用图片大小
          imageSize: new AMap.Size(50, 50)
        });
        // 设置marker
        let marker = new AMap.Marker({
          position: [userList[i].longitude, userList[i].latitude],
          icon: markerIcon,
          map: map
        });
        // 逆地理编码获取地址
        AMap.plugin("AMap.Geocoder", function() {
          var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: "010"
          });

          var lnglat = [userList[i].longitude, userList[i].latitude];

          geocoder.getAddress(lnglat, function(status, result) {
            if (status === "complete" && result.info === "OK") {
              // result为对应的地理位置详细信息
              userList[i]["address"] = result.regeocode.formattedAddress;
            }
          });
        });
        setTimeout(() => {
          marker.content = `<div id="message_box">
      <div class="title_box">
        <div>
          <div class="name">${userList[i].name}</div>
          <div class="acc">${
            userList[i].isMaster == true ? "主账户" : "成员"
          }</div>
        </div>
        <div>
        ${moment(userList[i].createTime).format("YYYY-MM-DD")}
        </div>
      </div>
      <div class="id_state">
        <div>Tel:${userList[i].phone}</div>
        <div>
          设备状态：
          <label class="state">${
            userList[i].deviceStatus == 1 ? "在线" : "离线"
          }</label>
        </div>
      </div>
      <div class="location_time">
        <div>
          <img src=${require("../../assets/imgs/map.png")} alt />
          <div class="location">${userList[i].address}</div>
        </div>
        <div>
        ${moment(userList[i].createTime).format("HH:mm:ss")}
        </div>
      </div>
      <div class="value_list">
        <div>
       <div> 血氧(Sa02)</div>

          ${userList[i].bloodOxygenConcentration}
         <img src="${require("../../assets/imgs/up.png")}" style="${
            userList[i].compare.bloodOxygenConcentration == 1
              ? ""
              : "display:none"
          }"/>
          <img src="${require("../../assets/imgs/down.png")}" style="${
            userList[i].compare.bloodOxygenConcentration == -1
              ? ""
              : "display:none"
          }"/>
        </div>
        <div>
         <div>  脉搏(次)  </div> 

          ${userList[i].heartRate}
         <img src="${require("../../assets/imgs/up.png")}" style="${
            userList[i].compare.heartRate == 1 ? "" : "display:none"
          }"/>
          <img src="${require("../../assets/imgs/down.png")}" style="${
            userList[i].compare.heartRate == -1 ? "" : "display:none"
          }"/>
        </div>
        <div>
             <div>  温度(℃)  </div> 

          ${userList[i].temperature}
          <img src="${require("../../assets/imgs/up.png")}" style="${
            userList[i].compare.temperature == 1 ? "" : "display:none"
          }"/>
          <img src="${require("../../assets/imgs/down.png")}" style="${
            userList[i].compare.temperature == -1 ? "" : "display:none"
          }"/>
        </div>
        <div>
             <div>  海拔(m) </div> 

          ${userList[i].height}
     <img src="${require("../../assets/imgs/up.png")}" style="${
            userList[i].compare.height == 1 ? "" : "display:none"
          }"/>
          <img src="${require("../../assets/imgs/down.png")}" style="${
            userList[i].compare.height == -1 ? "" : "display:none"
          }"/>
        </div>
      </div>
    </div>`;
        }, 500);
        marker.on("mouseover", infoOpen);
        //marker.emit('mouseover', {target: marker});
        marker.on("mouseout", infoClose);
        marker.on("mouseover", newMAp);
      }
      this.setcenter = function(a, b) {
        map.setCenter([a, b]);
      };
      //鼠标点击事件,设置地图中心点及放大显示级别
      function newMAp(e) {
        map.setCenter(e.target.getPosition());
        map.setZoomAndCenter(15, e.target.getPosition());

        var infoWindow = new AMap.InfoWindow({
          isCustom: true, //是否自定义信息窗体
          offset: new AMap.Pixel(220, 0) //偏移量
        });
        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition());
      }

      function infoClose(e) {
        // infoWindow.close(map, e.target.getPosition());
        map.clearInfoWindow();
      }
      function infoOpen(e) {
        // box.style.display = "block";

        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition());
      }
      map.setFitView();
    });
  }
};
</script>

<style lang="less">
@color: #19e1e8;
#point {
  color: #fff;
  .select-saerch {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > .select {
      display: flex;
      align-items: center;
      color: @color;
      font-size: 0.7273rem;
    }
  }
  #container {
    width: 100%;
    height: 90%;
    margin-top: 20px;
  }
  #message_box {
    // display: none;
    width: 350px;
    // background: url("../../assets/imgs/message_box.png") no-repeat;
    background: #fffeef;
    border-radius: 10px;
    // border: 1px solid #444;
    background-size: 100% 100%;
    padding: 10px 15px;
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
      .state {
        color: #4ebd8d;
      }
    }
    & > .location_time {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-size: 14px;
      color: #f60;
      margin-top: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(97, 90, 27, 0.486);
      & > div:nth-of-type(1) {
        align-items: flex-start;
        display: flex;
        & > img {
          width: 18px;
          height: 16px;
          margin-right: 10px;
        }
        & > .location {
          width: 250px;
          font-size: 16px;
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
        & > div {
          font-size: 14px;
          margin-bottom: 4px;
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