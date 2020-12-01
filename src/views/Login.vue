<template>
  <div>
    <el-form :rules="rules"
             :model="loginForm"
             class="loginContainer"
             ref="loginForm"
             v-loading="loading"
             >
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password" auto-complete="off" placeholder="请输入密码">
        <el-input type="password" v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-button type="primary" style="width: 100%" @click="submitLogin()">登录</el-button>
    </el-form >
  </div>
</template>

<script>
// import {postKeyValueRequest} from "@/utils/api";
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      loginForm: {
        username: 'admin',
        password: '123',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
    }
  },
  /*校验通过后才可以登录，需要使用到表单的方法*/
  methods: {
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postKeyValueRequest('/doLogin', this.loginForm)
            .then(resp => {
              this.loading = false;
              if (resp) {
                window.sessionStorage.setItem('user', JSON.stringify(resp.obj));
                // replace浏览器没有回退按钮,push可后退,切换路由
                this.$router.replace('/home');
              }
            })
        } else {
          this.$message.error('请输入所有字段');
          return false;
        }
      })
    }
  }
}
</script>

<style>
  /*登录表单样式*/
  .loginContainer {
    border-radius: 15px;  /*添加圆角边框，越大越圆*/
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 5px 35px 25px 35px;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  /*标题样式*/
  .loginTitle {
    text-align: center;
    color: #505458;
  }
</style>