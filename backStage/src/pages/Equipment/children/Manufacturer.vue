<template>
  <div id="Manufacturer">
    <!-- <div class="checked">
      <el-checkbox v-model="checked">显示待处理记录</el-checkbox>
    </div>-->
    <br />
    <div class="add_equipment" @click="dialogVisible = true">
      <div>+</div>&nbsp;&nbsp;&nbsp;添加厂商
    </div>
    <br />

    <el-table
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData1"
      :style="tabelStale"
      row-key="id"
      height="42rem"
      row-style="height:3.9rem"
    >
      <el-table-column prop="id" label="ID" width="60px"></el-table-column>
      <el-table-column prop="username" label="负责人" width="150px"></el-table-column>
      <el-table-column prop="mobile" label="联系电话" width="200px"></el-table-column>
      <el-table-column prop="name" label="厂名"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="name" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="text" class="operation" @click="editManufacture(scope.row)">编辑</el-button>
          <el-button type="text" class="operation" @click="handelDeleteManufacture(scope.row)">删除</el-button>
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
    <el-dialog title="厂商" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="联系人:">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="厂名:">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="地址:">
          <el-input v-model="form.address"></el-input>
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
  machinePageManufacture,
  saveManufacturer,
  deleteManufacturere
} from "@/apis/api";
export default {
  data() {
    return {
      tabelStale:
        "width:100%;background:none;border:1px solid #274F60;border-radius:10px 10px 0 0;overflow:auto;font-size:1rem",
      dialogVisible: false,
      form: {
        id: null,
        username: "",
        mobile: "",
        name: "",
        address: ""
      },
      tableData1: [],
      loading: false,
      jumppage: {
        current: 1,
        size: 10,
        total: 100
      } //分页
    };
  },
  methods: {
    // 获取设备类型列表
    async getMachinePageManufacture(page, size) {
      try {
        this.loading = true;
        let res = await machinePageManufacture(page, size);
        this.tableData1 = res.data.records;
        this.jumppage = {
          current: res.data.current,
          size: this.jumppage.size,
          total: res.data.total
        };
        console.log(res);
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    handleClose() {
      this.form = {
        id: null,
        username: "",
        mobile: "",
        name: "",
        address: ""
      };
      this.dialogVisible = false;
    },
    // 打开编辑
    editManufacture(row) {
      console.log(row);
      this.dialogVisible = true;
      this.form = row;
    },
    // 删除按钮
    handelDeleteManufacture(row) {
      this.$confirm("是否删除该厂商?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.getDeleteManufacturere(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 删除厂家接口
    async getDeleteManufacturere(id) {
      try {
        let res = await deleteManufacturere(id);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getMachinePageManufacture(
          this.jumppage.current,
          this.jumppage.size
        );
      } catch (error) {
        throw error;
        console.log(error);
      }
    },
    // 分页
    handleCurrentChange(val) {
      this.getMachinePageManufacture(val, this.jumppage.size);
    },
    // 保存厂家
    async handelSaveManufacturer(obj) {
      try {
        let res = await saveManufacturer(obj);
        this.getMachinePageManufacture(
          this.jumppage.current,
          this.jumppage.size
        );
        this.$message({
          message: "成功",
          type: "success"
        });
        this.handleClose();
      } catch (error) {
        console.log(error);
        throw error;
      }

      console.log(13212165, res);
    },
    // 确认保存厂技数据
    handelSave() {
      this.handelSaveManufacturer(this.form);
    }
  },
  created() {
    this.getMachinePageManufacture(this.jumppage.current, this.jumppage.size);
  }
};
</script>
<style lang="less">
@white: #e8eaed;
@blue: #81fffb;
#Manufacturer {
  width: 100%;
  height: 90%;
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