<template>
  <div id="rule">
    <div class="router">
      <div
        :class="{title:true,activedRouter:v.path==activedRouter}"
        v-for="(v,i) in router"
        :key="i"
        @click="changeRouter(v)"
      >{{ v.name }}</div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      router: [
        {
          name: "称呼管理",
          path: "/named"
        },
        {
          name: "指数解读",
          path: "/exponent"
        }
      ],
      activedRouter: ""
    };
  },
  created() {
    this.activedRouter = JSON.parse(sessionStorage.userdata).ruleRouter
      ? JSON.parse(sessionStorage.userdata).ruleRouter
      : "/named";
    this.$router.push(this.activedRouter);
  },
  methods: {
    changeRouter(v) {
      this.$router.push({ path: v.path });
      let obj = JSON.parse(sessionStorage.userdata);
      obj.ruleRouter = v.path;
      this.activedRouter = v.path;
      sessionStorage.userdata = JSON.stringify(obj);
    }
  }
};
</script>

<style lang="less" scoped>
@white: #e8eaed;
@blue: #81fffb;
#rule {
  width: 100%;
  height: 100%;
  .router {
    height: 5%;
    display: flex;
    margin-bottom: 0.5rem;

    & > .title {
      width: 10rem;
      height: 100%;
      font-size: 1rem;
      display: flex;
      color: @white;
      justify-content: center;
      align-items: center;
      background: linear-gradient(#1c4364 0%, #0a1127 100%);
      border-top-left-radius: 12px;
      margin-right: 10px;
      &:hover {
        cursor: pointer;
      }
    }
    .activedRouter {
      border: 1px solid #4c9db7;
      color: @blue;
    }
  }
}
</style>