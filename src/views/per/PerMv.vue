<template>
  <div>
    <el-table
            :header-cell-style="{ textAlign: 'center' }"
            :cell-style="{ textAlign: 'center' }"
            border
            :data="empRemove"
            stripe
            style="width: 70%; margin-top: 20px">
      <el-table-column
              prop="employee.workID"
              label="工号"
              width="80">
      </el-table-column>
      <el-table-column
              prop="employee.name"
              label="姓名"
              width="80">
      </el-table-column>
      <el-table-column
              prop="department.name"
              label="调动后部门"
              width="120">
      </el-table-column>
      <el-table-column
              prop="jobLevel.name"
              label="调动后职称"
              width="120">
      </el-table-column>
      <el-table-column
              prop="reason"
              label="调动原因" width="200">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button style="margin-right: 6px" @click="handleEdit(scope.row)">编辑调动原因</el-button>
          <el-popconfirm
                  @confirm="handleDelete(scope.row)"
                  icon="el-icon-info"
                  icon-color="red"
                  :title="'确定删除' + scope.row.employee.name + '调动记录吗？'">
            <el-button slot="reference" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
            :close-on-click-modal="false"
            title="编辑调动原因"
            :visible.sync="dialogVisible"
            width="30%">
      <el-input
              style="width: 300px; margin-top: 10px"
              placeholder="请输入调动原因"
              suffix-icon="el-icon-edit"
              v-model="singleEmpRemove.reason">
      </el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateEmpRemove">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PerMv",
  data() {
    return {
      empRemove: [],
      dialogVisible: false,
      singleEmpRemove: {}
    }
  },
  mounted() {
    this.initEmpRemove();
  },
  methods: {
    initEmpRemove() {
      this.getRequest('/personnel/remove').then(resp => {
        if (resp) {
          this.empRemove = resp.obj;
        }
      })
    },
    // 编辑对话框
    handleEdit(row) {
      this.dialogVisible = true;
      this.singleEmpRemove = Object.assign({}, row);
    },
    // 删除调动记录
    handleDelete(row) {
      this.deleteRequest('/personnel/remove/' + row.id).then(resp => {
        if (resp) {
          this.initEmpRemove();
        }
      })
    },
    // 更新调动原因
    updateEmpRemove() {
      this.postRequest('/personnel/remove', this.singleEmpRemove).then(resp => {
        if (resp) {
          this.initEmpRemove();
          this.dialogVisible = false;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>