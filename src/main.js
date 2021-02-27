import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 导入api.js封装的方法
import {postRequest} from "./utils/api";
import {postKeyValueRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {deleteRequestData} from "./utils/api";
import {getRequest} from "./utils/api";
import {initMenu} from "@/utils/menus";

import 'font-awesome/css/font-awesome.min.css'

// 将封装的方法挂载到Vue实例上
Vue.prototype.postRequest = postRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequestData = deleteRequestData;

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.prototype.$ELEMENT = {size: 'small', zIndex: 3000};

// 全局路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/') {
    next();
  } else {
    if (window.sessionStorage.getItem('user')) {
      initMenu(router, store);
      next();
    } else {
      next('/?redirect=' + to.path);
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
