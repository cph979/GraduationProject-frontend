<template>
  <div>
    <div>
      <el-input
          class="addPosInput"
          placeholder="添加职位"
          prefix-icon="el-icon-plus"
          @keyup.enter.native="addPosition"
          v-model="pos.name">
      </el-input>
      <el-button
              icon="el-icon-plus"
              type="primary"
              @click="addPosition"
              @keyup.enter="addPosition">
        添加
      </el-button>
    </div>
    <div class="posManageMain">
      <el-table
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          :data="positions"
          stripe
          border
          @selection-change="handleSelectionChange"
          style="width: 60%">
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
                label="职位名称"
                width="140">
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
        @click="delPositionS"
        style="margin-top: 10px"
        :disabled="multipleSelection.length == 0">
      批量删除
    </el-button>
    <el-dialog
        :close-on-click-modal="false"
        title="修改职位"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <el-tag size="medium">职位名称</el-tag>
        <el-input class="updatePosInput" v-model="updatePos.name"></el-input>
      </div>
      <div style="margin-top: 10px">
        <el-tag size="medium" style="margin-right: 8px">是否启用</el-tag>
        <el-switch
                v-model="updatePos.enabled"
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
  name: "PosMana",
  data() {
    return {
      pos: {
        name: '',
      },
      updatePos: {
        name: '',
        enabled:null
      },
      dialogVisible: false,
      positions: [],
      multipleSelection:[]
    }
  },
  mounted() {
    this.initPositions();
  },
  methods: {
    doUpdate() {
      this.updatePos.name.trim();
      console.log(this.updatePos);
      this.putRequest('system/basic/pos', this.updatePos).then(resp => {
        if (resp) {
          this.initPositions();
          // this.updatePos.name = '';
          this.dialogVisible = false;
        }
      })
    },
    // 展示编辑职位弹出层
    handleEdit(row) {
      Object.assign(this.updatePos, row);
      this.dialogVisible = true;
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    // 删除单个职位
    handleDelete(row) {
      this.$confirm('此操作将永久删除 [ ' + row.name + ' ] 职位，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/system/basic/pos/" + row.id).then(resp => {
          if (resp) {
            this.initPositions();
          }
        })
      }).catch(() => {});
    },
    // 拿到职位数据，初始化表格
    initPositions() {
      this.getRequest('/system/basic/pos').then(resp => {
        this.positions = resp;
      })
    },
    // 添加职位
    addPosition() {
      if (this.pos.name.trim()) {
        this.postRequest('/system/basic/pos', this.pos).then(resp => {
          if (resp) {
            this.initPositions();
            this.pos.name = '';
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '职位名称不可以为空',
          duration:2000, showClose:true
        });
      }
    },
    // 批量删除职位对象
    delPositionS() {
      this.$confirm('此操作将永久删除 [ ' + this.multipleSelection.length + ' ] 条记录，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 将职位数组对象的id添加到新数组，以json传到后端[xx, xx, xx]
        let positionsArray = [];
        this.multipleSelection.forEach(item => {
          positionsArray.push(item.id);
        })
        // console.log(positionsArray);
        this.deleteRequestData('/system/basic/pos', positionsArray).then(resp => {
          if (resp) {
            this.initPositions();
          }
        })
      }).catch(() => {});
    }
  }
}
</script>

<style>
 .addPosInput {
   width: 300px;
   margin-right: 8px;
 }
 .updatePosInput {
   width: 200px;
   margin-left: 8px;
 }
 .posManageMain {
   margin-top: 10px;
 }
</style>