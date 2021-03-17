import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  Button,
  Input,
  InputNumber,
  Table,
  TableColumn,
  Dialog,
  Card,
  Container,
  Icon,
  Select,
  Form,
  Tag,
  Tree,
  Pagination,
  Badge,
  Loading,
  Message,
  MessageBox,
  Menu,
  Tabs,
  TabPane,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  Steps,
  Step,
  Tooltip,
  Popover,
  Collapse,
  FormItem,
  Checkbox,
  Header,
  DropdownMenu,
  DropdownItem,
  Aside,
  Main,
  MenuItem,
  Submenu,
  Option,
  Col,
  Row,
  Upload,
  Radio,
  DatePicker,
  RadioGroup,
  CollapseItem,
  Switch
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.prototype.$ELEMENT = {size: 'small', zIndex: 3000};
Vue.use(Switch);
Vue.use(CollapseItem);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(DatePicker);
Vue.use(Upload);
Vue.use(Row);
Vue.use(Col);
Vue.use(Option);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Header);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Checkbox);
Vue.use(FormItem);
Vue.use(Collapse);
Vue.use(Popover);
Vue.use(Menu);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Dropdown);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Tooltip);
Vue.use(Tree);
Vue.use(Pagination);
Vue.use(Badge);
Vue.use(Loading);
Vue.use(Button);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Card);
Vue.use(Container);
Vue.use(Icon);
Vue.use(Select);
Vue.use(Form);
Vue.use(Tag);
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message;

// 导入api.js封装的方法
import {postRequest} from "./utils/api";
import {postRequestJSON} from "./utils/api";
import {postKeyValueRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {deleteRequestData} from "./utils/api";
import {getRequest} from "./utils/api";
import {initMenu} from "@/utils/menus";
// 导入des加解密方法
import {encryptDES, decryptDES} from "./utils/des"

import 'font-awesome/css/font-awesome.min.css'

// 将封装的方法挂载到Vue实例上
Vue.prototype.postRequest = postRequest;
Vue.prototype.postRequestJSON = postRequestJSON;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequestData = deleteRequestData;

Vue.prototype.encryptDES = encryptDES;
Vue.prototype.decryptDES = decryptDES;

Vue.config.productionTip = false

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
