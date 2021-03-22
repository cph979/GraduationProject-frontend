<template>
  <div style="display: flex; justify-content: center; margin-top: 100px">
    <el-card class="box-card">
      <div slot="header">
        <span>数据库备份</span>
      </div>
      <div style="margin-top: 50px;">
        <strong style="margin-left: 80px">备份至：</strong><br>
        <el-radio-group class="radio-group-style" v-model="place" size="medium">
          <el-radio-button label="C">C盘</el-radio-button>
          <el-radio-button label="D">D盘</el-radio-button>
          <el-radio-button label="E">E盘</el-radio-button>
          <el-radio-button label="F">F盘</el-radio-button>
        </el-radio-group>
        <div class="clickBackupCSS">
          <el-button type="primary" round @click="backup">点击备份</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SysData",
  data() {
    return {
      // 备份的盘符位置
      place: 'C'
    }
  },
  methods: {
    backup() {
      this.getRequest('/system/data/backup?driveletter=' + this.place);
    }
  }
}
</script>

<style>
  .box-card {
    width: 450px;
    height: 320px;
  }
  .radio-group-style {
    margin: 20px 0;
    display: flex;
    justify-content: center;
  }
  .clickBackupCSS {
    display: flex;
    justify-content: flex-end;
  }
</style>