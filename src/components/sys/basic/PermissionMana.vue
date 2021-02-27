<template>
  <div>
    <div class="permissionManageTool">
      <el-input placeholder="输入角色英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input
              placeholder="输入角色中文名"
              v-model="role.nameZh"
              @keydown.enter.native="doAddRole"
      >
      </el-input>
      <el-button
              type="primary"
              icon="el-icon-plus"
              @click="doAddRole">
        添加角色
      </el-button>
    </div>
    <div class="permissionManageMain">
      <el-collapse
              v-model="activeName"
              accordion
              @change="handleChange">
        <el-collapse-item
                :title="role.nameZh"
                :name="role.id"
                v-for="(role,index) in roles"
                :key="index">
          <el-card shadow="hover">
            <div slot="header">
              <span>可访问的资源</span>
              <el-button
                      style="float: right; padding: 3px 0;color: #ff0000;"
                      icon="el-icon-delete"
                      type="text"
                      @click="deleteRole(role)">
              </el-button>
            </div>
            <div>
              <el-tree
                      ref="treeMethod"
                      :default-checked-keys="selectedMenus"
                      node-key="id"
                      show-checkbox
                      :data="allMenus"
                      :props="defaultProps">
              </el-tree>
              <div style="display: flex; justify-content: flex-end">
                <el-button @click="cancelUpdate">取消修改</el-button>
                <el-button type="primary" @click="doUpdate(role.id, index)">确认修改</el-button>
              </div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "PermissionMana",
  data() {
    return {
      activeName: -1,
      currentNodeKey: [],
      // 当前角色所拥有的菜单项
      selectedMenus: [],
      // 所有菜单对象
      allMenus: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 所有角色
      roles: [],
      // 添加角色json对象
      role: {
        name: '',
        nameZh: ''
      }
    }
  },
  mounted() {
    this.initRoles();
  },
  methods: {
    // 取消更新
    cancelUpdate() {
      this.activeName = -1;
    },
    // 添加角色
    doAddRole() {
      if (this.role.name && this.role.nameZh) {
        this.postRequest('/system/basic/permission', this.role).then(resp => {
          if (resp) {
            this.role.name = '';
            this.role.nameZh = '';
            this.initRoles();
          }
        })
      } else {
        this.$message.warning('请输入完整数据');
      }
    },
    // 修改角色可访问的菜单项
    // rid为某个角色的具体id，index为所有树形控件中的一条记录
    doUpdate(rid, index) {
      let tree = this.$refs.treeMethod[index];
      let selectedKeys = tree.getCheckedKeys(true);
      let url = '/system/basic/permission?rid=' + rid;
      selectedKeys.forEach(key => {
        url += '&mid=' + key;
      });
      this.putRequest(url);
    },
    // 拿到当前角色拥有的菜单项的所有id
    initSelectedMenus(rid) {
      this.getRequest('/system/basic/permission/' + rid).then(resp => {
        this.selectedMenus = resp;
      })
    },
    // 初始化全部菜单项
    initAllMenus() {
      this.getRequest('/system/basic/permission/menus').then(resp => {
        if (resp) {
          this.allMenus = resp;
        }
      })
    },
    // 当选择手风琴角色id变化时，初始化角色数据和角色所具备的权限
    handleChange(rid) {
      if (rid) {
        this.selectedMenus = [];
        this.initAllMenus();
        this.initSelectedMenus(rid);
      }
    },
    // 删除角色同时删除菜单角色表的记录
    deleteRole(role) {
      this.$confirm('此操作将永久删除 [ ' + role.nameZh + ' ] 角色，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/permission/del/mid/' + role.id).then(resp => {
          if (resp) {
            this.initRoles();
          }
        })
      }).catch(() => {});
    },
    // 初始化角色数据
    initRoles() {
      this.getRequest('/system/basic/permission').then(resp => {
        if (resp) {
          this.roles = resp;
        }
      });
    }
  }
}
</script>

<style>
  .permissionManageTool {
    display: flex;
    justify-content: flex-start;
  }
  .permissionManageTool .el-input {
    width: 300px;
    margin-right: 6px;
  }
  .permissionManageMain {
    margin-top: 10px;
    width: 700px;
  }
</style>