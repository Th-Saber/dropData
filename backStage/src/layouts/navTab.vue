<template>
  <el-container class="navTab">
    <el-header>
      <!-- 头部 -->
      <Header />
    </el-header>
    <el-container>
      <el-aside>
        <!-- 导航 -->
        <Nav />
      </el-aside>
      <el-container>
        <el-main>
          <!-- 主要内容 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import Nav from "./Items/Nav";
import Header from "./Items/Header";
import Footer from "./Items/Footer";

export default {
  components: { Nav, Header, Footer },
  data() {
    return {};
  },
  methods: {},
  created() {}
};
</script>

<style lang="less">
.navTab {
  height: 100%;
  .el-header {
    height: 70px !important;
    z-index: 100;
    padding: 0 20px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5);
  }
}
.el-container {
    background: url("../assets/imgs/login_bg.jpg") no-repeat;
  background-size: cover;
}
.el-aside {
  width: 16.8rem !important;

}

.el-main {
  padding-bottom: 0;
}
</style>