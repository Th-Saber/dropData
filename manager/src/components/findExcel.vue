<template>
  <div class="excs">
    <div class="findExcel" v-loading="dialogLoad">
      <div class="left">
        <!-- 录件信息 -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基础信息</span>
            <span style="float:right" v-show="dataInfo.checkTime"
              >抽查时间：{{ dataInfo.checkTime }}</span
            >
          </div>
          <div class="card_item">
            <el-row :gutter="20">
              <el-col :span="12">
                <span>录件人姓名：</span>
                <el-input v-model="dataInfo.uname" readonly></el-input>
              </el-col>
              <el-col :span="12">
                <span>录件人电话：</span>
                <el-input v-model="dataInfo.excelTel" readonly></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <span>经办人姓名：</span>
                <el-input v-model="dataInfo.manager" readonly></el-input>
              </el-col>
              <el-col :span="12">
                <span>单位：</span>
                <el-input v-model="dataInfo.dname" readonly></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <span>服务对象姓名：</span>
                <el-input v-model="dataInfo.ename" readonly></el-input>
              </el-col>
              <el-col :span="12">
                <span>服务对象电话：</span>
                <el-input v-model="dataInfo.tel" readonly></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <span>服务事项：</span>
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="暂无数据"
                  readonly
                  v-model="dataInfo.content"
                >
                </el-input>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <!-- 发送短信内容 -->
        <el-card class="box-card2" v-show="dataInfo.sendMsg">
          <div slot="header" class="clearfix">
            <span>发送短信内容</span>
          </div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2 }"
            placeholder="暂无数据"
            readonly
            v-model="dataInfo.sendMsg"
          >
          </el-input>
        </el-card>
        <!-- 发送短信内容 -->
        <el-card class="box-card3" v-show="dataInfo.goBranch">
          <div slot="header" class="clearfix">
            <span>回复信息</span>
            <div style="float:right">
              回复等级：
              <span style="font-size:24px;">
                {{ dataInfo.goBranch | branchCo }}
              </span>
            </div>
          </div>
          <el-input
            type="textarea"
            v-show="dataInfo.goMsg"
            placeholder="暂无数据"
            :autosize="{ minRows: 2 }"
            readonly
            v-model="dataInfo.goMsg"
          >
          </el-input>
        </el-card>
      </div>
      <!-- 右侧卡片组 -->
      <div class="right" v-show="isshowright">
        <!-- 处理日志 -->
        <el-card class="box-card2" v-show="dataInfo.modifyStatus">
          <div slot="header" class="clearfix">
            <span>整改状态</span>
          </div>
          <div
            style="border:1px solid #e9e9e9;padding:10px;border-radius:6px;margin-bottom:20px"
            v-show="dataInfo.modifyStatus"
          >
            <div
              v-for="(v, i) in iconType"
              :key="i + 'excelType'"
              class="icon_type"
              v-show="dataInfo.modifyStatus === v.type"
            >
              <img :src="v.url" width="40px" />
              <span>{{ v.title }}</span>
            </div>
          </div>
        </el-card>
        <!-- 整改备注 -->
        <el-card class="timeLineBox" v-show="showIsTime">
          <div slot="header" class="clearfix">
            提交整改备注：（由整改人员填写）
          </div>
          <el-timeline>
            <el-timeline-item
              v-for="(v, i) in dataInfo.modifyList"
              type="primary"
              :icon="v.type == 1 ? 'el-icon-more' : false"
              :color="v.type == 1 ? false : '#0bbd87'"
              size="large"
              :timestamp="v.createTime"
              placement="top"
              :key="i + 'time'"
            >
              <el-card>
                <p style="display:flex;align-items:center;">
                  <img :src="v.type == 1 ? icon2 : icon1" />{{
                    v.type | filterType
                  }}：
                </p>
                <p>{{ v.content }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
        <!-- 整改备注 -->
        <el-card
          class="right-card2"
          v-if="
            (dataInfo.modifyStatus === 'NOMODIFY' ||
              dataInfo.modifyStatus === 'MODIFY') &&
              userstatus !== 'ADMIN'
          "
        >
          <div slot="header" class="clearfix">
            <span>备注：(整改备注，整改人员填写)</span>
          </div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            placeholder="请输入备注内容"
            v-model="content"
          >
          </el-input>
        </el-card>
        <!-- 管理员备注 -->
        <el-card
          class="right-card2"
          v-if="dataInfo.modifyStatus === 'MODIFY' && userstatus === 'ADMIN'"
        >
          <div slot="header" class="clearfix">
            <span>备注：(审批备注，审批人员填写)</span>
          </div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            placeholder="请输入备注内容"
            v-model="content"
          >
          </el-input>
          <div>审批结果：</div>
          <el-radio-group v-model="status">
            <el-radio label="APPROVAL">通过</el-radio>
            <el-radio label="APPROVALMODIFY">审核整改中</el-radio>
            <el-radio label="NOAPPROVAL">不通过</el-radio>
          </el-radio-group>
        </el-card>
        <!-- 审批结果 -->
        <!-- <el-card style="margin-top:20px;" v-show="dataInfo.approvalContent">
          <div slot="header" class="clearfix">
            审批结果备注：（由审批人员填写）
          </div>
          <el-input
            type="textarea"
            readonly
            v-model="dataInfo.approvalContent"
          ></el-input>
        </el-card> -->
      </div>
    </div>
    <div class="bths">
      <el-button @click="stateDisable = false">取 消</el-button>
      <el-button type="primary" :loading="btnLoad" @click="enterDialog">{{
        dataInfo.modifyStatus | isClose(userstatus)
      }}</el-button>
    </div>
  </div>
</template>

<script>
import {
  findRecordInfo,
  findCheckInfo,
  saveRec,
  updateRec,
  submitCheck,
  commitCheck
} from "@api";
import moment from 'moment'
export default {
  props: {
    eid: Number,
    dialogVisible: Boolean,
    callback: Function,
    wasRead: Boolean,
    check: Boolean
  },
  data() {
    return {
      dialogLoad: true,
      flag: false,
      iconType: [
        {
          type: "NOMODIFY",
          title: "未提交整改",
          url: require("@/assets/imgs/icon_NOMODIFY.png")
        },
        {
          type: "MODIFY",
          title: "审批中",
          url: require("@/assets/imgs/icon_MODIFY.png")
        },
        {
          type: "APPROVAL",
          title: "审批通过",
          url: require("@/assets/imgs/icon_APPROVAL.png")
        },
        {
          type: "NOAPPROVAL",
          title: "审批未通过",
          url: require("@/assets/imgs/icon_NOAPPROVAL.png")
        },
        {
          type: "CHECKM",
          title: "反馈信息1",
          url: require("@/assets/imgs/icon_CHECKM.png")
        },
        {
          type: "WARNINGQ",
          title: "反馈信息2",
          url: require("@/assets/imgs/icon_WARNINGQ.png")
        }
      ],
      icon1: require("@/assets/imgs/excel_icon1.png"),
      icon2: require("@/assets/imgs/excel_icon2.png"),
      stateDisable: true,
      btnLoad: false,
      userstatus: "",
      content: "",
      status: "", //审批结果
      nowStatus: "", //最终审批结果
      dataInfo: {} //录件信息
    };
  },
  watch: {
    dialogVisible(newVal, oldVal) {
      this.stateDisable = newVal;
    },
    // 监听本组件内值变化
    stateDisable(newVal, oldVal) {
      this.$emit("update:dialogVisible", newVal);
    }
  },
  methods: {
    async searchData() {
      try {
        if (this.check) {
          let res = await findCheckInfo(this.eid, this.wasRead);
          this.dialogLoad = false;
          if(res.data.sendMsg){
            let str1=res.data.sendMsg.replace('[称呼]',res.data.ename.slice(0,1)+(res.data.sex==='M'?'先生':'女士'));
            let str2=str1.replace('[时间]',moment(res.data.createTime).format("YYYY年MM月DD日"));
            let str3=str2.replace('[单位]',res.data.dname);
            res.data.sendMsg = str3;
          }
          this.dataInfo = res.data;
        } else {
          let res = await findRecordInfo(this.eid, this.wasRead);
          this.dialogLoad = false;
          if(res.data.sendMsg){
            let str1=res.data.sendMsg.replace('[称呼]',res.data.ename.slice(0,1)+(res.data.sex==='M'?'先生':'女士'));
            let str2=str1.replace('[时间]',moment(res.data.createTime).format("YYYY年MM月DD日"));
            let str3=str2.replace('[单位]',res.data.dname);
            res.data.sendMsg = str3;
          }
          this.dataInfo = res.data;
        }
      } catch (error) {
        console.log("error", error);
      }
    },
    // 点击确定按钮
    async enterDialog() {
      // 如果为二级管理员 则不进行任何操作
      if (this.userstatus === "QUERY" || this.userstatus === "OFFICE" ||this.userstatus === "INSPECT") {
        if (this.dataInfo.modifyStatus == "NOMODIFY") {
          this.officeRectify();
        } else if (this.dataInfo.modifyStatus == "MODIFY") {
          this.officeRectify()
        }else{
          this.stateDisable = false;
        }
      } else if (this.userstatus === "ADMIN") {
        if (this.dataInfo.modifyStatus == "MODIFY") {
          if(this.check){
            this.officeFn()
          }else{
            this.adminFn();
          }
        }else{
          this.stateDisable = false;
        }
      } else {
        if (this.dataInfo.modifyStatus == "NOMODIFY") {
          this.excexFn();
        } else if (this.dataInfo.modifyStatus == "MODIFY") {
          this.excexFn();
        } else {
          this.stateDisable = false;
        }
      }
    },
    // 整改结果
    async excexFn() {
      let { content, dataInfo } = this;
      let params = {
        eid: dataInfo.eid,
        content
      };
      if (!content) {
        this.$message.error("请输入整改内容");
        return;
      }
      this.btnLoad = true;
      try {
        let res = await saveRec(params);
        this.$message({
          type: "success",
          message: "提交成功"
        });
        this.btnLoad = false;
        this.stateDisable = false;
        this.callback();
      } catch (error) {
        this.btnLoad = false;
        console.log("error", error);
      }
    },
    // 整改结果 二级管理员
    async officeRectify() {
      let { content, dataInfo } = this;
      let params = {
        eid: dataInfo.eid,
        content
      };
      if (!content) {
        this.$message.error("请输入整改内容");
        return;
      }
      this.btnLoad = true;
      try {
        let res = await commitCheck(params);
        this.$message({
          type: "success",
          message: "提交成功"
        });
        this.btnLoad = false;
        this.stateDisable = false;
        this.callback();
      } catch (error) {
        this.btnLoad = false;
        console.log("error", error);
      }
    },
    // 审批结果管理员
    async officeFn() {
      let { dataInfo, content, status } = this;
      let params = {
        eid: dataInfo.eid,
        content: content,
        status:status==='NOAPPROVAL'?'APPROVALMODIFY':status
      };
      // if (!content) {
      //   this.$message.error("请输入备注内容");
      //   return;
      // }
      if (!status) {
        this.$message.error("请选择审批结果");
        return;
      }
      this.btnLoad = true;
      try {
        let res = await submitCheck(params);
        this.$message({
          type: "success",
          message: "审批成功"
        });
        this.btnLoad = false;
        this.stateDisable = false;
        this.callback();
      } catch (error) {
        this.btnLoad = false;
        console.log("error", error);
      }
    },
    // 审批结果
    async adminFn() {
      let { dataInfo, content, status } = this;
      let params = {
        eid: dataInfo.eid,
        approvalContent: content,
        status:status==='NOAPPROVAL'?'APPROVALMODIFY':status
      };
      // if (!content) {
      //   this.$message.error("请输入备注内容");
      //   return;
      // }
      if (!status) {
        this.$message.error("请选择审批结果");
        return;
      }
      this.btnLoad = true;
      try {
        let res = await updateRec(params);
        this.$message({
          type: "success",
          message: "审批成功"
        });
        this.btnLoad = false;
        this.stateDisable = false;
        this.callback();
      } catch (error) {
        this.btnLoad = false;
        console.log("error", error);
      }
    }
  },
  // 移除组件时回调刷新数据  消除红点点
  destroyed() {
    this.callback();
  },
  computed: {
    isshowright() {
      let { modifyStatus, modifyContent, approvalContent } = this.dataInfo;
      if (modifyStatus || modifyContent || approvalContent) {
        return true;
      } else {
        return false;
      }
    },
    showIsTime() {
      let { modifyList } = this.dataInfo;
      if (modifyList && modifyList.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  filters: {
    isClose(val, status) {
      // 权限判断
      if ((val === "NOMODIFY"&&status!=='ADMIN') || val === "MODIFY") {
        return "提交";
      } else {
        return "确定";
      }
    },
    branchCo(val) {
      switch (val) {
        case "A":
          return "满意";
        case "B":
          return "检控类问题";
        case "C":
          return "不满意";
        default:
          return "其它";
      }
    },
    // 过滤返回的信息type
    filterType(val) {
      switch (val) {
        case 1:
          return "整改";
        case 2:
          return "审批";
        case 3:
          return "检查";
        case 4:
          return "回复检查";
        default:
          return "其它";
      }
    }
  },
  created() {
    let userdata = JSON.parse(sessionStorage.userdata);
    this.userstatus = userdata.status;
    this.searchData();
  }
};
</script>

<style lang="less" scoped>
.findExcel {
  display: flex;
  // padding-top: 20px;
  .left {
    // width: 66%;
    flex: 1;
    .card_item {
      .el-row {
        margin-bottom: 10px;
      }
    }
    .box-card2,
    .box-card3 {
      margin-top: 20px;
    }
  }
  .right {
    // flex: 1;
    width: 34%;
    margin-left: 20px;
    .pro_item {
      display: flex;
      align-items: center;
      .menu_group {
        flex: 1;
        .user {
          display: flex;
          & > span {
            flex: 1;
          }
          .name {
            font-size: 16px;
            font-weight: bold;
          }
        }
      }
    }
    .right-card2 {
      margin-top: 20px;
    }
    .icon_type {
      display: flex;
      align-items: center;
      span {
        margin-left: 10px;
      }
    }
  }
  .now_status {
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    padding: 10px;
  }
  .timeLineBox {
    margin-top: 20px;
    max-height: 400px;
    overflow-y: auto;
    // &::-webkit-scrollbar {
    //   display: none;
    // }
    /*滚动条整体样式*/
    &::-webkit-scrollbar {
      width: 6px;
      height: 1px;
    }
    /*滚动条滑块*/
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #ccc;
    }
    /*滚动条轨道*/
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
      border-radius: 6px;
      background: #fff;
    }
  }
}
.bths {
  margin-top: 70px;
  text-align: right;
}
</style>