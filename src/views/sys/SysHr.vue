<template>
  <div>
    <div style="margin-top: 10px; display: flex; justify-content: center">
      <el-input
              clearable
              @clear="initHrs"
              v-model="keywords"
              placeholder="输入用户名回车搜索用户"
              prefix-icon="el-icon-search"
              style="width: 400px; margin-right: 10px" @keydown.enter.native="initHrs"></el-input>
      <el-button icon="el-icon-search" type="primary" @click="initHrs">搜索</el-button>
    </div>
    <div class="hrContainer">
      <el-card class="hrCard" v-for="hr in hrs" :key="hr.id">
        <div slot="header">
          <span v-text="hr.name"></span>
          <el-button
                  style="float: right; padding: 3px 0; color: red"
                  type="text"
                  icon="el-icon-delete"
                  @click="deleteHr(hr)">
          </el-button>
        </div>
        <div>
          <div class="userMsg">
            <img :src="hr.userface" :alt="hr.name" :title="hr.name" class="userface">
          </div>
          <div class="userMsgDetail">
            <div class="detailText">
              <div>用户名：{{ hr.name }}</div>
              <div>手机号码：{{ hr.phone }}</div>
              <div>地址：{{ hr.address }}</div>
              <div>
                <el-switch
                        @change="enabledChange(hr)"
                        v-model="hr.enabled"
                        active-text="启用"
                        inactive-text="禁用">
                </el-switch>
              </div>
              <div>用户角色：<el-tag style="margin-right: 3px" v-for="(role, indexJ) in hr.roles" :key="indexJ">{{ role.nameZh }}</el-tag>
                <el-popover
                        @show="showPopover(hr.roles)"
                        @hide="hidePopover(hr)"
                        placement="right"
                        title="角色列表"
                        width="200"
                        trigger="click">
                  <el-select v-model="selectedRoleIds" multiple placeholder="请选择角色">
                    <el-option
                            v-for="(role, indexK) in allRoles"
                            :key="indexK"
                            :label="role.nameZh"
                            :value="role.id">
                    </el-option>
                  </el-select>
                  <el-button slot="reference" icon="el-icon-more" type="text"></el-button>
                </el-popover>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "SysHr",
  data() {
    return {
      keywords: '',
      hrs: [],
      enabledHr: {
        id: null,
        enabled: false
      },
      allRoles: [],
      selectedRoleIds: [],
    }
  },
  mounted() {
    this.initHrs();
  },
  methods: {
    deleteHr(hr) {
      this.$confirm('此操作将永久删除 [ ' + hr.name +' ] 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('system/hr/' + hr.id).then(resp => {
          if (resp) {
            this.initHrs();
          }
        })
      }).catch(() => {});
    },
    hidePopover(hr) {
      // 此操作是为了点击展开所有角色，分配角色却不选择后端不做更新操作
      let role = hr.roles;
      let flag = false;
      if (role.length != this.selectedRoleIds.length) {
        flag = true;
      } else {
        let cnt = 0;
        for (let i = 0; i < role.length; i++) {
          let beforeRid = role[i].id;
          for (let j = 0; j < this.selectedRoleIds.length; j++) {
            if (beforeRid == this.selectedRoleIds[i]) {
              cnt++;
              break;
            }
          }
        }
        if (role.length != cnt) {
          flag = true;
        }
      }

      if (flag) {
        let url = 'system/hr/roles?hrid=' + hr.id;
        this.selectedRoleIds.forEach(rid => {
          url += "&rids=" + rid;
        })
        this.putRequest(url).then(resp => {
          if (resp) {
            this.initHrs();
          }
        })
      }
    },
    showPopover(roles) {
        this.initAllRoles();
        this.selectedRoleIds = [];
        roles.forEach(role => {
            this.selectedRoleIds.push(role.id);
        });
    },
    initAllRoles() {
      this.getRequest('system/hr/roles').then(resp => {
        if (resp) {
          this.allRoles = resp;
        }
      })
    },
    enabledChange(hr) {
      this.enabledHr.id = hr.id;
      this.enabledHr.enabled = hr.enabled;
      this.putRequest('system/hr', this.enabledHr).then(resp => {
        if (resp) {
          this.initHrs();
        }
      })
    },
    initHrs() {
     this.getRequest('system/hr?name=' + this.keywords.trim()).then(resp => {
       if (resp) {
         this.hrs = resp;
       }
     })
    }
  }
}
</script>

<style>
  .detailText {
    font-size: 13px;
    color: #409eff;
  }
  .userMsgDetail {
    margin-top: 20px;
  }
  .userMsg {
    display: flex;
    justify-content: center;
  }
  .userface {
    width: 72px;
    height: 72px;
    border-radius: 72px;
  }
  .hrContainer {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .hrCard {
    width: 350px;
    margin-bottom: 20px;
  }
</style>