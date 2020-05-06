<template>
  <div id="AccData">
    <div class="title_box">
      <div class="title">用户资料</div>
      <!-- <div class="export">
        <img src="../../assets/imgs/import.png" alt />&nbsp;导出
      </div>-->
    </div>
    <div class="check_saerch">
      <div class="checked">
        <el-checkbox v-model="wasSuper" @change="checkWasSuper">显示所有超级管理员</el-checkbox>
        <div>超级用户无需验证，可直接关联主账户及成员账户，并查看成员相关设备信息及检测信息，被绑定成员界面功能不变。</div>
      </div>
      <div class="search">
        <input type="text" v-model="username" placeholder="输入用户名" />
        <div @click="searchUser">
          <img src="@/assets/imgs/search_icon.png" alt />
        </div>
      </div>
    </div>
    <el-table
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData1"
      :style="tabelStale"
      row-key="userId"
      height="42rem"
      row-style="height:4rem"
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="姓名" width="200px">
        <template slot-scope="scope">
          <img src="../../assets/imgs/vip.png" v-show="scope.row.superUser==1" alt />
          &nbsp;
          {{scope.row.name}}
          &emsp;
          <span
            style="color:#81fffb;font-size:12px"
          >{{ scope.row.type==1?'普通用户':"企业用户" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tel" label="账号(手机号)" width="140px"></el-table-column>
      <el-table-column prop="birthday" label="生日" width="120px"></el-table-column>
      <el-table-column prop="sex" label="性别" width="80px">
        <template slot-scope="scope">{{ scope.row.sex ==0?'女':'男' }}</template>
      </el-table-column>
      <el-table-column prop="height" label="身高(cm)" width="90px"></el-table-column>
      <el-table-column prop="weight" label="体重(kg)" width="90px"></el-table-column>
      <el-table-column prop="bloodType" label="血型" width="60px"></el-table-column>
      <el-table-column prop="wasSmoke" label="吸烟" width="60px">
        <template slot-scope="scope">{{ scope.row.wasSmoke ==1?'是':'否' }}</template>
      </el-table-column>
      <el-table-column prop="wasWine" label="饮酒" width="60px">
        <template slot-scope="scope">{{ scope.row.wasWine ==1?'是':'否' }}</template>
      </el-table-column>
      <el-table-column prop="sportsTime" label="运动时间" width="100px">
        <template
          slot-scope="scope"
        >{{ scope.row.sportsTime==0?'1小时以下':scope.row.sportsTime==1?'3小时以下': '3小时以上'}}</template>
      </el-table-column>
      <el-table-column prop="province" label="所属地区" width="240px">
        <template slot-scope="scope">{{ scope.row.province+scope.row.city+scope.row.county }}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间"></el-table-column>
      <el-table-column prop="address" label="操作" width="160px">
        <template slot-scope="scope">
          <div class="btnbox">
            <div v-show="scope.row.superUser==1" @click="alertBox(scope.row.userId,'0')">解除超级权限</div>
            <div v-show="scope.row.superUser!=1" @click="alertBox(scope.row.userId,'1')">设为超级管理</div>
            <div @click="handleDeleteUser(scope.row.userId)">删除</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="jumppage">
      <el-pagination
        @current-change="handleCurrentChange"
        background="true"
        pager-count="4"
        :current-page="current"
        :page-size="size"
        layout=" prev, pager, next, total,jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { homeUserInfo, checkChildren, superUser, deleteUser } from "@/apis/api";
import moment from "moment";
export default {
  data() {
    return {
      loading: false, //加载状态
      wasSuper: false,
      username: "", //搜索用户名
      current: 1,
      size: 10,
      total: 100,
      tabelStale:
        "width:100%;background:none;border:1px solid #274F60;border-radius:10px 10px 0 0;overflow:auto;font-size:1rem",
      tableData1: [],
      alertMeg: {
        title: "",
        message: ""
      }
    };
  },
  created() {
    this.getHomeUserInfo(this.current, this.size, null, null);
  },
  methods: {
    //懒加载查询是否有子用户
    async load(tree, treeNode, resolve) {
      let children = (await checkChildren(tree.userId)).data;
      if (children.length > 0) {
        resolve(children);
      } else {
        resolve([]);
        this.$message({
          type: "error",
          message: "当前用户暂无子成员!"
        });
      }
    },
    // 是否删除用户
    handleDeleteUser(uid) {
      this.$confirm("是否要删除该用户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.getDeleteUser(uid);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 删除用户
    async getDeleteUser(uid) {
      let result = await deleteUser(uid);
      if (result.msg == "成功") {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.getHomeUserInfo(
          1,
          this.size,
          this.username != "" ? this.username : null,
          this.wasSuper == false ? null : true
        );
      }
    },
    //是否超级用户
    checkWasSuper(val) {
      this.getHomeUserInfo(
        1,
        this.size,
        this.username != "" ? this.username : null,
        val == false ? null : true
      );
    },
    // 搜索用户
    searchUser() {
      this.getHomeUserInfo(
        1,
        this.size,
        this.username != "" ? this.username : null,
        this.wasSuper == false ? null : true
      );
    },
    //获取用户信息分页
    async getHomeUserInfo(page, size, username, wasSuper) {
      try {
        this.loading = true;
        let userinfo = (await homeUserInfo(page, size, username, wasSuper))
          .data;
        userinfo.records.forEach(v => {
          v["hasChildren"] = true;
          v.createTime = moment(v.createTime).format("YYYY-MM-DD");
        });
        this.tableData1 = userinfo.records;
        this.total = userinfo.total;
        this.current = userinfo.current;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    //换页
    handleCurrentChange(val) {
      this.current = val;
      this.getHomeUserInfo(
        this.current,
        this.size,
        this.username != "" ? this.username : null,
        this.wasSupe == true ? true : null
      );
    },
    // 设置超级用户
    async setSuperUser(uid, state) {
      console.log(uid, state);
      let result = await superUser(uid, state);
      this.getHomeUserInfo(
        this.current,
        this.size,
        this.username != "" ? this.username : null,
        this.wasSupe == true ? true : null
      );
      this.$message({
        message: this.alertMeg.message,
        type: "success"
      });
      console.log(result);
    },
    alertBox(uid, state) {
      if (state == 1) {
        this.alertMeg.title = "是否设置此用户为超级用户";
        this.alertMeg.message = "设置成功！";
      } else {
        this.alertMeg.title = "是否取消此用户的超级用户";
        this.alertMeg.message = "取消成功！";
      }
      this.$confirm(this.alertMeg.title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.setSuperUser(uid, state);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  }
};
</script>

<style lang="less">
@white: #e8eaed;
@blue: #81fffb;
#AccData {
  width: 100%;
  height: 100%;
  .title_box {
    height: 4.65%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: centers;
    & > .title {
      height: 100%;
      width: 10.18%;
      color: @blue;
      font-size: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(#1c4364 0%, #0a1127 100%);
      border: 1px solid #4c9db7;
      border-top-left-radius: 12px;
    }
    & > .export {
      display: flex;
      align-items: center;
      color: @blue;
      font-size: 1rem;
      &:hover {
        cursor: pointer;
      }
    }
  }
  & > .check_saerch {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1%;
    margin-bottom: 1%;
    .checked {
      & > div {
        margin-top: 8px;
        color: @white;
        font-size: 12px;
      }
      .el-checkbox__label {
        color: #f6f27d;
      }
    }
    .search {
      border-radius: 5px;
      height: 1.875rem;
      display: flex;
      align-items: center;
      border-radius: 5px;
      overflow: hidden;
      & > input {
        width: 20rem;
        outline: none;
        border: none;
        height: 100%;
        text-indent: 12px;
      }
      & > div {
        background: #f5f5f5;
        height: 1.875rem;
        width: 1.875rem;
        display: flex;
        align-items: center;
        justify-content: center;
        & > img {
          transform: scale(1.5);
        }
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  .btnbox {
    width: 100%;
    display: flex;
    justify-content: space-around;
    color: #f6f27d;

    & > div:hover {
      cursor: pointer;
    }
  }
  & > .jumppage {
    width: 100%;
    text-align: center;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
</style>