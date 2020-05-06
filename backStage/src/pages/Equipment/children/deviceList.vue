<template>
  <div id="exchange">
    <div class="btn_box">
      <div class="add_device" @click="dialogVisible = true">
        <div>+</div>&nbsp;&nbsp;&nbsp;新建设备
      </div>
      <label for="uploadFile" class="uploadLabel">
        导入CSV
        <input
          id="uploadFile"
          type="file"
          ref="file"
          style="display:none"
          @change="importfile(this)"
          accept=".csv"
        />
      </label>
    </div>
    <br />

    <el-table
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData1"
      :style="tabelStale"
      row-key="id"
      max-height="42rem"
      row-style="height:3.9rem"
    >
      <el-table-column prop="username" label="姓名" fixed></el-table-column>
      <el-table-column prop="type" label="类型" width="120">
        <template slot-scope="scope">
          <div>{{scope.row.type==1?'血氧':'尿检'}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <div>
            <label v-show="scope.row.status==1" style="color:#30C340">在线</label>
            <label v-show="scope.row.status=2" style="color:#EEBB4F">离线</label>
            <label v-show="scope.row.status==3" style="color:#C64E5A">异常</label>
            <label v-show="scope.row.status==4" style="color:#e8eaed">未绑定</label>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="machineId" label="设备ID"></el-table-column>
      <el-table-column prop="sn" label="sn码"></el-table-column>
      <el-table-column prop="iccid" label="iccID"></el-table-column>
      <el-table-column prop="manufacturerId" label="厂商ID"></el-table-column>
      <el-table-column prop="secureKey" label="密钥"></el-table-column>
      <el-table-column prop="protocolVersion" label="版本" width="80"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <label type="text" class="operation" @click="editDevice(scope.row)">编辑</label>&emsp;
          <label type="text" class="operation" @click="handelDeleteManufacture(scope.row)">删除</label>

          <!-- <div>删除</div> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="jumppage">
      <el-pagination
        @current-change="handleCurrentChange"
        background="true"
        :pager-count="4"
        :current-page="jumppage.current"
        :page-size="jumppage.size"
        layout=" prev, pager, next, total,jumper"
        :total="jumppage.total"
      ></el-pagination>
    </div>
    <el-dialog title="设备" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="iccID:">
          <el-input v-model="form.iccid"></el-input>
        </el-form-item>
        <el-form-item label="设备ID:">
          <el-input v-model="form.machineId"></el-input>
        </el-form-item>
        <el-form-item label="厂商ID:">
          <el-input v-model="form.manufacturerId"></el-input>
        </el-form-item>
        <el-form-item label="版本:">
          <el-input v-model="form.protocolVersion"></el-input>
        </el-form-item>
        <el-form-item label="密钥:">
          <el-input v-model="form.secureKey"></el-input>
        </el-form-item>
        <el-form-item label="sn码:">
          <el-input v-model="form.sn"></el-input>
        </el-form-item>
        <el-form-item label="类型:">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handelSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  machinePageMachine,
  uploadCvsMachine,
  saveMachine,
  machineDeleteMachine
} from "@/apis/api";
export default {
  data() {
    return {
      tabelStale:
        "width:100%;background:none;border:1px solid #274F60;border-radius:10px 10px 0 0;overflow:auto;font-size:1rem",
      tableData1: [],
      dialogVisible: false,
      form: {
        id: null,
        iccid: "",
        machineId: "",
        manufacturerId: "",
        protocolVersion: "",
        secureKey: "",
        sn: "",
        type: ""
      },
      options: [
        {
          value: "1",
          label: "血氧"
        },
        {
          value: "2",
          label: "尿检"
        }
      ],
      loading: false,
      jumppage: {
        current: 1,
        size: 10,
        total: 100
      } //分页
    };
  },

  methods: {
    // 获取分页
    async getMachinePageMachine(page, size) {
      try {
        this.loading = true;
        let res = await machinePageMachine(page, size);
        this.tableData1 = res.data.records;
        this.jumppage = {
          current: res.data.current,
          size: this.jumppage.size,
          total: res.data.total
        };
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // 编辑设备
    editDevice(row) {
      this.form = row;
      this.dialogVisible = true;
    },
    // 确定保存
    handelSave() {
      this.handelSaveMachine(this.form);
    },
    //保存设备信息
    async handelSaveMachine(obj) {
      try {
        let res = await saveMachine(obj);
        this.getMachinePageMachine(this.jumppage.current, this.jumppage.size);
        this.$message({
          message: "成功",
          type: "success"
        });
        this.handleClose();
        console.log(res);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    // 分页
    handleCurrentChange(val) {
      this.getMachinePageMachine(val, this.jumppage.size);
    },
    // 导入文件
    importfile() {
      let formData = new FormData();
      formData.append("file", this.$refs.file.files[0]);
      this.handelUploadCvsMachine(formData);
    },
    // 上传csv
    async handelUploadCvsMachine(file) {
      try {
        let res = await uploadCvsMachine(file);
        console.log(res);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    // 删除按钮
    handelDeleteManufacture(row) {
      this.$confirm("是否删除该厂商?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.getMachineDeleteMachine(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async getMachineDeleteMachine(id) {
      try {
        let res = await machineDeleteMachine(id);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getMachinePageMachine(this.jumppage.current, this.jumppage.size);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    // 关闭弹框
    handleClose() {
      this.form = {
        id: null,
        iccid: "",
        machineId: "",
        manufacturerId: "",
        protocolVersion: "",
        secureKey: "",
        sn: "",
        type: ""
      };
      this.dialogVisible = false;
    }
  },
  created() {
    this.getMachinePageMachine(this.jumppage.current, this.jumppage.size);
  }
};
</script>

<style lang="less">
@white: #e8eaed;
@blue: #81fffb;
#exchange {
  width: 100%;
  height: 90%;
  .btn_box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .uploadLabel {
      width: 5rem;
      height: 1.75rem;
      font-size: 0.875rem;
      background: linear-gradient(#1c4364 0%, #0a1127 100%);
      display: block;
      color: @blue;
      border: 1px solid @blue;
      border-radius: 5px;
      text-align: center;
      line-height: 1.75rem;
      &:hover {
        cursor: pointer;
      }
    }
    .add_device {
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
  }
  .operation {
    color: #f6f27d;
    background: none;
    border: none;
    &:hover {
      cursor: pointer;
    }
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
    padding: 0;
  }
  .el-table__body tr.hover-row > td {
    background: rgba(21, 43, 72, 0.473);
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
}
</style>