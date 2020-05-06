<template>
  <div id="equipment">
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
          name: "设备类型",
          path: "/newEquipment"
        },
        {
          name: "设备列表",
          path: "/deviceList"
        },
        {
          name: "设备厂商",
          path: "/manufacturer"
        },
      ],
      activedRouter: "/newEquipment"
    };
  },
  created() {
     this.activedRouter = JSON.parse(sessionStorage.userdata).equipmentRouter
      ? JSON.parse(sessionStorage.userdata).equipmentRouter
      : "/newEquipment";
    this.$router.push(this.activedRouter)
  },
  methods: {
       changeRouter(v) {
      this.$router.push({ path: v.path });
      let obj = JSON.parse(sessionStorage.userdata);
      obj.equipmentRouter = v.path;
      this.activedRouter = v.path;
      sessionStorage.userdata = JSON.stringify(obj);
    }
  }
};
</script>

<style lang="less" scoped>
@white: #e8eaed;
@blue: #81fffb;
#equipment {
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