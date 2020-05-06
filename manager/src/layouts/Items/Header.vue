<template>
  <el-row class="header">
    <el-col :span="6">
      <img :src="imgUrl" width="20px" height="30px" alt />
      <span class="top_text">{{title}}</span>
    </el-col>
    <el-col :span="18">
      <el-dropdown @command="outLogin">
        <span class="el-dropdown-link">欢迎，{{username}}</span>
        <el-dropdown-menu slot="dropdown" @click="outLogin">
          <el-dropdown-item command="outLogin">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      title: " 成都智能哨兵后台管理系统",
      imgUrl: require("../../assets/imgs/logo.png"),
      username: ""
    };
  },
  methods: {
    outLogin(command) {
      switch (command) {
        case "outLogin":
          sessionStorage.clear();
          // sessionStorage.removeItem("tkt");
          // sessionStorage.removeItem("userdata");
          this.$router.push("login");
          this.$message({
            type: "success",
            message: "退出登录成功"
          });
          break;
        default:
          break;
      }
    }
  },
  created() {
    this.username = sessionStorage.name;
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
      color: aqua;
      font-weight: 500;
      font-size: 22px;
      margin-left: 10px;
    }
  }
  .el-col-18 {
    justify-content: flex-end;
    color: #fff;
    .el-dropdown {
      .el-dropdown-link {
        display: flex;
        align-items: center;
        color: aqua;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
</style>