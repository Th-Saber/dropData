<template>
  <div id="auto_reply">
    <div class="title">自动回复设置</div>
    <br />
    <div class="add_btn" @click="addQuestionType">
      <div>+</div>&nbsp;&nbsp;&nbsp;新建类型
    </div>
    <br />
    <el-table
      :data="tableData"
      :style="tabelStale"
      height="42rem"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
    >
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="相关问题">
              <div v-for="(v,i) in props.row.child" class="child" :key="i">
                <!-- {{ props.row.name }} -->
                <div class="sonId">
                  <div class="sonSort">{{`${props.$index+1}-${i+1}`}}.&emsp;问题：</div>
                  <el-input
                    type="textarea"
                    :disabled="v.childDisabled"
                    :autosize="{ minRows: 2, maxRows: 2}"
                    placeholder="请输入内容"
                    v-model="v.title"
                    maxlength="30"
                    show-word-limit
                  ></el-input>&emsp;
                  <label
                    class="edit"
                    v-show="v.childDisabled"
                    @click="v.childDisabled=false"
                  >编辑</label>
                  <label class="edit" v-show="!v.childDisabled" @click="savaItem(v)">完成</label>
                  &emsp;
                  <label class="edit" @click="deleteItem(v)">删除</label>
                </div>
                <div class="sonText">
                  <div class="sonSort">答案：</div>
                  <el-input
                    type="textarea"
                    :disabled="v.childDisabled"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="v.text"
                    maxlength="300"
                    show-word-limit
                  ></el-input>
                </div>
              </div>
              <div class="addQuestion" @click="addQuestion(props.row)">添加问题</div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="问题类型" prop="id">
        <template slot-scope="scope">
          <div class="queId">
            <el-input
              type="textarea"
              :disabled="scope.row.fatherDisabled"
              autosize
              placeholder="请输入内容"
              v-model="scope.row.title"
              maxlength="30"
              show-word-limit
            ></el-input>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="时间" prop="name"></el-table-column> -->
      <el-table-column label="操作" prop="desc">
        <template slot-scope="scope">
          <div class="btn_box">
            <div v-show="scope.row.fatherDisabled" @click="scope.row.fatherDisabled=false">编辑</div>
            <div v-show="!scope.row.fatherDisabled" @click="saveType(scope.row)">完成</div>&emsp;&emsp;
            <div @click="deleteType(scope.row)">删除</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from "moment";
import {
  autoQuestionList,
  autoQuestionSave,
  autoQuestionDelete
} from "@/apis/api";
export default {
  data() {
    return {
      tabelStale:
        "width:100%;background:none;border:1px solid #274F60;border-radius:10px 10px 0 0;overflow:auto;font-size: 0.875rem",
      tableData: [],
      // 获取row的key值
      getRowKeys(row) {
        return row.queId;
      },
      // 要展开的行，数值的元素是row的key值
      expands: []
    };
  },
  methods: {
    //   获取自动回复消息列表
    async getAutoQuestionList() {
      try {
        let res = await autoQuestionList();
        res.data.forEach(v => {
          v["fatherDisabled"] = true;
          v.child.forEach(cv => {
            cv["childDisabled"] = true;
          });
        });
        this.tableData = res.data;
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    // 保存问题
    async handelAutoQuestionSave(obj) {
      let res = await autoQuestionSave(obj);
      this.getAutoQuestionList();
      console.log(res);
    },

    // 删除问题
    async handelAutoQuestionDelete(id) {
      let res = await autoQuestionDelete(id);
      this.$message({
        type: "success",
        message: "删除成功!"
      });
      this.getAutoQuestionList();
    },
    // 删除按钮
    deleteItem(v) {
      this.$confirm("是否删除该问题？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.handelAutoQuestionDelete(v.queId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 删除类型
    deleteType(v) {
      this.$confirm("是否删除该类型？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.handelAutoQuestionDelete(v.queId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 保存类型
    saveType(v) {
      this.handelAutoQuestionSave(v);
    },
    // 保存问题
    savaItem(v) {
      this.handelAutoQuestionSave(v);
    },
    // 添加问题
    addQuestion(obj) {
      if (obj.child.length == 0) {
        let obj2 = {
          childDisabled: false,
          parentId: `${obj.queId}`,
          queId: `${obj.queId}-1`,
          sort: 1,
          text: "请输入相关答案",
          title: "请输入相关问题"
        };
        this.handelAutoQuestionSave(obj2);
      } else {
        let id = obj.child[obj.child.length - 1].queId;
        let num = parseInt(id.substr(id.length - 1, 1));
        let obj2 = {
          parentId: `${obj.queId}`,
          queId: `${obj.queId}-${num + 1}`,
          sort: 1,
          text: "请输入相关答案",
          title: "请输入相关问题"
        };
        this.handelAutoQuestionSave(obj2);
      }
    },
    // 添加问题类型
    addQuestionType() {
      console.log(this.tableData);
      if (this.tableData.length == 0) {
        let obj = {
          parentId: "-1",
          title: "请输入问题类型",
          sort: "1",
          queId: "1"
        };
        this.handelAutoQuestionSave(obj);
      } else {
        let id = this.tableData.length;
        let num = parseInt(this.tableData[id - 1].queId);
        let obj = {
          parentId: `-1`,
          queId: `${num + 1}`,
          sort: 1,
          title: "请输入相关问题类型"
        };
        console.log(obj);
        this.handelAutoQuestionSave(obj);
      }
    }
  },
  created() {
    // this.handelAutoQuestionDelete();
    this.getAutoQuestionList();
  },
  mounted() {
    // 在这里你想初始化的时候展开哪一行都可以了
    this.expands.push(this.tableData[0].queId);
  }
};
</script>

<style lang="less">
@white: #e8eaed;
@blue: #81fffb;
#auto_reply {
  width: 100%;
  height: 100%;

  & > .title {
    width: 10.18%;
    height: 4.65%;
    color: @blue;
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(#1c4364 0%, #0a1127 100%);
    border: 1px solid #4c9db7;
    border-top-left-radius: 12px;
  }
  & > .add_btn {
    color: @blue;
    display: flex;
    align-items: center;
    font-size: 1rem;
    width: 6.625rem;
    &:hover {
      cursor: pointer;
    }
    & > div {
      width: 1.125rem;
      height: 1.125rem;
      background: #1c4364;
      border-radius: 5px;
      text-align: center;
      line-height: 1.125rem;
    }
  }

  .queId {
    //   display: flex;
    width: 100%;
  }
  .child {
    width: 100%;
    .sonId,
    .sonText {
      display: flex;
      width: 100%;
      align-items: center;
      margin-bottom: 5px;
      .edit {
        white-space: nowrap;
        color: #dedc78;
        &:hover {
          cursor: pointer;
        }
      }
      .sonSort {
        white-space: nowrap;
      }
    }
    .sonId {
      margin-top: 20px;
    }
  }
  .addQuestion {
    color: #dedc78;
    &:hover {
      cursor: pointer;
    }
  }
  .btn_box {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #dedc78;
    & > div {
      cursor: pointer;
    }
  }
  .el-form--inline .el-form-item {
    width: 100%;
  }
  .el-form--inline .el-form-item__content {
    width: 55%;
  }
  .el-table th,
  .el-table tr {
    background: none;
    color: @white;
  }

  .el-table th {
    background: linear-gradient(#1c4364 0%, #0a1127 100%);
  }
  .el-table th,
  .el-table td {
    border-bottom: 1px solid #183758;
  }
  .el-table th.is-leaf {
    border-bottom: 1px solid @blue;
    padding: 2px 0;
    color: @blue;
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
  .el-form--inline .el-form-item__label {
    color: @white;
    text-indent: 10px;
  }
  .el-table::before {
    height: 0;
  }
  .el-form--inline .el-form-item {
    background: #0f2138;
    margin-bottom: 0;
  }
  .el-table__expand-icon {
    color: @white;
  }
}
</style>