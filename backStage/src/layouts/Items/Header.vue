<template>
  <el-row class="header">
    <el-col :span="6">
      <img :src="imgUrl" width="20px" height="30px" alt />
      <span class="top_text">{{title}}</span>
    </el-col>
    <el-col :span="18">
      <div>
        <div class="name_logout">
          <label>{{ userdata.username }}</label>
          <label @click="logout" class="logout">退出</label>
        </div>
        <div class="tel">手机号&emsp;{{ userdata.tel?userdata.tel:13838389438 }}</div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      title: " 成都智能哨兵后台管理系统",
      imgUrl: require("../../assets/imgs/logo.png"),
      userdata: {}
    };
  },
  methods: {
    logout() {
      this.$router.push("login");
      this.$message({
        type: "success",
        message: "退出登录成功"
      });
      sessionStorage.clear();
      // switch (command) {
      //   case "outLogin":
      //     sessionStorage.removeItem("tkt");
      //     sessionStorage.removeItem("userdata");
      //     this.$router.push("login");
      //     this.$message({
      //       type: "success",
      //       message: "退出登录成功"
      //     });
      //     break;
      //   default:
      //     break;
      // }
    }
  },
  created() {
    this.userdata = JSON.parse(sessionStorage.userdata);
  }
};
</script>

<style lang="less" scoped>
.header {
  height: 100%;
  .el-col {
    height: 100%;
    display: flex;
    align-items: center;
    .top_text {
      color: #81fffb;
      font-weight: 500;
      font-size: 22px;
      margin-left: 10px;
    }
  }
  .el-col-18 {
    justify-content: flex-end;
    color: #81fffb;
    .name_logout {
      width: 240px;
      font-size: 18px;

      display: flex;
      justify-content: space-between;
      .logout {
        &:hover {
          cursor: pointer;
        }
      }
    }
    .tel {
      font-size: 0.875rem;
    }
  }
}
</style>