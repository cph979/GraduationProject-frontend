<template>
  <div style="width: 500px">
    <el-input
            prefix-icon="el-icon-search"
            placeholder="输入部门名称进行搜索"
            v-model="filterText">
    </el-input>
    <el-tree
            :expand-on-click-node="false"
            style="margin-top: 20px"
            :data="departments"
            :props="defaultProps"
            :filter-node-method="filterNode"
            ref="tree">
      <span style="display: flex; justify-content: space-between; width: 100%" slot-scope="{ node, data }"> <!-- data为当前json对象 -->
        <span>{{ data.name }}</span>
        <span>
          <el-button
                  class="depBtn"
                  type="primary"
                  size="mini"
                  @click="() => showAddDepView(data)">
            添加部门
          </el-button>
          <el-button
                  class="depBtn"
                  type="danger"
                  size="mini"
                  @click="() => deleteDep(data)">
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
            title="添加部门"
            :visible.sync="dialogVisible"
            width="40%">
      <div>
        <table>
          <tr>
            <td><el-tag style="margin-right: 8px">上级部门</el-tag></td>
            <td><span v-text="depName"></span></td>
          </tr>
          <tr>
            <td><el-tag>部门名称</el-tag></td>
            <td><el-input v-model="dep.name" placeholder="请输入部门名称"></el-input></td>
          </tr>
        </table>
      </div>
      <span slot="footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddDep">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DepMana",
  data() {
    return {
      currentTreeNode: null,  // 当前点击的树的json对象
      dep: {
        name: '',
        parentId: -1
      },
      depName: '',  // 点击添加的部门名，即上级部门名
      dialogVisible: false,
      filterText: '',
      departments: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    this.initDepartments();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    // 删除部门数组的一项
    removeDepFromDeps(p, deps, id) {
      for (let i = 0; i < deps.length; i++) {
        let dept = deps[i];
        if (dept.id == id) {
          deps.splice(i, 1);
          if (deps.length == 0) {
            p.parent = false;
          }
          return;
        }
          this.removeDepFromDeps(dept, dept.children, id);
        }
    },
    initDep() {
      this.dep = {
        name: '',
        parentId: -1
      }
      this.depName = '';
    },
    // 递归给部门树添加新部门
    // addDep2Deps(deps, dep) {
    //   for (let i = 0; i < deps.length; i++) {
    //     let d = deps[i];
    //     if (d.id == dep.parentId) {
    //       d.children = d.children.concat(dep);
    //       return;
    //     }
    //     this.addDep2Deps(d.children, dep);
    //   }
    // },
    doAddDep() {
      if (this.dep.name.trim()) {
        this.postRequest('system/basic/department', this.dep).then(resp => {
          if (resp) {
            // this.initDepartments，直接刷新会导致部门树收起来，动态添加一条数据到this.departments数组
            // 将一条新增部门添加到部门json数组
            // this.addDep2Deps(this.departments, resp.obj);
            this.currentTreeNode.children = this.currentTreeNode.children.concat(resp.obj);
            this.currentTreeNode.parent = true;
            // this.initDepartments();
            this.dialogVisible = false;
            // 初始化变量
            this.initDep();
          }
        });
      } else {
        this.$message.error('请输入部门名称');
      }
    },
    showAddDepView(data) {
      this.dep.parentId = data.id;
      this.depName = data.name;
      this.currentTreeNode = data;
      this.dialogVisible = true;
    },
    deleteDep(data) {
      if (data.parent) {
        this.$message.error('父部门无法删除');
      } else {
        this.$confirm('此操作将永久删除 [ ' + data.name + ' ] 部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("/system/basic/department/" + data.id).then( resp => {
            if (resp) {
              this.removeDepFromDeps(null, this.departments, data.id);
            }
          })
        }).catch(() => {});
      }
    },
    initDepartments() {
      this.getRequest('system/basic/department').then(resp => {
        if (resp) {
          this.departments = resp;
        }
      })
    },
    filterNode(value, data) {
      // 返回true表示当前data展示，反之不展示，data为一个树的json数据
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
  }
}
</script>

<style>
  .depBtn {
    padding: 2px;
  }
</style>