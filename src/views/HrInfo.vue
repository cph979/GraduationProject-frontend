<template>
    <div>
        <el-card class="box-card" style="width: 400px">
            <div slot="header">
                <span>基本信息</span>
            </div>
            <div>
                <div style="display: flex; justify-content: center">
                    <el-upload
                            action="/hr/avatar"
                            :data="hr"
                            :show-file-list="false"
                            :on-success="onSuccess">
                        <img title="点击修改头像" :src="hr.userface" style="width: 100px; height: 100px; border-radius: 50px">
                    </el-upload>
                </div>
                <div class="marginButton">用户姓名：
                    <el-tag>{{ hr.name }}</el-tag>
                </div>
                <div class="marginButton">手机号码：
                    <el-tag>{{ hr.phone }}</el-tag>
                </div>
                <div class="marginButton">居住地址：
                    <el-tag>{{ hr.address }}</el-tag>
                </div>
                <div class="marginButton">用户角色：
                    <el-tag style="margin-right: 5px" v-for="(hr,index) in hr.roles" :key="index">{{ hr.nameZh }}
                    </el-tag>
                </div>
            </div>
            <div style="display: flex; justify-content: space-around; margin-top: 10px">
                <el-button type="primary" @click="showDialog">修改信息</el-button>
                <el-button type="danger" @click="showPwdDialog">修改密码</el-button>
            </div>
        </el-card>
        <el-dialog
                :close-on-click-modal="false"
                title="修改信息"
                :visible.sync="dialogVisible"
                width="35%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>用户姓名：</el-tag>
                        </td>
                        <td>
                            <el-input v-model="hr2.name"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>手机号码：</el-tag>
                        </td>
                        <td>
                            <el-input v-model="hr2.phone"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>居住地址：</el-tag>
                        </td>
                        <td>
                            <el-input v-model="hr2.address"></el-input>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateHr">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                :close-on-click-modal="false"
                title="修改密码"
                :visible.sync="pwdDialogVisible"
                width="35%">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="请输入旧密码" prop="oldPass">
                    <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="请输入新密码" prop="pass">
                    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="请确认新密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: "HrInfo",
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        hr: {},
        hr2: {},
        dialogVisible: false,
        pwdDialogVisible: false,
        ruleForm: {
          oldPass: '',
          pass: '',
          checkPass: '',
        },
        rules: {
          ass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        }
      }
    },
    mounted() {
      this.initHr();
    },
    methods: {
      onSuccess() {
        this.initHr();
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.id = this.hr.id;
            this.putRequest('/hr/pass', this.ruleForm).then(resp => {
              if (resp) {
                this.getRequest('/logout');
                window.sessionStorage.removeItem('user');
                this.$store.commit('initRoutes', []);
                this.$router.replace('/');
              }
            })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      showPwdDialog() {
        this.pwdDialogVisible = true;
      },
      updateHr() {
        this.putRequest('/hr/info', this.hr2).then(resp => {
          if (resp) {
            this.initHr();
            this.dialogVisible = false;
          }
        })
      },
      showDialog() {
        this.dialogVisible = true;
      },
      initHr() {
        this.getRequest('/hr/info').then(resp => {
          if (resp) {
            this.hr = resp;
            this.hr2 = Object.assign({}, this.hr);
            window.sessionStorage.setItem('user', JSON.stringify(resp));
            this.$store.commit('initHr', resp);
          }
        })
      }
    }
  }
</script>

<style>
    .marginButton {
        margin-bottom: 5px;
    }
</style>