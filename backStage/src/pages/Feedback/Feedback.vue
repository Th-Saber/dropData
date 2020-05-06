<template>
  <div id="feedback">
    <div class="title_box">
      <div class="title">用户反馈</div>

    </div>
    <div class="checked">
      <el-checkbox v-model="checked" @change="screen">显示标记过的内容</el-checkbox>
    </div>
    <el-table :data="tableData1" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)" :style="tabelStale" row-key="id" height="42rem" row-style="height:3.9rem" lazy :load="load" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

      <el-table-column prop="tel" label="用户账号"></el-table-column>
      <el-table-column prop="name" label="名字"></el-table-column>

      <el-table-column prop="content" label="反馈内容">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="bottom" width="500">
            {{scope.row.content}}
            <div slot="reference" class="name-wrapper">
              <div class="hide"> {{ scope.row.content }}</div>

            </div>
          </el-popover>

        </template>
      </el-table-column>
      <el-table-column label="时间">
        <template slot-scope="scope">
          {{scope.row.createTime | filterTime}}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="操作">
        <template slot-scope="scope">

          <el-button type="text" :class="scope.row.tag === true?'operation':'operation2'" @click="del(scope.row.feedId,scope.row.tag)">{{scope.row.tag|filterStatus}}</el-button>

          <el-button type="text" class="operation" @click="del(scope.row.feedId, '删除')">删除</el-button>

        </template>
      </el-table-column>

    </el-table>
    <div class="jumppage">
      <el-pagination @current-change="handleCurrentChange" background="true" :pager-count="4" :current-page="jumppage.page" :page-size="jumppage.size" layout=" prev, pager, next, total,jumper" :total="jumppage.total"></el-pagination>
    </div>

  </div>
</template>

<script>
import { feedbackFindAll, feedbackSign, delFeedback } from "@/apis/api";
import moment from "moment";

export default {
  data () {
    return {
      loading: false,
      checked: false, //默认不显示标记过的内容
      tabelStale:
        "width:100%;background:none;border:1px solid #274F60;border-radius:10px 10px 0 0;overflow:auto;font-size:1rem",
      tableData1: [],
      current: 1,
      size: 10,
      total: 100,
      jumppage: {
        page: 1,
        size: 10,
        total: 100
      },//分页
    };
  },
  filters: {
    filterStatus (tag) {
      return tag ? "标记" : "取消标记"
    },
    filterTime (time) {
      return moment(time).format("YYYY/MM/DD   HH:mm")
    }

  },
  methods: {
    handleCurrentChange (val) {
      this.jumppage.page = val;
      this.getFeedbackFindAll();
    },
    //筛选
    screen (checked) {
      this.jumppage.page = 1
      this.getFeedbackFindAll();
    },
    // 删除|标记|取消标记
    del (id, method) {
      let params = {}
      if (method == "删除") {
        params = {
          title: '此操作将永久删除该文件, 是否继续?',
          searchFn: delFeedback,
          questData: {
            id
          }
        }
      } else if (!method) {
        method = true;
        params = {
          title: '此操作将取消标记该文件, 是否继续?',
          searchFn: feedbackSign,
          questData: {
            id, method
          }
        }
      } else if (method) {
        method = false;
        params = {
          title: '此操作将标记该文件, 是否继续?',
          searchFn: feedbackSign,
          questData: {
            id, method
          }
        }
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
          this.getFeedbackFindAll();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    //查询反馈
    async getFeedbackFindAll () {

      let { page, size, } = this.jumppage
      let params = {
        tag: this.checked,
        page,
        size,
      }

      try {
        this.loading = true;
        let result = await feedbackFindAll(params);
        console.log(result)
        this.tableData1 = result.data.records;
        this.jumppage.total = result.data.total;
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false;
      }

    }
  },
  created () {
    this.getFeedbackFindAll()
  }
};
</script>

<style lang="less" >
@white: #e8eaed;
@blue: #81fffb;
#feedback {
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
  .hide {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .name-wrapper {
    background: none;
  }
  .checked {
    margin-top: 1%;
    .el-checkbox__label {
      color: #f6f27d;
    }
    margin-bottom: 2rem;
  }
  .operation {
    color: #f6f27d;
  }
  .operation2 {
    color: #be4041;
  }
  .jumppage {
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
  .el-button--primary {
    background: linear-gradient(#1c4364 0%, #0a1127 100%);
    border: 1px solid @blue;
  }
  .el-dialog__headerbtn .el-dialog__close:hover {
    color: #1c4364;
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
</style>