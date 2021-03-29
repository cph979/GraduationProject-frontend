<template>
  <div>
    <div>
      <el-button
              icon="el-icon-circle-plus-outline"
              size="medium "
              type="text"
              @click="showAddEmpEC">
        添加员工奖惩记录
      </el-button>
    </div>
    <div class="posManageMain">
      <el-table
              :header-cell-style="{ textAlign: 'center' }"
              :cell-style="{ textAlign: 'center' }"
              :data="empECs"
              stripe
              border
              @selection-change="handleSelectionChange"
              style="width: 90%">
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
                prop="ecDate"
                label="奖罚日期">
        </el-table-column>
        <el-table-column
                prop="ecReason"
                label="奖罚原因">
        </el-table-column>
        <el-table-column
                prop="ecPoint"
                label="奖罚分"
                width="100">
        </el-table-column>
        <el-table-column
                prop="ecType"
                label="奖罚类别"
                width="100">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.ecType == 0">加分</el-tag>
            <el-tag type="danger" v-else>减分</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)">编辑奖罚分</el-button>
            <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button
            type="danger"
            @click="delEmpECs"
            style="margin-top: 10px"
            :disabled="multipleSelection.length == 0">
      批量删除
    </el-button>
    <el-dialog
            :close-on-click-modal="false"
            title="编辑奖罚分"
            :visible.sync="dialogVisible"
            width="40%">
      <el-alert
              :closable="false"
              v-if="updateEmpEC.ecType == 0"
              title="加分项"
              type="success"
              center>
      </el-alert>
      <el-alert
              :closable="false"
              v-else-if="updateEmpEC.ecType == 1"
              title="减分项"
              type="error"
              center>
      </el-alert>
      <div style="margin-top: 25px">
        <el-tag size="medium" style="margin-right: 8px;">奖罚原因</el-tag>
        <el-input class="updateECInput" v-model="updateEmpEC.ecReason" disabled></el-input>
      </div>
      <div style="margin-top: 10px">
        <el-tag size="medium" style="margin-right: 8px;">分数调整</el-tag>
        <el-input-number
                class="updateECPointInput"
                v-model="updateEmpEC.ecPoint"
                :min="1"
                :max="100">
        </el-input-number>
      </div>
      <span slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="doUpdate">确 定</el-button>
      </span>
    </el-dialog>

    <!--添加员工奖惩信息对话框-->
    <el-dialog
            :close-on-click-modal="false"
            :before-close="handleClose"
            title="添加奖惩记录"
            :visible.sync="addDialogVisible"
            width="50%">
      <el-form :model="empEC" ref="empECForm" :rules="rules">
        <el-form-item prop="eid">
          <el-select
                  size="medium"
                  style="width: 183px;"
                  filterable
                  v-model="empEC.eid"
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
        </el-form-item>
        <el-form-item prop="ecReason">
          <el-input
                size="medium"
                clearable
                placeholder="请输入奖罚原因"
                v-model="empEC.ecReason">
          </el-input>
        </el-form-item>
        <el-form-item prop="ecType">
          <el-select
                  size="medium"
                  v-model="empEC.ecType"
                  placeholder="选择加分或者减分"
                  style="width: 183px;">
            <el-option label="加分" :value="0"></el-option>
            <el-option label="减分" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="ecPoint">
          <el-input placeholder="请输入1-100的整数" v-model="empEC.ecPoint" size="medium">
        </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
      <el-button @click="clearValidatesMethod">取 消</el-button>
      <el-button type="primary" @click="addEmpEC">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "PerEc",
    data() {
      return {
        pointType: [
          '加分',
          '减分'
        ],
        empEC: {
          eid:null,
          ecReason: '',
          ecPoint: null,
          ecType: null
        },
        updateEmpEC: {
          ecReason: '',
          ecPoint: null,
          ecType: null
        },
        allEmpNameWorkID: [],
        addDialogVisible: false,
        dialogVisible: false,
        empECs: [],
        multipleSelection:[],
        rules: {
          ecReason: [{ required: true, message: '请输入奖罚原因', trigger: 'blur' }],
          ecType: [{ required: true, message: '请选择加分或减分', trigger: 'blur' }],
          ecPoint: [
            { required: true, message: '请输入奖罚分', trigger: 'blur' },
            {
              pattern: /(^([1-9]|[1-9]\d|100)$)/,
              message: '请输入1-100的整数',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    mounted() {
      this.initEmpECs();
    },
    methods: {
      // 对话框点×关闭回调
      handleClose() {
        this.clearValidatesMethod();
      },
      // 添加完分数后，清空empEC对象
      emptyEmpEC() {
        this.empEC = {
          eid:null,
          ecReason: '',
          ecPoint: null,
          ecType: null
        }
      },
      // clearValidate 移除校验结果，解决点击新增校验未通过后，点击编辑校验仍然不通过bug
      clearValidatesMethod() {
        this.addDialogVisible = false;
        this.emptyEmpEC();
        this.$refs.empECForm.clearValidate();
      },
      // 打开新增对话框
      showAddEmpEC() {
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
      // 添加奖惩记录
      addEmpEC() {
        if (this.empEC.eid) {
          this.$refs.empECForm.validate(valid => {
            if (valid) {
              this.postRequest('personnel/ec', this.empEC).then(resp => {
                if (resp) {
                  this.initEmpECs();
                  this.addDialogVisible = false;
                  this.emptyEmpEC();
                }
              });
            }
          });
        } else {
          this.$message({
            type: 'warning',
            message: '请选择员工',
            duration:2000, showClose:true
          });
        }
      },
      doUpdate() {
        this.putRequest('personnel/ec', this.updateEmpEC).then(resp => {
          if (resp) {
            this.initEmpECs();
            this.dialogVisible = false;
          }
        })
      },
      // 展示编辑奖惩记录弹出层
      handleEdit(row) {
        this.dialogVisible = true;
        Object.assign(this.updateEmpEC, row);
      },
      handleSelectionChange(selection) {
        this.multipleSelection = selection;
      },
      // 删除单个奖惩记录
      handleDelete(row) {
        this.$confirm('此操作将永久删除 [ ' + row.name + ' ] 奖罚记录，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("personnel/ec/" + row.id).then(resp => {
            if (resp) {
              this.initEmpECs();
            }
          })
        }).catch(() => {});
      },
      // 拿到奖惩数据，初始化表格
      initEmpECs() {
        this.getRequest('personnel/ec').then(resp => {
          this.empECs = resp.obj;
        })
      },
      // 批量删除奖惩对象
      delEmpECs() {
        this.$confirm('此操作将永久删除 [ ' + this.multipleSelection.length + ' ] 条记录，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 将职位数组对象的id添加到新数组，以json传到后端[xx, xx, xx]
          let empECsArray = [];
          this.multipleSelection.forEach(item => {
            empECsArray.push(item.id);
          })
          this.deleteRequestData('personnel/ec', empECsArray).then(resp => {
            if (resp) {
              this.initEmpECs();
            }
          })
        }).catch(() => {});
      }
    }
  }
</script>

<style>
  .updateECInput {
    width: 249px;
    margin-left: 8px;
  }
  .updateECPointInput {
    width: 249px;
    margin-left: 8px;
  }
  .posManageMain {
    margin-top: 10px;
  }
</style>