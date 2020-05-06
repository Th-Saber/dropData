<template>
  <div class="findOption">
    <el-cascader
      :options="selectData"
      placeholder="请选择分类"
      :props="{ checkStrictly: !isSelect }"
      v-model="cascader"
      @change="changeSelect"
      clearable
    >
    </el-cascader>
    <el-select
      v-model="optionData"
      clearable
      placeholder="请选择单位"
      v-loading="selectload"
    >
      <el-option
        v-for="item in options"
        :key="item.did + 'option'"
        :label="item.nam"
        :value="item.did"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
// 父组件 使用 :name.sync="value1"
import { findDepartment } from "@api";
import selectData from "@/assets/js/selectdata";
import selectData1 from "@/assets/js/selectdata1";
export default {
  props: { did: Number, data: Array, isSelect: Boolean, user: Boolean },
  data() {
    return {
      selectData, //级联数据
      selectload: false, //下拉框加载条
      cascader: this.data, //级联数据
      options: [], //下拉框
      optionData: this.did //下拉框选中数据
    };
  },
  watch: {
    //   监听props值组件变化
    did(newVal, oldVal) {
      this.optionData = newVal;
    },
    data(newVal, oldVal) {
      if (newVal) {
        this.cascader = newVal;
        this.changeSelect(newVal);
      }
    },
    // 监听是否权限为纪检委
    isSelect(newVal, oldVal) {
      this.cascader = [];
      this.optionData = "";
      let newArr = selectData1.map((v, i) => {
        if (i < 2) {
          v.disabled = newVal ? true : false;
        }
        return v;
      });
      this.selectData = newArr;
    },
    // 监听本组件内值变化
    optionData(newVal, oldVal) {
      this.$emit("update:did", newVal);
    }
  },
  methods: {
    // 请求所有单位
    async findAll() {
      let { cascader } = this;
      let params = {
        typeOne: cascader[0],
        typeTwo: cascader[1],
        typeThree: cascader[2]
      };
      for (const key in params) {
        if (!params[key]) {
          delete params[key];
        }
      }
      this.selectload = true;
      try {
        let res = await findDepartment(params);
        this.options = res.data.records;
        if (!this.options.length) {
          this.optionData = "";
        }
        this.selectload = false;
      } catch (error) {
        this.selectload = false;
        console.log("error", error);
      }
    },
    //级联数据改变请求部门
    changeSelect(val) {
      if (!val.length) {
        this.options = [];
        this.optionData = "";
        return;
      }
      if (!this.selectload) {
        this.findAll();
      }
    }
  },
  created() {
    if (this.user) {
      this.selectData = selectData1;
    }
    if (this.data) {
      this.changeSelect(this.data);
    }
  }
};
</script>

<style lang="less" scoped>
</style>