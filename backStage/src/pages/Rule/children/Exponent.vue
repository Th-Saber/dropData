<template>
  <div id="exponent">
    <br />
    <el-table
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData1"
      :style="tabelStale"
      row-key="id"
      height="42rem"
      row-style="height:4rem"
    >
      <el-table-column prop="productName" label="检测项"></el-table-column>
      <el-table-column prop="diseaseInformation" label="异常可能存在的风险或疾病">
        <template slot-scope="scope">
          <div class="text">{{ scope.row.diseaseInformation }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="healthAdvice" label="健康建议">
        <template slot-scope="scope">
          <div class="text">{{ scope.row.healthAdvice }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="clinicalSignificance" label="临床意义">
        <template slot-scope="scope">
          <div class="text">{{ scope.row.clinicalSignificance }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <div class="edit_btn" @click="editItem(scope.row)">编辑</div>
          <!-- <div>删除</div> -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="item.productName"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <div class="title">异常可能存在的风险或疾病</div>
        <el-input
          type="textarea"
          :rows="3"
          maxlength="100"
          show-word-limit
          placeholder="请输入内容"
          v-model="item.diseaseInformation"
        ></el-input>
        <div class="title">健康建议</div>
        <el-input
          type="textarea"
          :rows="3"
          maxlength="100"
          show-word-limit
          placeholder="请输入内容"
          v-model="item.healthAdvice"
        ></el-input>
        <div class="title">临床意义</div>
        <el-input
          type="textarea"
          maxlength="255"
          show-word-limit
          :rows="5"
          placeholder="请输入内容"
          v-model="item.clinicalSignificance"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button class="confirm" @click="confirmEditItem(item)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { stateList, stateSave } from "@/apis/api";
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      item: {},
      tabelStale:
        "width:100%;background:none;border:1px solid #274F60;border-radius:10px 10px 0 0;overflow:auto;font-size:1rem",
      tableData1: []
    };
  },
  methods: {
    // 编辑单项
    editItem(row) {
      this.dialogVisible = true;
      this.item = row;
    },
    // 确认修改
    async confirmEditItem(item) {
      let result = await stateSave(item);
      this.dialogVisible = false;
      this.$message({
        message: "修改成功",
        type: "success"
      });
    },
    // 查询所有项
    async checkStateList() {
      try {
        this.loading = true;
        let result = (await stateList()).data;
        this.tableData1 = result;
        
      } catch (error) {
        console.log(error)
      }finally{
         this.loading = false;
      }
    }
  },
  created() {
    this.checkStateList();
  }
};
</script>

<style lang="less">
@white: #e8eaed;
@blue: #81fffb;
#exponent {
  width: 100%;
  height: 90%;
  // & > .title {
  //   padding: 0 10px;
  //   display: flex;
  //   align-items: center;
  //   height: 6.1%;
  //   font-size: 1rem;
  //   color: @blue;
  //   border-radius: 5px 5px 0 0;
  //   // & > .select {
  //   //   font-size: 0.875rem;
  //   //   position: relative;
  //   //   color: #e1de77;
  //   //   width: 100px;
  //   //   display: flex;
  //   //   justify-content: space-between;
  //   //   align-items: center;
  //   //   margin-left: 12px;
  //   //   &:hover {
  //   //     cursor: pointer;
  //   //   }
  //   //   .selectList {
  //   //     position: absolute;
  //   //     top: 100%;
  //   //     width: 100%;
  //   //     z-index: 30;
  //   //     background: #fff;
  //   //     color: #174162;
  //   //     border: 1px solid @blue;
  //   //     text-indent: 5px;
  //   //     border-radius: 5px;
  //   //     & > dd {
  //   //       &:hover {
  //   //         background: #174162;
  //   //         color: #fff;
  //   //         border-radius: 5px;
  //   //       }
  //   //     }
  //   //   }
  //   // }
  // }
  // .reset {
  //   width: 100%;
  //   display: flex;
  //   justify-content: flex-end;
  //   & > div {
  //     padding: 0.25rem 2rem;
  //     color: #f1ed7c;
  //     background: linear-gradient(#1c4364 0%, #0a1127 100%);
  //     border: 1px solid #3a778a;
  //     border-radius: 5px;
  //     margin-left: 1.25rem;
  //     &:hover {
  //       cursor: pointer;
  //     }
  //   }
  // }
  .confirm {
    background: linear-gradient(#1c4364 0%, #0a1127 100%);
    color: @blue;
  }
  .text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .edit_btn {
    color: #fffb81;
    &:hover {
      cursor: pointer;
    }
  }
  .el-dialog {
    border-radius: 8px 8px 0 0;
    border: 1px solid @blue;
    background: #f6f6f6;
    .title {
      color: #444;
      font-size: 16px;
      margin-bottom: 10px;
      font-weight: 500;
    }
    .el-textarea {
      margin-bottom: 20px;
    }
  }
  .el-dialog__headerbtn {
    top: 10px;
    right: 10px;

    .el-icon-close:before {
      color: @blue;
    }
  }
  .el-dialog__header {
    padding: 0 8px;
    height: 2.25rem;
    line-height: 2.25rem;
    background: linear-gradient(#1c4364 0%, #0a1127 100%);
    border-radius: 8px 8px 0 0;
    .el-dialog__title {
      color: @blue;

      font-size: 1rem;
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