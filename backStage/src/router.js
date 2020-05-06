// import Vue from 'vue'
// import Router from 'vue-router'
import Home from "./pages/Home/Home.vue";
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
                // 首页
                {
                    path: "/home",
                    name: "home",
                    component: Home,
                },

                // 消息管理
                {
                    path: "/message",
                    name: "message",
                    component: () => import("./pages/Message/Message.vue")
                },

                // 轮播图管理
                {
                    path: "/carousel",
                    name: "carousel",
                    component: () => import("./pages/Carousel/Carousel.vue")
                },
                // 用户资料
                {
                    path: "/accData",
                    name: "accData",
                    component: () => import("./pages/AccData/AccData.vue")
                },
                // 
                {
                    path: "/health",
                    name: "health",
                    component: () => import("./pages/Health/Health.vue")
                },
                // 
                {
                    path: "/autoReply",
                    name: "autoReply",
                    component: () => import("./pages/AutoReply/AutoReply.vue")
                },

                // 规则设置
                {
                    path: "/rule",
                    name: "rule",
                    component: () => import("./pages/Rule/Rule.vue"),
                    children: [{
                            path: "/named",
                            name: "named",
                            component: () => import("./pages/Rule/children/Named.vue")
                        },
                        {
                            path: "/exponent",
                            name: "exponent",
                            component: () => import("./pages/Rule/children/Exponent.vue")
                        },
                      
                    ]
                },

                // 设备管理
                {
                    path: "/equipment",
                    name: "equipment",
                    component: () => import("./pages/Equipment/Equipment.vue"),
                    children: [{
                            path: "/newEquipment",
                            name: "newEquipment",
                            component: () => import("./pages/Equipment/children/NewEquipment.vue")
                        },
                        {
                            path: "/deviceList",
                            name: "deviceList",
                            component: () => import("./pages/Equipment/children/deviceList.vue")
                        },
                        {
                            path: "/manufacturer",
                            name: "manufacturer",
                            component: () => import("./pages/Equipment/children/Manufacturer.vue")
                        },
                    ]
                },
                // 内容管理
                {
                    path: "/content",
                    name: "content",
                    component: () => import("./pages/Content/Content.vue"),
                    children: [{
                            path: "/business",
                            name: "business",
                            component: () => import("./pages/Content/children/Business.vue")
                        },
                        {
                            path: "/aboutus",
                            name: "aboutus",
                            component: () => import("./pages/Content/children/Aboutus.vue")
                        },
                        {
                            path: "/recruitment",
                            name: "recruitment",
                            component: () => import("./pages/Content/children/Recruitment.vue")
                        },
                    ]
                },
                // 角色管理
                {
                    path: "/role",
                    name: "role",
                    component: () => import("./pages/Role/Role.vue"),
                },
                // 用户反馈
                {
                    path: "/feedback",
                    name: "feedback",
                    component: () => import("./pages/Feedback/Feedback.vue")
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