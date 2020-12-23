<template>
  <div>
    <div>
      <el-input
              class="addJobLevelInput"
              placeholder="添加职称"
              prefix-icon="el-icon-plus"
              @keyup.enter.native="addJobLevel"
              v-model="jobLevel.name">
      </el-input>
      <el-select
              v-model="jobLevel.titleLevel"
              placeholder="职称级别"
              style="margin-right: 8px">
        <el-option
                v-for="(item, index) in titleLevels"
                :key="index"
                :label="item"
                :value="item">
        </el-option>
      </el-select>
      <el-button
              type="primary"
              icon="el-icon-check"
              @click="addJobLevel"
              @keyup.enter="addJobLevel">
        添加
      </el-button>
    </div>
    <div class="margin-Top-10">
      <el-table
              :header-cell-style="{ textAlign: 'center' }"
              :cell-style="{ textAlign: 'center' }"
              :data="jobLevels"
              stripe
              border
              @selection-change="handleSelectionChange"
              style="width: 70%">
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>
        <el-table-column
                prop="id"
                label="编号"
                width="55">
        </el-table-column>
        <el-table-column
                prop="name"
                label="职称名称"
                width="140">
        </el-table-column>
        <el-table-column
                prop="titleLevel"
                width="140"
                label="职称级别">
        </el-table-column>
        <el-table-column
                prop="createDate"
                width="140"
                label="创建时间">
        </el-table-column>
        <el-table-column
                prop="enabled"
                width="140"
                label="是否启用">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enabled">已启用</el-tag>
            <el-tag type="warning" v-else>未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
                label="操作">
          <template slot-scope="scope">
            <el-button
                    @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
                    type="danger"
                    @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button
            type="danger"
            @click="delJobLevels"
            class="margin-Top-10"
            :disabled="multipleSelection.length == 0">
      批量删除
    </el-button>
    <el-dialog
            title="修改职位"
            :visible.sync="dialogVisible"
            width="30%">
      <div>
        <el-tag size="medium">职位名称</el-tag>
        <el-input class="updateJobLevelInput" v-model="updateJobLevel.name"></el-input>
      </div>
      <div class="margin-Top-10">
        <el-tag size="medium">职位级别</el-tag>
        <el-select
                style="margin-left: 8px"
                v-model="updateJobLevel.titleLevel"
                placeholder="职位级别">
          <el-option
                  v-for="(item, index) in titleLevels"
                  :key="index"
                  :label="item"
                  :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="margin-Top-10">
        <el-tag size="medium">是否启用</el-tag>
        <el-switch
                style="margin-left: 8px"
                v-model="updateJobLevel.enabled"
                inactive-text="禁用"
                active-text="启用">
        </el-switch>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="doUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "JobLevelMana",
  data() {
    return {
      titleLevels: [
        '正高级',
        '副高级',
        '中级',
        '初级',
        '员级',
      ],
      jobLevel: {
        name: '',
        titleLevel: ''
      },
      updateJobLevel: {
        name: '',
        titleLevel: '',
        enabled:null
      },
      dialogVisible: false,
      jobLevels: [],
      multipleSelection:[]
    }
  },
  mounted() {
    this.initJobLevels();
  },
  methods: {
    doUpdate() {
      this.updateJobLevel.name.trim();
      this.putRequest('system/basic/jobLevel', this.updateJobLevel).then(resp => {
        if (resp) {
          this.initJobLevels();
          // this.updatePos.name = '';
          this.dialogVisible = false;
        }
      })
    },
    // 展示编辑职称弹出层
    handleEdit(row) {
      Object.assign(this.updateJobLevel, row);
      this.dialogVisible = true;
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    // 删除单个职称
    handleDelete(row) {
      this.$confirm('此操作将永久删除【' + row.name + '】职称, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/system/basic/jobLevel/" + row.id).then(resp => {
          if (resp) {
            this.initJobLevels();
          }
        })
      }).catch(() => {});
    },
    // 拿到职称数据，初始化表格
    initJobLevels() {
      this.getRequest('/system/basic/jobLevel').then(resp => {
        this.jobLevels = resp;
      })
    },
    // 添加职称
    addJobLevel() {
      if (this.jobLevel.name.trim() && this.jobLevel.titleLevel) {
        this.postRequest('/system/basic/jobLevel', this.jobLevel).then(resp => {
          if (resp) {
            this.initJobLevels();
            this.jobLevel.name = '';
            this.jobLevel.titleLevel = '';
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请填写完整职称数据！',
          duration:2000, showClose:true
        });
      }
    },
    // 批量删除职称对象
    delJobLevels() {
      this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 将职称数组对象的id添加到新数组，以json传到后端[xx, xx, xx]
        let jobLevelsArray = [];
        this.multipleSelection.forEach(item => {
          jobLevelsArray.push(item.id);
        })
        this.deleteRequestData('/system/basic/jobLevel', jobLevelsArray).then(resp => {
          if (resp) {
            this.initJobLevels();
          }
        })
      }).catch(() => {});
    }
  }
}
</script>

<style>
  .addJobLevelInput {
    width: 300px;
    margin-right: 8px;
  }
  .updateJobLevelInput {
    width: 200px;
    margin-left: 8px;
  }
  .margin-Top-10 {
    margin-top: 10px;
  }
</style>