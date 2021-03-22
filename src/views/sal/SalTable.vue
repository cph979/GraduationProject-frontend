<template>
  <div>
    <el-table
            :data="salaries"
            border
            stripe
            :header-cell-style="{ textAlign: 'center' }"
            :cell-style="{ textAlign: 'center' }"
            style="width: 60%">
      <el-table-column
              prop="employee.workID"
              label="工号"
              width="80">
      </el-table-column>
      <el-table-column
              prop="employee.name"
              label="姓名"
              width="70">
      </el-table-column>
      <el-table-column
              prop="salary.name"
              label="隶属部门账套"
              width="120">
      </el-table-column>
      <el-table-column
              prop="basicSalary"
              label="基本工资"
              width="70">
      </el-table-column>
      <el-table-column
              prop="bonus"
              label="奖金"
              width="70">
      </el-table-column>
      <el-table-column
              prop="lunchSalary"
              label="午餐补助"
              width="70">
      </el-table-column>
      <el-table-column
              prop="trafficSalary"
              label="交通补助"
              width="70">
      </el-table-column>
      <el-table-column
              prop="allSalary"
              label="总工资"
              width="80">
        <template slot-scope="scope">
          <el-tag>{{scope.row.allSalary}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="showDiaLog(scope.row)" style="margin-right: 10px">编辑</el-button>
          <el-popconfirm
                  @confirm="handleDelete(scope.row)"
                  icon="el-icon-info"
                  icon-color="red"
                  :title="'确定删除' + scope.row.employee.name +'薪资记录吗？'">
            <el-button slot="reference" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
            :close-on-click-modal="false"
            :before-close="handleClose"
            title="编辑工资"
            :visible.sync="dialogVisible"
            width="50%">
      <div style="display: flex; justify-content: space-around; align-items: center">
        <el-steps direction="vertical" :active="salaryItemIndex">
          <el-step :title="item" v-for="(item ,index) in salaryItemName" :key="index"></el-step>
        </el-steps>
        <!--遍历对象，value对象值，title对象key，index索引-->
        <el-input
                style="width: 300px"
                v-model="salary[title]"
                v-for="(value, title, index) in salary"
                :key="index"
                v-show="salaryItemIndex == index"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="preStep">上一步</el-button>
        <el-button type="primary" @click="nextStep">{{ salaryItemIndex == 3 ? '完成' : '下一步' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SalTable",
  data() {
    return {
      salaries: [],
      dialogVisible: false,
      salaryItemName: [
        '基本工资',
        '奖金',
        '交通补助',
        '午餐补助'
      ],
      salaryItemIndex: 0,
      salary: {
        basicSalary: 0,
        bonus: 0,
        trafficSalary: 0,
        lunchSalary: 0
      }
    }
  },
  mounted() {
    this.initTable();
  },
  methods: {
    clearSalary() {
      this.salary = {
        basicSalary: 0,
        bonus: 0,
        trafficSalary: 0,
        lunchSalary: 0
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.salaryItemIndex = 0;
      // this.clearSalary();
    },
    preStep() {
      if (this.salaryItemIndex == 0) {
        return;
      }
      this.salaryItemIndex--;
    },
    nextStep() {
      if (this.salaryItemIndex == 3) {
        this.putRequest('/salary/table/', this.salary).then(resp => {
          if (resp) {
            this.initTable();
          }
        })
        this.dialogVisible = false;
        this.salaryItemIndex = -1;
      }
      this.salaryItemIndex++;
    },
    handleDelete(row) {
      this.deleteRequest('/salary/table/' + row.id + '/' + row.eid).then(resp => {
        if (resp) {
          this.initTable();
        }
      })
    },
    showDiaLog(data) {
      this.dialogVisible = true;
      this.salary.basicSalary = data.basicSalary;
      this.salary.trafficSalary = data.trafficSalary;
      this.salary.lunchSalary = data.lunchSalary;
      this.salary.bonus = data.bonus;
      this.salary.id = data.id;
      this.salary.sid = data.sid;
    },
    initTable() {
      this.getRequest('/salary/table').then(resp => {
        if (resp) {
          this.salaries = resp.obj;
        }
      })
    }
  }
}
</script>

<style>

</style>