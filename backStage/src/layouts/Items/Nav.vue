<template>
  <div id="nav">
    <el-menu
      :default-active="activeNav"
      router
      background-color="#090d23"
      text-color="#fff"
      active-text-color="#19e1e8"
      @select="selectFn"
      unique-opened="true"
    >
      <el-menu-item-group v-for="(v,i) in menuConfig" :key="i+'nav'">
        <el-menu-item :index="v.path" v-if="!v.for">
          <i :class="v.icon"></i>
          <span slot="title">{{ v.name }}</span>
        </el-menu-item>
        <el-submenu v-if="v.for" :index="i">
          <template slot="title">
            <i :class="v.icon"></i>
            <span>{{ v.name }}</span>
          </template>
          <el-menu-item
            v-for="item in v.children"
            :key="item.path"
            :index="item.path"
          >{{ item.name }}</el-menu-item>
        </el-submenu>
      </el-menu-item-group>
    </el-menu>
  </div>
</template>

<script>
import { menuConfig } from "../../menuConfig";
export default {
  data() {
    return {
      menuConfig,
      activeNav: sessionStorage.dropdatapathname
    };
  },
  created() {
    this.integral = sessionStorage.integral;
    // 激活菜单样式相关
    window.sessionStorage.dropdatapathname = this.activeNav;
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
      window.sessionStorage.dropdatapathname = index;
    }
  }
};
</script>

<style lang="less">
#nav {
  height: 100%;

  background-color: #090d23;

  .el-menu {
    border: none;

    .el-submenu__title {
      font-size: 1rem !important;
      height: 60px;
      i {
        color: #e8eaed;
      }
    }
    .el-menu-item {
      font-size: 1rem;
      height: 60px;
      line-height: 60px;
      & > i {
        color: #e8eaed;
      }
    }

    .is-active {
      background-color: #1e577d !important;
      & > i {
        color: #19e1e8;
      }
    }
    .el-submenu .el-menu {
      text-indent: 15%;
    }
    .el-menu-item-group__title {
      padding: 0;
    }
  }
}
</style>