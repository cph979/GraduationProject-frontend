import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import Home from "@/views/Home";

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
    hidden: true
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