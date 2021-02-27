import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import Home from "@/views/Home";
import Chat from "../views/chat/Chat";
import HrInfo from "../views/HrInfo";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden: true
  }, {
    path: '/home',
    name: '主页',
    component: Home,
    hidden: true,
    children: [
      {
        path: '/home/chat',
        name: '在线聊天',
        component: Chat,
      },
      {
        path: '/home/info',
        name: '个人中心',
        component: HrInfo,
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 解决刷新页面路由重复问题，清空路由数组
router.$addRoutes = (params) => {
    router.matcher = new VueRouter({
    mode: 'history',
    routes: router.options.routes
  }).matcher
  router.addRoutes(params)
}

// 解决重复点击路由错误
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

export default router