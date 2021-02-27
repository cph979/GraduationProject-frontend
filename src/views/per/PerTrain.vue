<template>
  <div>
    <div>
      <el-button
              icon="el-icon-circle-plus-outline"
              size="medium "
              type="text"
              @click="showAddEmpTrain">
        添加员工培训记录
      </el-button>
    </div>
    <div class="table">
      <el-table
              :header-cell-style="{ textAlign: 'center' }"
              :cell-style="{ textAlign: 'center' }"
              :data="empTrains"
              stripe
              border
              @selection-change="handleSelectionChange"
              style="width: 70%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column
                prop="id"
                label="编号"
                width="55">
        </el-table-column>
        <el-table-column
                prop="workID"
                width="92"
                label="工号">
        </el-table-column>
        <el-table-column
                prop="name"
                width="93"
                label="姓名">
        </el-table-column>
        <el-table-column
                prop="trainDate"
                label="培训日期">
        </el-table-column>
        <el-table-column
                prop="trainContent"
                label="培训内容">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)">编辑培训内容</el-button>
            <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button
            type="danger"
            @click="delEmpTrains"
            style="margin-top: 10px"
            :disabled="multipleSelection.length == 0">
      批量删除
    </el-button>
    <!--编辑对话框-->
    <el-dialog
            :close-on-click-modal="false"
            title="修改培训内容"
            :visible.sync="dialogVisible"
            width="30%">
      <div>
        <el-tag size="medium" style="margin-top: 8px">培训内容</el-tag>
        <el-input class="updateTrainInput" v-model="updateEmpTrain.trainContent"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="doUpdate">确 定</el-button>
      </span>
    </el-dialog>
    <!--新增对话框-->
    <el-dialog
            :close-on-click-modal="false"
            title="添加培训记录"
            :visible.sync="addDialogVisible"
            width="50%">
      <el-select
              size="medium"
              style="width: 183px;"
              filterable
              v-model="empTrain.eid"
              placeholder="搜索员工名">
        <el-option
                v-for="emp in allEmpNameWorkID"
                :key="emp.id"
                :label="emp.name"
                :value="emp.id">
          <span style="float: left">{{ emp.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 5px">工号：{{ emp.workID }}</span>
        </el-option>
      </el-select>
      <el-input
              style="margin-top: 18px"
              size="medium"
              clearable
              placeholder="请输入培训内容"
              v-model="empTrain.trainContent">
      </el-input>
      <span slot="footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addEmpTrain">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PerTrain",
  data() {
    return {
      empTrain: {
        eid: null,
        trainContent: ''
      },
      updateEmpTrain: {
        trainContent:''
      },
      allEmpNameWorkID: [],
      addDialogVisible: false,
      dialogVisible: false,
      empTrains: [],
      multipleSelection:[]
    }
  },
  mounted() {
    this.initEmpTrains();
  },
  methods: {
    // 添加完培训记录后，清空json对象
    emptyEmpTrain() {
      this.empTrain = {
        eid: null,
        trainContent: ''
      }
    },
    // 打开新增对话框
    showAddEmpTrain() {
      this.getEmpNameWorkID();
      this.addDialogVisible = true;
    },
    // 添加时查找所有员工和员工号
    getEmpNameWorkID() {
      this.getRequest('employee/basic/empWithNameAndWordID').then(resp => {
        if (resp) {
          this.allEmpNameWorkID = resp;
        }
      })
    },
    // 添加培训记录
    addEmpTrain() {
      if (this.empTrain.eid && this.empTrain.trainContent) {
            this.postRequest('personnel/train', this.empTrain).then(resp => {
              if (resp) {
                this.initEmpTrains();
                this.addDialogVisible = false;
                this.emptyEmpTrain();
              }
            });
        } else {
        this.$message({
          type: 'warning',
          message: '请输入所有字段',
          duration:2000, showClose:true
        });
      }
    },
    doUpdate() {
      this.putRequest('personnel/train', this.updateEmpTrain).then(resp => {
        if (resp) {
          this.initEmpTrains();
          this.dialogVisible = false;
        }
      })
    },
    // 展示编辑培训记录弹出层
    handleEdit(row) {
      this.dialogVisible = true;
      Object.assign(this.updateEmpTrain, row);
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    // 删除单个奖培训记录
    handleDelete(row) {
      this.$confirm('此操作将永久删除 [ ' + row.name + ' ] 的培训记录，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("personnel/train/" + row.id).then(resp => {
          if (resp) {
            this.initEmpTrains();
          }
        })
      }).catch(() => {});
    },
    // 拿到培训表数据，初始化表格
    initEmpTrains() {
      this.getRequest('personnel/train').then(resp => {
        this.empTrains = resp;
      })
    },
    // 批量删除培训记录
    delEmpTrains() {
      this.$confirm('此操作将永久删除 [ ' + this.multipleSelection.length + ' ] 条记录，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 培训数组对象的id添加到新数组，以json传到后端[xx, xx, xx]
        let empArray = [];
        this.multipleSelection.forEach(item => {
          empArray.push(item.id);
        })
        this.deleteRequestData('personnel/train', empArray).then(resp => {
          if (resp) {
            this.initEmpTrains();
          }
        })
      }).catch(() => {});
    }
  }
}
</script>

<style>
  .updateTrainInput {
    width: 256px;
    margin-left: 8px;
  }
  .table {
    margin-top: 10px;
  }
</style>