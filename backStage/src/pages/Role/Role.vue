<template>
  <div id="equipment">
    <div class="router">
      <div :class="{title:true,activedRouter:v.type==activedRouter}" v-for="(v,i) in list" :key="i" @click="change(v)">{{ v.name }}</div>
    </div>
    <div id="manager">
      <div class="addmanager" @click="update('add')">
        <div>+</div>新建{{name}}
      </div>
      <div class="msg">当前{{name}}账号使用情况：可使用（{{adminTip.use1}}） 可新建（{{adminTip.new1}}） 已冻结（{{adminTip.freeze1}}）</div>
      <el-table :data="tableData1" :style="tabelStale" row-key="id" height="42rem" row-style="height:3.9rem" >

        <el-table-column prop="name" label="管理员"></el-table-column>
        <el-table-column prop="tel" label="手机号"></el-table-column>
        <el-table-column label="使用状态">
          <template slot-scope="scope">
            <div :style="{color:(scope.row.status === 1?'#30C340':'#005EFF')}">
              {{scope.row.status | filterStatus}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime | filterTime}}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <div v-show="scope.row.status===1">
              <el-button type="text" class="operation" @click="update('edit',scope.row)">修改</el-button>
              <el-button type="text" class="operation" @click="restore(scope.row.empId,'冻结')">冻结</el-button>
            </div>
            <div v-show="scope.row.status!==1">
              <el-button type="text" class="operation" @click="restore(scope.row.empId,'恢复')">恢复</el-button>
            </div>
            <el-button type="text" class="operation" @click="restore(scope.row.empId,'删除')">&nbsp;&nbsp;&nbsp;删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 新增/修改角色 -->
      <el-dialog :title="diogType==='add'?'新增管理员':'修改账号信息'" @closed="closeDialog('form')" :visible.sync="dialogFormVisible" width="42.1875rem">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="mini">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" :disabled="diogType!=='add'" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="repassword">
            <el-input type="password" v-model="form.repassword" autocomplete="off"></el-input>

          </el-form-item>
          <el-form-item label="手机号" prop="tel">
            <el-input v-model="form.tel" autocomplete="off"></el-input>

          </el-form-item>
          <div class="footer">
            <el-button size="medium" @click="submitForm('form',diogType)">确 定</el-button>
          </div>
        </el-form>

      </el-dialog>
    </div>
    <div class="jumppage">
      <el-pagination @current-change="handleCurrentChange" background="true" pager-count="4" :current-page="jumppage.page" :page-size="jumppage.size" layout=" prev, pager, next, total,jumper" :total="jumppage.total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { roleFindAll, addRole, updateRole, delRole, freezeRole, screeningRole, restoreRole } from "@/apis/api";
import moment from "moment";
export default {
  data () {
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    let checkPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('手机号不能为空'));
      } else {
        const reg = /^1\d{10}$/
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error('请输入正确的手机号'));
        }
      }
    };
    return {
      adminTip: {
        freeze1: '',
        use1: '',
        new1: '',
      },
      jumppage: {
        page: 1,
        size: 10,
        total: 100
      },//分页
      name: "管理员",
      type: 1,
      list: [
        {
          name: "管理员",
          type: 1
        },
        {
          name: "专家",
          type: 3
        }
      ],
      activedRouter: 1,
      status: null,
      diogType: 'add',//add 增加  edit 修改
      tabelStale:
        "width:100%;background:none;border:1px solid #274F60;border-radius:10px 10px 0 0;overflow:auto;font-size:1rem",
      tableData1: [],
      form: {},
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, {
          min: 6, max: 12, message: '请输入6-12位密码', trigger: 'blur'
        }],
        repassword: [{ required: true, message: '请再次输入密码', trigger: 'blur' }, {
          validator: validatePass2,
        }],
        tel: [{ validator: checkPhone, trigger: 'blur' }]

      },
    };
  },
  created () {
    this.getRole();
    this.screening();
  },
  filters: {
    filterStatus (status) {
      return status === 1 ? "正常" : "冻结"
    },
    filterTime (time) {
      return moment(time).format("YYYY/MM/DD   HH:mm")
    }

  },
  methods: {
    handleCurrentChange (val) {
      this.jumppage.page = val;
      this.getRole();
    },
    change (v) {
      this.activedRouter = v.type;
      this.type = v.type;
      this.getRole();
      this.screening();
      this.name = v.type === 1 ? "管理员" : "专家"
    },

    // 恢复||删除||冻结
    restore (empId, type) {
      let params = {}
      if (type == "恢复") {
        params = {
          title: '此操作将恢复该文件, 是否继续?',
          searchFn: restoreRole,
          questData: {
            empId,
            type: this.type
          }
        }
      } else if (type == "删除") {
        params = {
          title: '此操作将永久删除该文件, 是否继续?',
          searchFn: delRole,
          questData: {
            empId
          }
        }
      } else if (type == "冻结") {
        params = {
          title: '此操作将冻结该文件, 是否继续?',
          searchFn: freezeRole,
          questData: {
            empId
          }
        }
      }
      else {
        return
      }
      this.$confirm(params.title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        params.searchFn(params.questData).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.getScreeningRole();
          this.getRole();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },

    //修改
    update (type, row) {
      this.form = row ? { ...row } : {}
      this.diogType = type
      this.dialogFormVisible = true;
    },
    closeDialog (formName) {
      this.$refs[formName].resetFields();
    },
    // 新增/修改用户
    submitForm (formName, diogType) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          diogType === 'add' ? this.addRole() : this.updateRole();
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    // 查询角色
    getRole () {

      let { page, size, } = this.jumppage
      let params = {
        type: this.type,
        page,
        size,
      }
      roleFindAll(params).then(res => {
        let arr = res.data.records
        this.tableData1 = arr;
        this.jumppage.total = res.data.total;
      })
    },
    //筛选
    screening () {
      if (sessionStorage.adminTipData) {
        this.typefilter(JSON.parse(sessionStorage.adminTipData))
      } else {
        this.getScreeningRole();
      }
    },
    getScreeningRole () {
      screeningRole().then(res => {
        this.typefilter(res.data)
        sessionStorage.adminTipData = JSON.stringify(res.data)
      })
    },
    typefilter (data) {
      if (this.type === 1) {
        this.adminTip.freeze1 = data.normalManagerFrozen;
        //可使用
        this.adminTip.use1 = data.normalManagerSurplus;
        //   新建
        this.adminTip.new1 = data.normalManager;
      } else {
        this.adminTip.freeze1 = data.normalSpecialistFrozen;
        this.adminTip.use1 = data.normalSpecialist;
        this.adminTip.new1 = data.normalSpecialistSurplus;
      }
    },
    //新增角色
    addRole () {
      let { name, tel, username, password } = this.form
      let params = {
        name,
        tel,
        username,
        password,
        type: this.type
      }
      addRole(params).then(res => {
        this.getRole();
        this.screening();
        this.$message({
          type: 'success',
          message: '新增成功!'
        });
      })
        .catch(err => {
          this.$message({
            type: 'warning',
            message: '新增失败'
          });
        })
    },
    // 修改角色
    updateRole () {
      let { empId, tel, password } = this.form
      updateRole(this.form).then(res => {
        this.getRole();
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
      })
        .catch(err => {
          this.$message({
            type: 'warning',
            message: '修改失败'
          });
        })
    }
  }

};
</script>

<style lang="less">
@white: #e8eaed;
@blue: #81fffb;
#equipment {
  width: 100%;
  height: 100%;
  @white: #e8eaed;
  @blue: #81fffb;
  #manager {
    width: 100%;
    height: 90%;
    .operation {
      color: #f8f57f;
    }
    /deep/.el-dialog__header {
      background: linear-gradient(#1c4364 0%, #0a1127 100%);
      padding: 5px 5px 5px 10px;
      color: @blue;
    }
    .footer {
      text-align: right;
      .el-button {
        background: linear-gradient(#1c4364 0%, #0a1127 100%);
        color: @blue;
      }
    }
    .el-form-item__label {
      color: black;
      font-size: 1rem;
    }
    .el-dialog__close {
      color: @blue;
    }
    .el-dialog__headerbtn {
      top: 0.625rem;
    }
    /deep/.el-dialog__title {
      height: 2.125rem;
      letter-spacing: 2px;
      font-size: 1rem;
      color: @blue;
    }
    .el-dialog__body {
      background-color: #f6f6f6;
    }

    & > .addmanager {
      display: flex;
      color: @blue;
      justify-content: space-around;
      align-items: center;
      font-size: 1rem;
      width: 7.5rem;
      margin-top: 1%;
      &:hover {
        cursor: pointer;
      }
      & > div {
        width: 20px;
        height: 20px;
        background: #1e577d;
        border-radius: 4px;

        text-align: center;
        line-height: 19px;
        font-weight: 600;
      }
    }
    & > .msg {
      color: #f8f57f;
      margin: 1% 0;
    }
    .el-table th,
    .el-table tr {
      background: none;
      color: @white;
    }

    .el-table th {
      background: linear-gradient(#1c4364 0%, #0a1127 100%);
    }
    .el-table th.is-leaf {
      border-bottom: 1px solid @blue;
      padding: 2px 0;
      color: @blue;
    }
    .el-table th,
    .el-table td {
      border-bottom: 1px solid #183758;
    }
    .el-table .cell {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background: rgba(21, 43, 72, 0.473);
    }
    .el-table [class*="el-table__row--level"] .el-table__expand-icon {
      color: #fff;
    }
    .el-table::before {
      height: 0;
    }
  }
  .jumppage {
    width: 100%;
    text-align: center;
    margin: 0 auto;
    margin-top: 1rem;
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background: #1c4364;
      color: @blue;
    }
    .el-pagination span:not([class*="suffix"]) {
      color: @white;
    }
    .number {
      &:hover {
        color: #1c4364;
      }
    }
    .el-pagination.is-background .el-pager li:not(.disabled):hover {
      color: #1c4364;
    }
  }
  .router {
    height: 5%;
    display: flex;
    margin-bottom: 0.5rem;

    & > .title {
      width: 10rem;
      height: 100%;
      font-size: 1rem;
      display: flex;
      color: @white;
      justify-content: center;
      align-items: center;
      background: linear-gradient(#1c4364 0%, #0a1127 100%);
      border-top-left-radius: 12px;
      margin-right: 10px;
      &:hover {
        cursor: pointer;
      }
    }
    .activedRouter {
      border: 1px solid #4c9db7;
      color: @blue;
    }
  }
}
</style>