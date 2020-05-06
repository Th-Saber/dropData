// import Vue from 'vue'
import App from "./App.vue";
import router from "./router"; //路由
import store from './store' //vuex
//引入animation.css
import "./assets/styles/animation.css";
import './assets/fonts/font.css'
//引入ElementUI组件
import ElementUI from 'element-ui';
import Message from "element-ui/packages/message/index.js";
import 'element-ui/lib/theme-chalk/index.css';
import "./apis/requet"; //请求响应拦截器
// import "@/assets/js/moment"; //国际化moment
Vue.use(ElementUI)

// 权限
// const ADMIN = ["work", "spotcheck", "note", "user", "unit", "recordmanage", "abarbeitung", "record", "ranking", "log"]
// const EXCEL = ["menuexcel", "recordexcel", "rectiNo", "rectinOver"]

router.beforeEach((to, from, next) => {
  if (to.name == "login") {
    next();
  } else {
    if (sessionStorage.tkt) {
      next();
    } else {
      Message({
        type: "warning",
        message: "请先登录"
      });
      next({
        path: "/login"
      });
    }
  }
});

let w = window.screen.availWidth;
let fs = (w / 1920) * 22 <= 12 ? 12 : (w / 1920) * 22;
document.querySelector("html").style.fontSize = fs + "px";
if (w <= 1600) {
  document.querySelector('body').style.minWidth = 1600 + 'px';
  document.querySelector('body').style.minHeight = 800 + 'px';
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");