<template>
  <div class="nav">
    <div class="avatar">
      <el-avatar :size="54" :src="circleUrl"></el-avatar>

      <div class="score">
        <div>{{integral}}</div>
        <div>积分总额</div>
      </div>
    </div>
    <el-menu
      :default-active="activeNav"
      router
      background-color="#090d23"
      text-color="#fff"
      active-text-color="#19e1e8"
      @select="selectFn"
    >
      <el-menu-item :index="v.path" v-for="(v,i) in menuConfig" :key="i+'nav'">
        <i :class="v.icon" style="font-size:24px;margin-right:20px"></i>
        <span slot="title">{{v.name}}</span>
      </el-menu-item>
      <!-- <el-submenu index="1" v-for="(v,i) in  menuConfig" :key="i+'nav'">
        <template slot="title">
          <i :class="[v.icon,'icons']"></i>
          <span>{{ v.name }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="(itemv,itemi) in v.children"
            :index="itemv.path"
            :key="i+'-'+itemi+'nav'"
          >{{ itemv.name }}</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>-->
      <!-- <el-menu-item :index="v.path" v-for="(v,i) in menuConfig" :key="i+'nav'">
        <i :class="[v.icon,'icons']"></i>
        <span slot="title">{{v.name}}</span>
      </el-menu-item>-->
    </el-menu>
  </div>
</template>

<script>
import { menuConfig } from "../../menuConfig";
export default {
  data() {
    return {
      menuConfig,
      activeNav: sessionStorage.pathname,
      circleUrl: require("../../assets/imgs/default_icon.png"), //默认头像
      integral:'',//积分
    };
  },
  created() {
    this.integral = sessionStorage.integral;
    // 激活菜单样式相关
    window.sessionStorage.pathname = this.activeNav;
    window.onhashchange = () => {
      this.activeNav = location.hash.slice(1);
    };
  },
  methods: {
    // 激活菜单样式相关 js路由跳转
    activeFn() {
      this.activeNav = "/point";
    },
    // 选择菜单 激活菜单样式相关
    selectFn(index, path) {
      window.sessionStorage.pathname = index;
    }
  }
};
</script>

<style lang="less" scoped>
.nav {
  height: 100%;
  // width: 12.9091rem;
  background-color: #090d23;
  .avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 3rem;
    .el-avatar--circle {
      border: 2px solid aqua;
    }
    .score {
      text-align: center;
      margin-top: 1rem;
      padding-bottom: 4.5455rem;
      & > div:nth-of-type(1) {
        color: #19e1e8;
        font-size: 24px;
        font-weight: 500;
      }
      & > div:nth-of-type(2) {
        color: #fff;
        font-size: 14px;
      }
    }
  }
  .el-menu {
    border: none;
    .el-menu-item {
      text-align: center;
      font-size: 0.7273rem;
      & > i {
        color: #fff;
      }
    }
    .is-active {
      background-color: #1e577d !important;
      & > i {
        color: #19e1e8;
      }
    }
  }
}
</style>