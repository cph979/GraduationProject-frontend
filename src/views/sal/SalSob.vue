<template>
  <div>
    <div>
      <el-button icon="el-icon-plus" type="primary" @click="showAddDialog">添加工资账套</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
              size="mini"
              style="width: 75%"
              :data="salaries"
              border
              stripe
              :header-cell-style="{ textAlign: 'center' }"
              :cell-style="{ textAlign: 'center' }">
        <el-table-column width="120" label="账套名称" prop="name"></el-table-column>
        <el-table-column width="70" label="基本工资" prop="basicSalary"></el-table-column>
        <el-table-column width="70" label="交通补助" prop="trafficSalary"></el-table-column>
        <el-table-column width="70" label="午餐补助" prop="lunchSalary"></el-table-column>
        <el-table-column width="70" label="奖金" prop="bonus"></el-table-column>
        <el-table-column width="100" label="启用时间" prop="createDate"></el-table-column>
        <el-table-column label="养老金">
          <el-table-column width="70" label="基数" prop="pensionBase"></el-table-column>
          <el-table-column width="70" label="比率" prop="pensionPer"></el-table-column>
        </el-table-column>
        <el-table-column label="医疗保险">
          <el-table-column width="70" label="基数" prop="medicalBase"></el-table-column>
          <el-table-column width="70" label="比率" prop="medicalPer"></el-table-column>
        </el-table-column>
        <el-table-column label="公积金">
          <el-table-column width="70" label="基数" prop="accumulationFundBase"></el-table-column>
          <el-table-column width="70" label="比率" prop="accumulationFundPer"></el-table-column>
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
    <el-dialog
            :close-on-click-modal="false"
            :before-close="handleClose"
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="50%">
      <div class="diaLogStyle">
        <el-steps direction="vertical" :active="salaryItemIndex">
          <el-step :title="item" v-for="(item, index) in salaryNames" :key="index"></el-step>
        </el-steps>
        <!--遍历对象，value对象值，title对象key，index索引-->
        <el-input
                v-model="salary[title]"
                style="width: 200px"
                :placeholder="'输入' + salaryNames[index]"
                v-for="(value, title, index) in salary"
                :key="index"
                v-show="salaryItemIndex == index">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="preStep">上一步</el-button>
    <el-button type="primary" @click="nextStep">{{ salaryItemIndex == 10 ? '完成' : '下一步' }}</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SalSob",
  data() {
    return {
      dialogTitle: '',
      salaries: [],
      dialogVisible: false,
      salaryNames: [
              '基本工资',
              '交通补助',
              '午餐补助',
              '奖金',
              '养老金基数',
              '养老金比率',
              '医疗保险基数',
              '医疗保险比率',
              '公积金基数',
              '公积金比率',
              '账套名称'
      ],
      salaryItemIndex: 0,
      salary: {
        basicSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        bonus: 0,
        pensionBase: 0,
        pensionPer: 0.0,
        medicalBase: 0,
        medicalPer: 0.0,
        accumulationFundBase: 0,
        accumulationFundPer: 0.0,
        name: ''
      }
    }
  },
  mounted() {
    this.initSalaries();
  },
  methods: {
    clearSalary() {
      this.salary = {
        basicSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        bonus: 0,
        pensionBase: 0,
        pensionPer: 0.0,
        medicalBase: 0,
        medicalPer: 0.0,
        accumulationFundBase: 0,
        accumulationFundPer: 0.0,
        name: ''
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.salaryItemIndex = 0;
      this.clearSalary();
    },
    preStep() {
      if (this.salaryItemIndex == 0) {
        return;
      }
      this.salaryItemIndex--;
    },
    nextStep() {
      if (this.salaryItemIndex == 10) {
        // 添加数据
        if (this.salary.id) {
          this.putRequest('salary/sob/', this.salary).then(resp => {
            if (resp) {
              this.initSalaries();
            }
          });
        } else {
          this.postRequest('salary/sob/', this.salary).then(resp => {
            if (resp) {
              this.initSalaries();
            }
          });
        }
        // 关闭对话框
        this.dialogVisible = false;
        // 激活的进度条索引归零
        this.salaryItemIndex = -1;
      }
      this.salaryItemIndex++;
    },
    showAddDialog() {
      this.dialogTitle = '添加工资账套';
      this.salary.name = '默认账套'
      this.dialogVisible = true;
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除 [ ' + row.name + ' ] 账套记录，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('salary/sob/' + row.id).then(resp => {
          if (resp) {
            this.initSalaries();
          }
        })
      }).catch(() => {});
    },
    handleEdit(data) {
      this.dialogVisible = true;
      this.dialogTitle = '修改工资账套';
      this.dialogVisible = true;
      this.salary.basicSalary = data.basicSalary;
      this.salary.trafficSalary = data.trafficSalary;
      this.salary.lunchSalary = data.lunchSalary;
      this.salary.bonus = data.bonus;
      this.salary.pensionPer = data.pensionPer;
      this.salary.pensionBase = data.pensionBase;
      this.salary.medicalPer = data.medicalPer;
      this.salary.medicalBase = data.medicalBase;
      this.salary.accumulationFundPer = data.accumulationFundPer;
      this.salary.accumulationFundBase = data.accumulationFundBase;
      this.salary.name = data.name;
      this.salary.id = data.id;
    },
    initSalaries() {
      this.getRequest('salary/sob/').then(resp => {
        if (resp) {
          this.salaries = resp;
        }
      })
    }
  }
}
</script>

<style>
  .diaLogStyle {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
</style>