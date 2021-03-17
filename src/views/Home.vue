<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">Employee Management System<!--VHR--></div>
        <div>
            <el-button
                    icon="el-icon-bell"
                    type="text"
                    style="margin-right: 10px; color: #000000;"
                    size="medium" @click="goChat">
            </el-button>
            <el-dropdown class="userInfo" @command="handleCommand">
              <span class="el-dropdown-link">
                {{ user.name }}<i><img :src="user.userface"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
                <el-dropdown-item command="setting">设置</el-dropdown-item>
                <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!--
            router	是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
          -->
          <el-menu router unique-opened>
            <el-submenu
                :index="index + ''"
                v-for="(item, index) in routes"
                :key="index"
                v-if="!item.hidden">
              <template slot="title">
                <i :class="item.iconCls"></i>
                <span v-text="item.name"></span>
              </template>
              <el-menu-item
                  :index="child.path"
                  v-for="(child, indexJ) in item.children"
                  :key="indexJ"
                  v-text="child.name">
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main :class="{ mainBackground: bgIsActive }">
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
            欢迎使用员工管理系统，点击左侧菜单开始使用
          </div>
          <div >
            <router-view class="homeRouterView"/>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      bgIsActive: false,
      // user: JSON.parse(window.sessionStorage.getItem('user')),
    }
  },
  computed: {
    // 下次使用routes会调用缓存，computed特性
    routes() {
      return this.$store.state.routes;
    },
    user() {
      return this.$store.state.currentHr;
    }
  },
  methods: {
    goChat() {
      this.$router.push('/home/chat');
    },
    handleCommand(command) {
      if (command == 'logout') {
        this.$confirm('此操作将注销登录，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getRequest('/logout');
          window.sessionStorage.removeItem('user');
          this.$store.commit('initRoutes', []);
          this.$router.replace('/');
        }).catch(() => {});
      } else if (command == 'userInfo') {
        this.$router.push('/home/info');
      }
    }
  },
  watch:{
    $route(to, from){
      // console.log(from.path); // 从哪来
      // console.log(to.path); // 到哪去
      if (to.path == '/home/chat') {
        this.bgIsActive = true;
      } else {
        this.bgIsActive = false;
      }
    }
  }

}
</script>

<style>
  /*.mainBackground {
    background-image: url("../assets/background.jpg");
  }*/
  .homeRouterView {
    margin-top: 10px;
  }
  .homeWelcome {
    text-align: center;
    font-size: 30px;
    font-family: 华文行楷;
    color: #409eff;
    padding-top: 50px;
  }
  .homeHeader {
    background-color: #409eff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    box-sizing: border-box;
  }
  .homeHeader .title {
    font-size: 30px;
    font-family: 华文行楷;
    color: #ffffff;
  }
  .homeHeader .userInfo {
    cursor: pointer;
  }
  .el-dropdown-link img {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    margin-left: 8px;
  }
  .el-dropdown-link {
    font-size: 20px;
    font-family: 华文行楷;
    display: flex;
    align-items: center;
  }
</style>