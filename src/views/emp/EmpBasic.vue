<template>
  <div>
    <div>
      <div style="display: flex;justify-content: space-between">
        <div>
          <el-input
                  :disabled="searchView"
                  clearable
                  @clear="initEmp"
                  placeholder="输入员工名回车搜索员工"
                  prefix-icon="el-icon-search"
                  v-model="name"
                  @keyup.enter.native="searchEmpByName"
                  style="width: 350px;margin-right: 10px"/>
          <el-button type="primary" icon="el-icon-search" @click="initEmp" :disabled="searchView">搜索</el-button>
          <el-button @click="searchView = !searchView" type="primary"><i :class="searchView ? 'fa fa-angle-double-up' : 'fa fa-angle-double-down'"></i>高级搜索</el-button>
        </div>
        <div>
          <el-upload
                  :before-upload="beforeUpload"
                  :on-success="onSuccess"
                  :on-error="onError"
                  :show-file-list="false"
                  style="display: inline-flex; margin-right: 10px"
                  action="/employee/basic/import">
            <el-button type="success" :icon="importDataBtnIcon" :disabled="importDataDisabled">{{ importDataBtnText }}</el-button>
          </el-upload>
          <el-button type="success" icon="el-icon-download" @click="exportData">导出数据</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">添加用户</el-button>
        </div>
      </div>
      <transition name="fade">
        <div v-show="searchView" style="border: 1px solid #409eff; border-radius: 5px; box-sizing: border-box; padding: 5px; margin: 10px 0">
          <el-row>
            <el-col :span="5">
              政治面貌:
              <el-select v-model="searchCondition.politicId" placeholder="政治面貌" size="mini" style="width: 130px">
                <el-option
                        v-for="item in politicsStatus"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              民族:
              <el-select v-model="searchCondition.nationId" placeholder="民族" size="mini" style="width: 130px">
                <el-option
                        v-for="item in nations"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              职位:
              <el-select v-model="searchCondition.posId" placeholder="职位" size="mini" style="width: 130px">
                <el-option
                        v-for="item in positions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              职称:
              <el-select v-model="searchCondition.jobLevelId" placeholder="职称" size="mini" style="width: 130px">
                <el-option
                        v-for="item in jobLevels"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              聘用形式:
              <el-radio-group v-model="searchCondition.engageForm">
                <el-radio label="劳动合同">劳动合同</el-radio>
                <el-radio label="劳务合同">劳务合同</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col :span="5" style="display: flex; align-items: center">
              所属部门:
              <el-popover
                      placement="right"
                      title="选择部门"
                      width="200"
                      trigger="manual"
                      v-model="deptTreeVisible">
                <el-tree
                        :data="departments"
                        :props="defaultProps"
                        @node-click="searchHandleNodeClick"
                        default-expand-all>
                </el-tree>
                <div
                        slot="reference"
                        @click="deptTreeVisible = !deptTreeVisible"
                        style="width: 130px; display: inline-flex; font-size: 13px; border: 1px solid #dedede; height: 26px;border-radius: 5px; cursor: pointer; align-items: center; padding-left: 15px; box-sizing: border-box; margin-left: 3px"
                        v-text="deptTxt">
                </div>
              </el-popover>
            </el-col>
            <el-col :span="10">
              入职日期:
              <el-date-picker
                      size="mini"
                      type="daterange"
                      v-model="searchCondition.beginDateScope"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
            <el-col :span="4" :offset="5">
              <el-button size="mini" @click="advancedCancel">取消</el-button>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="initEmp('advanced')">搜索</el-button>
            </el-col>
          </el-row>
        </div>
      </transition>
    </div>
    <div style="margin-top: 10px">
      <el-table
              v-loading="loading"
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
                label="合同起始日期">
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
            :close-on-click-modal="false"
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
                <el-popover
                        placement="right"
                        title="选择部门"
                        width="200"
                        trigger="manual"
                        v-model="visible">
                  <el-tree
                          :data="departments"
                          :props="defaultProps"
                          @node-click="handleNodeClick"
                          default-expand-all>
                  </el-tree>
                  <div
                          slot="reference"
                          @click="visible = !visible"
                          style="width: 170px;
                          display: inline-flex;
                          font-size: 13px;
                          border: 1px solid #dedede;
                          height: 32px;
                          border-radius: 5px;
                          cursor:pointer;
                          align-items: center;
                          padding-left: 15px;
                          box-sizing: border-box" v-text="deptTxt">
                  </div>
                </el-popover>
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
                <el-radio-group v-model="emp.engageForm" style="margin-top: 10px">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况:" prop="wedlock">
                <el-radio-group v-model="emp.wedlock" style="margin-top: 10px">
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
      // 高级搜索界面的显示隐藏
      searchView: false,
      deptTreeVisible: false,
      // 搜索条件对象
      searchCondition: {
        politicId: null,
        nationId: null,
        posId: null,
        jobLevelId: null,
        engageForm: '',
        departmentId: null,
        beginDateScope: ''
      },
      deptTxt: '所属部门',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 编辑新增部门的显示标识
      visible: false,
      loading: false,
      // 上传双向绑定的图标和上传文字默认值
      importDataBtnText: '导入数据',
      importDataBtnIcon: 'el-icon-upload2',
      importDataDisabled: false,  // 上传时是否disabled按钮默认值
      name: '', // 按名称搜索条件
      emps: [], // 初始化员工数据数组
      departments: [],
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
        nativePlace: "江苏盐城",
        politicId: 13,
        email: "cph979@qq.com",
        phone: "17625958586",
        address: "南京市江宁区",
        departmentId: null,
        jobLevelId: 9,
        posId: 55,
        engageForm: "劳务合同",
        tiptopDegree: "本科",
        specialty: "信息安全",
        school: "南京大学",
        beginDate: "2017-12-31",
        conversionTime: "2018-03-31",
        beginContract: "2017-12-31",
        endContract: "2019-12-31"
      },  // 单个员工json对象数据，用于编辑新增页面数据展示
      total: 0, // 总记录数
      page: 1, // 当前页码
      size: 10, // 每页条数
      multipleSelection: [],  // 批量删除选中的所有row json对象
      dialogVisible: false, // 对话框开关控制变量
      title: '',  // 编辑对话框标题,
      // 验证规则
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
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
    this.initDepartments();
  },
  methods: {
    // 判断是否为高级搜索页面下的刷新
    empInit() {
      if (this.searchView) {
        this.initEmp('advanced');
      } else {
        this.initEmp();
      }
    },
    // 高级搜索取消
    advancedCancel() {
      this.searchView = !this.searchView;
      this.searchCondition = {
        politicId: null,
        nationId: null,
        posId: null,
        jobLevelId: null,
        engageForm: '',
        departmentId: null,
        beginDateScope: ''
      };
      this.deptTxt = '所属部门';
      this.initEmp();
    },
    // 高级搜索部门树点击事件
    searchHandleNodeClick(data) {
      this.deptTxt = data.name;
      this.searchCondition.departmentId = data.id;
      this.deptTreeVisible = !this.deptTreeVisible;
    },
    // 部门树点击事件
    handleNodeClick(data) {
      this.deptTxt = data.name;
      this.emp.departmentId = data.id;
      this.visible = !this.visible;
    },
    // 上传之前回调
    beforeUpload() {
      this.importDataBtnText = '正在上传';
      this.importDataBtnIcon = 'el-icon-loading';
      this.importDataDisabled = true;
    },
    // 上传成功回调
    onSuccess(response) {
      this.importDataBtnText = '导入数据';
      this.importDataBtnIcon = 'el-icon-upload2';
      this.importDataDisabled = false;
      if (response.status == 200) {
        this.$message({
          showClose: true,
          message: '导入成功',
          type: 'success',
          duration: 2000
        });
      } else {
        this.$message({
          showClose: true,
          message: '导入失败',
          type: 'error',
          duration: 2000
        });
      }
      this.initEmp();
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
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.putRequest('/employee/basic', this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.empInit();
              }
            });
          }
        });
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.postRequest('/employee/basic', this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.empInit();
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
        endContract: ''
      };
      this.deptTxt = '选择部门';
    },
    // 获取全部部门数组
    initDepartments() {
      this.getRequest('system/basic/department').then(resp => {
        this.departments = resp;
      })
    },
    // 获取全部职称数组
    initJobLevels() {
      this.getRequest('employee/basic/jobLevels?enabled=true', ).then(resp => {
        this.jobLevels = resp;
      });
    },
    // 获取全部职位数组
    initPositions() {
      this.getRequest('employee/basic/positions?enabled=true', ).then(resp => {
        this.positions = resp;
      });
    },
    // 获取全部民族数组
    initNations() {
      if (!window.sessionStorage.getItem('nation')) {
        this.getRequest('employee/basic/nations', ).then(resp => {
          this.nations = resp;
          window.sessionStorage.setItem('nation', JSON.stringify(resp));
        });
      } else {
        this.nations = JSON.parse(window.sessionStorage.getItem('nation'));
      }
    },
    // 获取全部政治面貌数组
    initPoliticsStatus() {
      if (!window.sessionStorage.getItem('politicsStatus')) {
        this.getRequest('employee/basic/politicsStatus', ).then(resp => {
          this.politicsStatus = resp;
          window.sessionStorage.setItem('politicsStatus', JSON.stringify(resp));
        });
      } else {
        this.politicsStatus = JSON.parse(window.sessionStorage.getItem('politicsStatus'))
      }
    },
    // 显示新增员工对话框
    showAddEmpView() {
      this.dialogVisible = true;
      this.title = '添加员工';
      this.getMaxWorkId();
      this.emptyEmp();
    },
    // 显示编辑对话框
    showEditEmpView(row) {
      this.dialogVisible = true;
      this.title = '编辑员工信息';
      this.deptTxt = row.department.name;
      Object.assign(this.emp, row);
    },
    // 批量删除
    delEmployees() {
      this.$confirm('此操作将永久删除 [ ' + this.multipleSelection.length + ' ] 条记录，是否继续?', '提示', {
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
            this.empInit();
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
      this.$confirm('此操作将永久删除 [ ' + row.name + ' ] ，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/employee/basic/" + row.id).then(resp => {
          if (resp) {
            this.empInit();
          }
        })
      }).catch(() => {});
    },
    // 改变页码后重新设置size刷新页面
    handleSizeChange(currentPageSize) {
      this.size = currentPageSize;
      this.empInit();
    },
    // 改变当前页后重新设置page刷新页面
    handleCurrentChange(currentPageNum) {
      this.page = currentPageNum;
      this.empInit();
    },
    // 通过姓名搜索员工
    searchEmpByName() {
      this.name.trim();
      this.initEmp();
    },
    // 初始化员工数据
    initEmp(type) {
      this.loading = true;
      let url = '/employee/basic?' + 'page=' + this.page + '&size=' + this.size;
      if (type && type == 'advanced') {
        if (this.searchCondition.politicId) {
          url += '&politicId=' + this.searchCondition.politicId;
        }
        if (this.searchCondition.nationId) {
          url += '&nationId=' + this.searchCondition.nationId;
        }
        if (this.searchCondition.posId) {
          url += '&posId=' + this.searchCondition.posId;
        }
        if (this.searchCondition.jobLevelId) {
          url += '&jobLevelId=' + this.searchCondition.jobLevelId;
        }
        if (this.searchCondition.engageForm) {
          url += '&engageForm=' + this.searchCondition.engageForm;
        }
        if (this.searchCondition.departmentId) {
          url += '&departmentId=' + this.searchCondition.departmentId;
        }
        if (this.searchCondition.beginDateScope) {
          url += '&beginDateScope=' + this.searchCondition.beginDateScope;
        }
      } else {
        url += '&name=' + this.name;
      }
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          // 获取员工数据之前先DES解密再转成JSON对象
          resp.obj = JSON.parse(this.decryptDES(resp.obj, this.$store.state.desKey));
          this.emps = resp.obj.data;
          this.total = resp.obj.total;
        }
      })
    },
  },
  // 解决当前页数据全删除仍然请求删除那一页而不是上一页的bug(此bug导致页面空白)
  watch: {
    total() {
      if (this.total == (this.page - 1) * this.size && this.total != 0) {
        this.page -= 1;
        this.initEmp();
      }
    }
  }
}
</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>