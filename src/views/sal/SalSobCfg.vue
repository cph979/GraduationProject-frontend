<template>
  <div>
    <el-table
            size="mini"
            :data="data"
            border
            stripe
            :header-cell-style="{ textAlign: 'center' }"
            :cell-style="{ textAlign: 'center' }">
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="工号" prop="workID"></el-table-column>
      <el-table-column label="电子邮件" prop="email"></el-table-column>
      <el-table-column label="电话号码" prop="phone"></el-table-column>
      <el-table-column label="所属部门" prop="department.name"></el-table-column>
      <el-table-column label="所属账套">
        <template slot-scope="scope">
          <el-tooltip placement="right" v-if="scope.row.salary">
            <div slot="content">
              <table>
                <tr>
                  <td>基本工资</td>
                  <td>{{ scope.row.salary.basicSalary }}</td>
                </tr>
                <tr>
                  <td>交通补助</td>
                  <td>{{ scope.row.salary.trafficSalary }}</td>
                </tr>
                <tr>
                  <td>午餐补助</td>
                  <td>{{ scope.row.salary.lunchSalary }}</td>
                </tr>
                <tr>
                  <td>奖金</td>
                  <td>{{ scope.row.salary.bonus }}</td>
                </tr>
                <tr>
                  <td>养老金基数</td>
                  <td>{{ scope.row.salary.pensionBase }}</td>
                </tr>
                <tr>
                  <td>养老金比率</td>
                  <td>{{ scope.row.salary.pensionPer }}</td>
                </tr>
                <tr>
                  <td>医疗保险基数</td>
                  <td>{{ scope.row.salary.medicalBase }}</td>
                </tr>
                <tr>
                  <td>医疗保险比率</td>
                  <td>{{ scope.row.salary.medicalPer }}</td>
                </tr>
                <tr>
                  <td>公积金基数</td>
                  <td>{{ scope.row.salary.accumulationFundBase }}</td>
                </tr>
                <tr>
                  <td>公积金比率</td>
                  <td>{{ scope.row.salary.accumulationFundPer }}</td>
                </tr>
                <tr>
                  <td>启用时间</td>
                  <td>{{ scope.row.salary.createDate }}</td>
                </tr>
              </table>
            </div>
            <el-tag>{{ scope.row.salary.name }}</el-tag>
          </el-tooltip>
          <el-tag v-else>暂未设置</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-popover
                  @show="showPopover(scope.row)"
                  @hide="hidePopover(scope.row)"
                  placement="left"
                  title="修改工资账套"
                  width="200"
                  trigger="click">
            <el-select v-model="currentSalary" placeholder="请选择账套">
              <el-option
                      v-for="item in salaries"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
              </el-option>
            </el-select>
            <el-button slot="reference" type="danger">修改工资账套</el-button>
          </el-popover>

        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px">
      <el-pagination
              background
              layout="prev, pager, next, sizes, total"
              :total="total"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="10"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              style="display: flex;justify-content: flex-end">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "SalSobCfg",
  data() {
    return {
      data: [],
      total: 0,
      page: 1,
      size: 10,
      salaries: [],
      currentSalary: null
    }
  },
  mounted() {
    this.initAllEmpWithSalary();
    this.initSalaries();
  },
  methods: {
    hidePopover(row) {
      if (this.currentSalary) {
        this.putRequest('/salary/sobcfg?eid=' + row.id + '&sid=' + this.currentSalary).then(resp => {
          if (resp) {
            this.initAllEmpWithSalary();
          }
        })
      }
    },
    showPopover(row) {
      if (row.salary) {
        this.currentSalary = row.salary.id;
      } else {
        this.currentSalary = null;
      }
    },
    initSalaries() {
      this.getRequest('/salary/sob/').then(resp => {
        if (resp) {
          this.salaries = resp;
        }
      })
    },
    handleSizeChange(size) {
      this.size = size;
      this.initAllEmpWithSalary();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.initAllEmpWithSalary();
    },
    initAllEmpWithSalary() {
      this.getRequest('/salary/sobcfg?page=' + this.page + '&size=' + this.size).then(resp => {
        if (resp) {
          this.data = resp.data;
          this.total = resp.total;
        }
      })
    }
  }
}
</script>

<style>

</style>