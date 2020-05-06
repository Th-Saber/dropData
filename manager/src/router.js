// import Vue from 'vue'
// import Router from 'vue-router'
import Point from "./pages/Point/Point.vue";
import NavTab from "./layouts/navTab.vue";

// Vue.use(Router)

// const router= new Router({
const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes: [{
      path: "/",
      name: "nav",
      component: NavTab,
      redirect: "/login",
      children: [
        // 点位
        {
          path: "/point",
          name: "point",
         component:Point,
        },
        // 轨迹
        {
          path: "/track",
          name: "track",
          component: () => import("./pages/Track/Track.vue")
        },
        // 基本信息
        {
          path: "/info",
          name: "info",
          component: () => import("./pages/Info/Info.vue")
        },
        // 健康信息
        {
          path: "/health",
          name: "health",
          component: () => import("./pages/Health/Health.vue")
        },
        // 计时统计
        {
          path: "/time",
          name: "time",
          component: () => import("./pages/Time/Time.vue")
        },
      ]
    },
    // 登录路由
    {
      path: "/login",
      name: "login",
      component: () => import("./pages/Login/Login.vue")
    },
    // 注册路由
    // {
    //   path: '/register',
    //   name: 'register',
    //   component: () => import('./views/Register.vue')
    // },
    //404地址
    {
      path: "*",
      name: "error",
      component: () => import("./components/Error.vue") //提供了Error.vue和Err404.vue两种错误组件样式
    }
  ]
});

export default router;