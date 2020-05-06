<template>
  <div id="app">
    <!-- <Index/> -->
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "App",
  provide() {
    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true //控制视图是否显示的变量
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false; //先关闭，
      this.$nextTick(function() {
        this.isRouterAlive = true; //再打开
      });
    }
  }
};
</script>
<style lang="less">
* {
  padding: 0;
  margin: 0;
}
html {
  width: 100%;
  height: 100%;
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background-color: #090d23;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #1ae8ff;
  }

  ::-webkit-scrollbar-thumb:active {
    background-color: #cccccc;
  }
}
body {
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
  font-family: fzhtjt;
  min-width: 72.7273rem;
  min-height: 40.9091rem;
}
.el-button {
  border-radius: 4px;
}

.el-table thead {
  color: #333333;
}
.el-table td {
  height: 50px !important;
  padding: 0 !important;
  // line-height: 50px !important;
}
.el-tabs__nav-scroll {
  .el-tabs__item.is-active {
    border-radius: 4px;
    border-bottom: 1px solid #dcdfe6 !important;
  }
}
.el-main {
  & > div {
    height: 100%;
    .el-tabs {
      height: 100%;
      display: flex;
      flex-direction: column;
      .el-tabs__content {
        flex: 1;
        display: flex;
        flex-direction: column;
        & > div {
          height: 100%;
          & > div {
            height: 100%;
          }
        }
      }
    }
  }
}
.flex_card_item {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-card__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    .el-table {
      flex: 1;
    }
  }
}
</style>