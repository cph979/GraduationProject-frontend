<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <div>
        <el-input
                clearable
                @clear="initEmp"
                placeholder="请输入员工名进行搜索，可以直接回车搜索..."
                prefix-icon="el-icon-search"
                v-model="name"
                @keyup.enter.native="searchEmpByName"
                style="width: 350px;margin-right: 10px"/>
        <el-button type="primary">
          <i class="fa fa-angle-double-down"></i>
          高级搜索
        </el-button>
      </div>
      <div>
        <el-upload
                :disabled="importDataDisabled"
                :on-error="onError"
                :on-success="onSuccess"
                :before-upload="beforeUpload"
                :show-file-list="false"
                style="display: inline-flex; margin-right: 10px"
                action="employee/basic/import">
          <el-button :disabled="importDataDisabled" type="success" :icon="importDataBtnIcon">
            {{ importDataBtnText }}
          </el-button>
        </el-upload>
        <el-button type="success" icon="el-icon-download" @click="exportData">导出数据</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">添加用户</el-button>
      </div>
    </div>
    <div style="margin-top: 10px">
      <el-table
              :header-cell-style="{ textAlign: 'center' }"
              :cell-style="{ textAlign: 'center' }"
              :data="emps"
              stripe
              border
              style="width: 100%"
              @selection-change="handleSelectionChange">
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>
        <el-table-column
                prop="name"
                fixed
                label="姓名"
                width="90">
        </el-table-column>
        <el-table-column
                prop="workID"
                label="工号"
                width="85">
        </el-table-column>
        <el-table-column
                prop="gender"
                label="性别"
                width="60">
        </el-table-column>
        <el-table-column
                prop="birthday"
                width="95"
                label="出生日期">
        </el-table-column>
        <el-table-column
                prop="idCard"
                width="150"
                label="身份证号码">
        </el-table-column>
        <el-table-column
                prop="wedlock"
                width="70"
                label="婚姻状况">
        </el-table-column>
        <el-table-column
                prop="nation.name"
                width="60"
                label="民族">
        </el-table-column>
        <el-table-column
                prop="nativePlace"
                width="80"
                label="籍贯">
        </el-table-column>
        <el-table-column
                prop="politicsstatus.name"
                width="100"
                label="政治面貌">
        </el-table-column>
        <el-table-column
                prop="email"
                width="180"
                label="电子邮件">
        </el-table-column>
        <el-table-column
                prop="phone"
                width="100"
                label="电话号码">
        </el-table-column>
        <el-table-column
                prop="address"
                width="220"
                label="联系地址">
        </el-table-column>
        <el-table-column
                prop="department.name"
                width="100"
                label="所属部门">
        </el-table-column>
        <el-table-column
                prop="position.name"
                width="100"
                label="职位">
        </el-table-column>
        <el-table-column
                prop="jobLevel.name"
                width="100"
                label="职称">
        </el-table-column>
        <el-table-column
                prop="engageForm"
                width="100"
                label="聘用形式">
        </el-table-column>
        <el-table-column
                prop="tiptopDegree"
                width="80"
                label="最高学历">
        </el-table-column>
        <el-table-column
                prop="specialty"
                width="130"
                label="专业">
        </el-table-column>
        <el-table-column
                prop="school"
                width="120"
                label="毕业院校">
        </el-table-column>
        <el-table-column
                prop="workState"
                width="80"
                label="在职状态">
        </el-table-column>
        <el-table-column
                prop="beginDate"
                width="95"
                label="入职日期">
        </el-table-column>
        <el-table-column
                prop="conversionTime"
                width="95"
                label="转正日期">
        </el-table-column>
        <el-table-column
                prop="beginContract"
                width="95"
                label="合同开始日期">
        </el-table-column>
        <el-table-column
                prop="endContract"
                width="95"
                label="合同终止日期">
        </el-table-column>
        <el-table-column
                width="100"
                label="合同期限(年)">
          <template slot-scope="scope">
            <el-tag>{{scope.row.contractTerm}}</el-tag>
            年
          </template>
        </el-table-column>
        <el-table-column
                fixed="right"
                width="100"
                label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditEmpView(scope.row)" style="padding: 3px">编辑</el-button>
            <el-button @click="deleteEmp(scope.row)" style="padding: 3px" type="danger">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: space-between; margin-top: 10px">
        <el-button type="danger" @click="delEmployees" :disabled="multipleSelection.length == 0">批量删除</el-button>
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
    <el-dialog
            :before-close="handleClose"
            :title="title"
            :visible.sync="dialogVisible"
            width="80%">
      <div>
        <el-form
                :model="emp"
                :rules="rules"
                ref="empForm">
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名:" prop="name">
                <el-input
                        style="width: 150px"
                        prefix-icon="el-icon-edit"
                        v-model="emp.name"
                        clearable
                        placeholder="输入员工姓名">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="性别:" prop="gender">
                <el-radio-group v-model="emp.gender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期:" prop="birthday">
                <el-date-picker
                        v-model="emp.birthday"
                        type="date"
                        placeholder="选择日期"
                        style="width: 170px;">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="政治面貌:" prop="politicId">
                <el-select
                        v-model="emp.politicId"
                        style="width: 200px"
                        placeholder="选择政治面貌">
                  <el-option
                          v-for="politicsStatu in politicsStatus"
                          :key="politicsStatu.id"
                          :label="politicsStatu.name"
                          :value="politicsStatu.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="民族:" prop="nationId">
                <el-select
                        v-model="emp.nationId"
                        style="width: 150px"
                        placeholder="选择民族">
                  <el-option
                          v-for="item in nations"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="籍贯:" prop="nativePlace">
                <el-input
                        clearable
                        style="width: 150px"
                        prefix-icon="el-icon-edit"
                        v-model="emp.nativePlace"
                        placeholder="输入籍贯">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电子邮箱:" prop="email">
                <el-input
                        clearable
                        style="width: 170px"
                        prefix-icon="el-icon-message"
                        v-model="emp.email"
                        placeholder="输入邮箱">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="联系地址:" prop="address">
                <el-input
                        clearable
                        style="width: 200px"
                        prefix-icon="el-icon-edit"
                        v-model="emp.address"
                        placeholder="输入联系地址">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="职位:" prop="posId">
                <el-select
                        v-model="emp.posId"
                        style="width: 150px"
                        placeholder="选择职位">
                  <el-option
                          v-for="position in positions"
                          :key="position.id"
                          :label="position.name"
                          :value="position.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="职称:" prop="jobLevelId">
                <el-select
                        v-model="emp.jobLevelId"
                        style="width: 150px"
                        placeholder="选择职称">
                  <el-option
                          v-for="jobLevel in jobLevels"
                          :key="jobLevel.id"
                          :label="jobLevel.name"
                          :value="jobLevel.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属部门:" prop="departmentId">
                <el-input
                        placeholder="选择部门"
                        style="width: 170px"
                        v-model="emp.departmentId">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="电话号码:" prop="phone">
                <el-input
                        clearable
                        style="width: 200px"
                        prefix-icon="el-icon-phone"
                        v-model="emp.phone"
                        placeholder="输入电话号码">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="工号:" prop="workID">
                <el-input
                        disabled
                        style="width: 150px"
                        prefix-icon="el-icon-edit"
                        v-model="emp.workID">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="学历:" prop="tiptopDegree">
                <el-select
                        v-model="emp.tiptopDegree"
                        style="width: 150px"
                        placeholder="选择学历">
                  <el-option
                          v-for="(item, index) in tiptopDegrees"
                          :key="index"
                          :label="item"
                          :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="毕业院校:" prop="school">
                <el-input
                        clearable
                        style="width: 170px"
                        prefix-icon="el-icon-edit"
                        v-model="emp.school"
                        placeholder="输入学校">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="专业名称:" prop="specialty">
                <el-input
                        clearable
                        style="width: 200px"
                        prefix-icon="el-icon-edit"
                        v-model="emp.specialty"
                        placeholder="输入专业">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="入职日期:" prop="beginDate">
                <el-date-picker
                        v-model="emp.beginDate"
                        type="date"
                        placeholder="选择日期"
                        style="width: 130px;">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="转正日期:" prop="conversionTime">
                <el-date-picker
                        v-model="emp.conversionTime"
                        type="date"
                        placeholder="选择日期"
                        style="width: 130px;">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同开始日期:" prop="beginContract">
                <el-date-picker
                        v-model="emp.beginContract"
                        type="date"
                        placeholder="选择日期"
                        style="width: 130px;">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同终止日期:" prop="endContract">
                <el-date-picker
                        v-model="emp.endContract"
                        type="date"
                        placeholder="选择日期"
                        style="width: 130px;">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号码:" prop="idCard">
                <el-input
                        clearable
                        style="width: 195px"
                        prefix-icon="el-icon-edit"
                        v-model="emp.idCard"
                        placeholder="输入身份证号码">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="聘用形式:" prop="engageForm">
                <el-radio-group v-model="emp.engageForm">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况:" prop="wedlock">
                <el-radio-group v-model="emp.wedlock">
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearValidatesMethod">取 消</el-button>
        <el-button type="primary" @click="submitForm('empForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EmpBasic",
  data() {
    return {
      // 上传双向绑定的图标和上传文字默认值
      importDataBtnText: '导入数据',
      importDataBtnIcon: 'el-icon-upload2',
      importDataDisabled: false,  // 上传时是否disabled按钮默认值

      name: '', // 按名称搜索条件
      emps: [], // 初始化员工数据数组
      politicsStatus: [],
      nations: [],
      positions: [],
      jobLevels: [],
      tiptopDegrees: ['博士', '硕士', '本科', '大专', '高中', '初中', '小学'],
      emp: {
        name: "cph",
        workID: "00000957",
        gender: "男",
        birthday: "1997-09-13",
        idCard: "320928199709130031",
        wedlock: "已婚",
        nationId: 1,
        nativePlace: "江苏",
        politicId: 13,
        email: "cph979@qq.com",
        phone: "17625958586",
        address: "南京市江宁区",
        departmentId: 1,
        jobLevelId: 9,
        posId: 29,
        engageForm: "劳务合同",
        tiptopDegree: "本科",
        specialty: "信息安全",
        school: "南京大学",
        beginDate: "2017-12-31",
        conversionTime: "2018-03-31",
        beginContract: "2017-12-31",
        endContract: "2019-12-31",
      },  // 单个员工json对象数据，用于编辑新增页面数据展示
      total: 0, // 总记录数
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页条数
      multipleSelection: [],  // 批量删除选中的所有row json对象
      dialogVisible: false, // 对话框开关控制变量
      title: '',  // 编辑对话框标题,
      // 验证规则
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        birthday: [{ required: true, message: '请选择出生日期', trigger: 'blur' }],
        politicId: [{ required: true, message: '请选择政治面貌', trigger: 'blur' }],
        nationId: [{ required: true, message: '请选择民族', trigger: 'blur' }],
        nativePlace: [{ required: true, message: '请输入籍贯', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱地址格式错误', trigger: 'blur' }
        ],
        address: [{ required: true, message: '请输入联系地址', trigger: 'blur' }],
        posId: [{ required: true, message: '请选择职位', trigger: 'blur' }],
        jobLevelId: [{ required: true, message: '请选择职称', trigger: 'blur' }],
        departmentId: [{ required: true, message: '请选择所属部门', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          {
            pattern: /(^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$)/,
            message: '电话号码格式错误',
            trigger: 'blur'
          }
        ],
        workID: [{ required: true, message: '', trigger: 'blur' }],
        tiptopDegree: [{ required: true, message: '请选择学历', trigger: 'blur' }],
        school: [{ required: true, message: '请输入毕业院校', trigger: 'blur' }],
        specialty: [{ required: true, message: '请输入专业名称', trigger: 'blur' }],
        beginDate: [{ required: true, message: '请选择入职日期', trigger: 'blur' }],
        conversionTime: [{ required: true, message: '请选择转正日期', trigger: 'blur' }],
        beginContract: [{ required: true, message: '请选择合同开始日期', trigger: 'blur' }],
        endContract: [{ required: true, message: '请选择合同终止日期', trigger: 'blur' }],
        idCard: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          {
            pattern: /(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$)/,
            message: '身份证号码格式错误',
            trigger: 'blur'
          }
        ],
        engageForm: [{ required: true, message: '请选择聘用形式', trigger: 'blur' }],
        wedlock: [{ required: true, message: '请选择婚姻状况', trigger: 'blur' }],
      }
    }
  },
  mounted() {
    this.initEmp();
    this.initPoliticsStatus();
    this.initNations();
    this.initPositions();
    this.initJobLevels();
  },
  methods: {
    // 上传之前回调
    beforeUpload() {
      this.importDataBtnText = '正在上传';
      this.importDataBtnIcon = 'el-icon-loading';
      this.importDataDisabled = true;
    },
    // 上传成功回调
    onSuccess() {
      this.importDataBtnText = '导入数据';
      this.importDataBtnIcon = 'el-icon-upload2';
      this.importDataDisabled = false;
    },
    // 上传失败回调
    onError() {
      this.importDataBtnText = '导入数据';
      this.importDataBtnIcon = 'el-icon-upload2';
      this.importDataDisabled = false;
    },
    // 上传失败回调
    // 对话框点×关闭回调
    handleClose() {
      this.clearValidatesMethod();
    },
    // clearValidate 移除校验结果，解决点击新增校验未通过后，点击编辑校验仍然不通过bug
    clearValidatesMethod() {
      this.dialogVisible = false;
      this.$refs.empForm.clearValidate();
    },
    // 新增和更新的表单验证
    submitForm(formName) {
      // 有id是更新，反之新增
      if (this.emp.id) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.putRequest('/employee/basic', this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmp();
              }
            });
          }
        });
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.postRequest('/employee/basic', this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmp();
              }
            })
          }
        });
      }
    },
    // 新增员工时，获取数据库目前最大工号
    getMaxWorkId() {
      this.getRequest('employee/basic/maxWorkID').then(resp => {
        this.emp.workID = resp.obj;
      })
    },
    emptyEmp() {
      this.emp = {
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: null,
        nativePlace: '',
        politicId: null,
        email: '',
        phone: '',
        address: '',
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workID: '',
        conversionTime: '',
        notworkDate: null,
        beginContract: '',
        endContract: '',
      }
    },
    // 获取全部职称数组
    initJobLevels() {
      this.getRequest('employee/basic/jobLevels', ).then(resp => {
        this.jobLevels = resp;
      });
    },
    // 获取全部职位数组
    initPositions() {
      this.getRequest('employee/basic/positions', ).then(resp => {
        this.positions = resp;
      });
    },
    // 获取全部民族数组
    initNations() {
      this.getRequest('employee/basic/nations', ).then(resp => {
        this.nations = resp;
      });
    },
    // 获取全部政治面貌数组
    initPoliticsStatus() {
      this.getRequest('employee/basic/politicsStatus', ).then(resp => {
        this.politicsStatus = resp;
      });
    },
    // 显示新增员工对话框
    showAddEmpView() {
      this.dialogVisible = true;
      this.title = '添加员工';
      this.getMaxWorkId();
      // this.emptyEmp();
    },
    // 显示编辑对话框
    showEditEmpView(row) {
      this.dialogVisible = true;
      this.title = '编辑员工信息';
      Object.assign(this.emp, row);
    },
    // 批量删除
    delEmployees() {
      this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let positionsArray = [];
        this.multipleSelection.forEach(item => {
          positionsArray.push(item.id);
        })
        this.deleteRequestData('/employee/basic', positionsArray).then(resp => {
          if (resp) {
            this.initEmp();
          }
        })
      }).catch(() => {});
    },
    // 拿到选中所有行json对象
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    // 处理导出操作
    exportData() {
      // 点击导出在当前窗口打开
      window.open('/employee/basic/export', '_parent');
    },
    // 单个删除json对象
    deleteEmp(row) {
      this.$confirm('此操作将永久删除【' + row.name + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/employee/basic/" + row.id).then(resp => {
          if (resp) {
            this.initEmp();
          }
        })
      }).catch(() => {});
    },
    // 改变页码后重新设置pageSize刷新页面
    handleSizeChange(currentPageSize) {
      this.pageSize = currentPageSize;
      this.initEmp();
    },
    // 改变当前页后重新设置pageNum刷新页面
    handleCurrentChange(currentPageNum) {
      this.pageNum = currentPageNum;
      this.initEmp();
    },
    // 通过姓名搜索员工
    searchEmpByName() {
      if (this.name.trim()) {
        this.initEmp();
      } else {
        this.$message({
          type: 'warning',
          message: '搜索条件不可以为空！',
          duration:2000, showClose:true
        });
      }
    },
    // 初始化员工数据
    initEmp() {
      this.getRequest('/employee/basic?pageNum=' + this.pageNum + '&pageSize=' + this.pageSize + '&name=' + this.name).then(resp => {
        this.emps = resp.data;
        this.total = resp.total;
      })
    },
  },
  // 解决当前页数据全删除仍然请求删除那一页而不是上一页的bug(此bug导致页面空白)
  watch: {
    total() {
      if (this.total == (this.pageNum - 1) * this.pageSize /*&& this.total != 0*/) {
        this.pageNum -= 1;
        this.initEmp();
      }
    }
  }
}
</script>

<style>

</style>