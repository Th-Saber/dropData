<template>
  <div id="NewEquipment">
    <!-- <div class="checked">
      <el-checkbox v-model="checked">显示待处理记录</el-checkbox>
    </div>-->
    <br />
    <div class="add_equipment" @click="dialogVisible = true">
      <div>+</div>&nbsp;&nbsp;&nbsp;新建设备
    </div>
    <br />

    <el-table
      :data="tableData1"
      :style="tabelStale"
      row-key="id"
      height="42rem"
      row-style="height:3.9rem"
    >
      <el-table-column prop="name" label="设备名"></el-table-column>
      <el-table-column prop="name" label="设备图片">
        <template slot-scope="scope">
          <div>
            <img :src="scope.row.imageUrl" alt style="width:100%" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="label" label="标签"></el-table-column>
      <el-table-column prop="integral" label="积分"></el-table-column>

      <el-table-column prop="name" label="操作">
        <template slot-scope="scope">
          <el-button type="text" class="operation" @click="editDevice(scope.row)">编辑</el-button>&emsp;
          <el-button type="text" class="operation" @click="handelDeleteMachine(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="设备" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="类型名:">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="标签:">
          <el-input v-model="form.label" placeholder="每项间请用英文逗号隔开"></el-input>
        </el-form-item>
        <el-form-item label="标题:">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="积分:">
          <el-input v-model="form.integral"></el-input>
        </el-form-item>
        <el-form-item label="使用视频:">
          <uplaodVideo v-model="form.videoPath" />
        </el-form-item>
        <el-form-item label="设备图:">
          <uplaod v-model="form.imageUrl" />
        </el-form-item>
        <el-form-item label="内容:">
          <el-input v-model="form.content" type="textarea" maxlength="500" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handelSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import uplaod from "@/components/upload";
import uplaodVideo from "../../../components/uploadVideo";
import {
  machineFetchMachineType,
  saveMachineType,
  fetchMachineTypeById,
  deleteMachineType
} from "@/apis/api";
export default {
  components: { uplaod, uplaodVideo },
  data() {
    return {
      tabelStale:
        "width:100%;background:none;border:1px solid #274F60;border-radius:10px 10px 0 0;overflow:auto;font-size:1rem",
      dialogVisible: false,
      form: {
        name: "",
        label: "",
        integral: "",
        imageUrl: "",
        title: "",
        content: "",
        videoPath: ""
      },
      tableData1: []
    };
  },
  methods: {
    // 获取设备类型列表
    async getMachineFetchMachineType() {
      let res = await machineFetchMachineType();
      this.tableData1 = res.data;
    },
    // 保存添加类型信息
    async handelSaveMachineType(obj) {
      let res = await saveMachineType(obj);
      this.$message({
        message: "成功",
        type: "success"
      });
      this.getMachineFetchMachineType();
      this.handleClose();
      console.log(13212165, res);
    },
    // 编辑按钮
    editDevice(row) {
      this.getFetchMachineTypeById(row.id);
    },
    // 根据id查询类型信息
    async getFetchMachineTypeById(id) {
      try {
        let res = await fetchMachineTypeById(id);
        this.form = res.data;
        this.dialogVisible = true;
        this.console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    // 删除按钮
    handelDeleteMachine(row) {
      this.$confirm("是否删除该类型?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.handelDeleteMachineType(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async handelDeleteMachineType(id) {
      try {
        let res = await deleteMachineType(id);
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.getMachineFetchMachineType()
      } catch (error) {
        console.log(error);
      }
    },
    // 确定按钮
    handelSave() {
      this.handelSaveMachineType(this.form);
    },
    // 弹框关闭
    handleClose() {
      this.dialogVisible = false;
      this.form = {
        name: "",
        label: "",
        integral: "",
        imageUrl: "",
        title: "",
        content: "",
        videoPath: ""
      };
    }
  },
  created() {
    this.getMachineFetchMachineType();
  }
};
</script>

<style lang="less">
@white: #e8eaed;
@blue: #81fffb;
#NewEquipment {
  width: 100%;
  height: 90%;
  .add_equipment {
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
  .el-dialog__header {
    padding: 5px;
    background: linear-gradient(#1c4364 0%, #0a1127 100%);
    border-radius: 5px 5px 0 0;
  }
  .el-button {
    background: linear-gradient(#1c4364 0%, #0a1127 100%);
    border: 1px solid @blue;
    color: @blue;
  }
  .el-dialog__title {
    font-size: 14px;
    color: @blue;
  }
  .el-dialog__headerbtn {
    top: 5px;
    right: 5px;
  }
  .el-dialog {
    border-radius: 5px 5px 0 0;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: @blue;
  }
  .el-table th,
  .el-table tr {
    background: none;
    color: @white;
  }

  .operation {
    color: #f6f27d;
    background: none;
    border: none;
  }
  // .checked {
  //   margin-top: 1%;
  //   margin-bottom: 1%;
  //   .el-checkbox__label {
  //     color: #f6f27d;
  //   }
  // }
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
  /deep/.el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: auto;
  }
}
</style>