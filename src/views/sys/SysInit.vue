<template>
  <div style="display: flex; justify-content: center; margin-top: 100px">
    <el-card class="box-card">
      <div slot="header">
        <span>数据库初始化</span>
      </div>
      <strong>选取盘符中的sql文件对数据库进行初始化：</strong><br>
      <el-upload
              :show-file-list="false"
              class="uploadCSS"
              drag
              :on-success="onSuccess"
              action="system/data/reduction">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SysLog",
  methods: {
    onSuccess(response, file, fileList) {
      if (response.status == 200) {
        this.$message.success({message: response.msg, duration:2000, showClose:true});
        return;
      }
      this.$message.warning({message: response.msg, duration:2000, showClose:true});
    }
  }
}
</script>

<style>
 .box-card {
   width: 450px;
   height: 320px;
 }
 .uploadCSS {
   margin-top: 20px;
   display: flex;
   justify-content: center;
 }
</style>