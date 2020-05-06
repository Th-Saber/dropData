<template>
  <div id="named">
    <!-- <div class="btnBox">
      <div @click="addItem">添加项</div>
      <div>重置</div>
    </div>-->
    <br />
    <el-table
      :data="tableData1"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :style="tabelStale"
      row-key="id"
      height="45.8rem"
      row-style="height:4rem"
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="score" label="分数">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.minScore"
            :disabled="scope.row.disabled"
            maxlength="3"
            placeholder="最低分"
          ></el-input>&emsp;
          - &emsp;
          <el-input
            v-model="scope.row.maxScore"
            maxlength="3"
            :disabled="scope.row.disabled"
            placeholder="最高分"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="状态">
        <template slot-scope="scope">
          <el-select v-model="scope.row.status" :disabled="scope.row.disabled" placeholder="状态">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="男人中的">
        <template slot-scope="scope">
          <el-input v-model="scope.row.man" :disabled="scope.row.disabled" placeholder="昵称"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="女人中的">
        <template slot-scope="scope">
          <el-input v-model="scope.row.woman" :disabled="scope.row.disabled" placeholder="昵称"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <div class="btn_box">
            <div
              style="color:#06AE76"
              v-show="!scope.row.disabled"
              @click="finishItem(scope.row)"
            >完成</div>
            <div v-show="scope.row.disabled" @click="
editItem(scope.row)">编辑</div>
            <div @click="resetItem(scope.row)">重置</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="jumppage">
      <el-pagination
        @current-change="handleCurrentChange"
        background="true"
        pager-count="4"
        :current-page="jumppage.current"
        :page-size="jumppage.size"
        layout=" prev, pager, next, total,jumper"
        :total="jumppage.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getNamedPage, editNamed } from "@/apis/api.js";
export default {
  data() {
    return {
      loading: false,
      tabelStale:
        "width:100%;background:none;border:1px solid #274F60;border-radius:10px 10px 0 0;overflow:auto;font-size:1rem",
      tableData1: [],
      options: [
        {
          value: 4,
          label: "极好"
        },
        {
          value: 3,
          label: "健康 "
        },
        {
          value: 2,
          label: "一般"
        },
        {
          value: 1,
          label: "较差"
        }
      ],
      jumppage: {
        current: 1,
        size: 10,
        total: 100
      } //分页
    };
  },
  created() {
    this.getNamed(this.jumppage);
  },
  methods: {
    // 添加新项
    // addItem() {
    //   this.tableData1.push({
    //     minScore: "",
    //     maxScore: "",
    //     status: 4,
    //     man: "",
    //     disabled: false,
    //     woman: ""
    //   });
    // },
    // 编辑每项
    editItem(row) {
      row.disabled = false;
    },
    resetItem(row) {
      console.log(row);
      row.minScore = "";
      row.maxScore = "";
      row.disabled = false;
      row.man = "";
      row.woman = "";
      row.status = 4;
    },
    // 完成
    async finishItem(row) {
      row.man = JSON.stringify(row.man.split("，"));
      row.woman = JSON.stringify(row.woman.split("，"));
      let result = await editNamed(row);
      this.getNamed(this.jumppage);
    },
    // 获取分页
    async getNamed(jumppage) {
      try {
        this.loading = true;
        let named = (await getNamedPage(jumppage)).data;
        this.jumppage.total = named.total;
        this.jumppage.current = named.current;
        named.records.forEach(v => {
          v["disabled"] = true;
          v.man = JSON.parse(v.man).join("，");
          v.woman = JSON.parse(v.woman).join("，");
        });
        this.tableData1 = named.records;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    // 换页
    handleCurrentChange(val) {
      this.jumppage.current = val;
      this.getNamed(this.jumppage);
    }
  }
};
</script>

<style lang="less">
@white: #e8eaed;
@blue: #81fffb;
#named {
  width: 100%;
  height: 90%;
  font-size: 1.125rem;
  .btnBox {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1%;
    & > div {
      padding: 0.25rem 2rem;
      color: #f1ed7c;
      background: linear-gradient(#1c4364 0%, #0a1127 100%);
      border: 1px solid #3a778a;
      border-radius: 5px;
      margin-left: 1.25rem;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .btn_box {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #ebe97d;
    font-size: 1rem;
    & > div:hover {
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