<template>
  <div id="carousel">
    <div class="title">轮播图管理</div>
    <div class="table_phone">
      <div class="table">
        <div class="thead">
          <div>图片</div>
          <div>排序</div>
          <div>上传时间</div>
          <div>操作</div>
        </div>
        <div class="tbody">
          <div class="tr" v-for="(v,i) in imgTable" :key="i">
            <div @click="checkItem(v)">
              <img :src="v.uri" alt />
            </div>
            <div>{{ v.sort }}</div>
            <div>{{v.createTime}}</div>
            <div>
              <label class="sort_btn">
                排序
                <el-select v-model="v.sort" placeholder="排序" @change="handleSort($event,v)">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </label>
              <label class="delete_btn" @click="handleDelete(v)">删除</label>
            </div>
          </div>
          <div class="upload" v-show="imgTable.length!=3">
            <upload v-model="imgUrl" />
            <el-button @click="uploadImg">确认</el-button>
          </div>
        </div>
      </div>
      <div class="phone">
        <img :src="defaulImg" alt />
        <img src="../../assets/imgs/phone_bottom.png" alt />
      </div>
    </div>
  </div>
</template>

<script>
import upload from "@/components/upload";
import moment from "moment";
import { imgFetchPage, deleteImg, imgSave } from "@/apis/api";
export default {
  components: { upload },
  data() {
    return {
      imgUrl: "",
      imgTable: [],
      defaulImg: require("../../assets/imgs/lunbo.png"),
      options: [
        {
          value: "1",
          label: "1"
        },
        {
          value: "2",
          label: "2"
        },
        {
          value: "3",
          label: "3"
        }
      ]
    };
  },
  methods: {
    // 上传图片
    uploadImg() {
      if (this.imgUrl != "") {
        this.getImgSave({
          uri: this.imgUrl,
          sort: this.imgTable.length + 1
        });
      } else {
        this.$message({
          message: "请添加图片",
          type: "warning"
        });
      }
    },
    checkItem(v) {
      console.log(v);
      this.defaulImg = v.uri;
    },
    // 排序
    handleSort(val, v) {
      this.getImgSave({
        uri: v.uri,
        imgId: v.imgId,
        sort: val
      });
    },
    // 上传修改图片
    async getImgSave(obj) {
      console.log(obj);
      let result = await imgSave(obj);
      this.getImgFetchPage();
      if (result)
        this.$message({
          message: "添加成功",
          type: "success"
        });
    },
    //获取轮播分页
    async getImgFetchPage() {
      let result = (await imgFetchPage()).data;
      result.records.forEach(v => {
        v.createTime = moment(v.createTime).format("YYYY-MM-DD HH:mm:ss");
      });
      this.imgTable = result.records;
    },
    // 删除按钮
    handleDelete(v) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.getDeleteImg(v.imgId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 删除图片
    async getDeleteImg(id) {
      let result = await deleteImg(id);
      if (result) this.getImgFetchPage();
      this.$message({
        type: "success",
        message: "删除成功!"
      });
    }
  },
  created() {
    this.getImgFetchPage();
  }
};
</script>

<style lang="less">
@white: #e8eaed;
@blue: #81fffb;
#carousel {
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
  & > .table_phone {
    width: 100%;
    display: flex;
    height: 90%;
    margin-top: 1%;
    .table {
      width: 67.7%;
      height: 100%;
      border: 1px solid #274f60;
      border-radius: 10px 10px 0 0;
      .thead {
        width: calc(100% - 8px);
        padding-right: 8px;
        height: 3.5%;
        display: flex;
        background: linear-gradient(#1c4364 0%, #0a1127 100%);
        border-bottom: 1px solid #274f60;
        font-size: 1rem;
        color: @blue;
        align-items: center;
        border-radius: 10px 10px 0 0;
        & > div {
          text-align: center;
        }
        & > div:nth-of-type(1) {
          width: 30%;
        }
        & > div:nth-of-type(2) {
          width: 10%;
        }
        & > div:nth-of-type(3) {
          width: 30%;
        }
        & > div:nth-of-type(4) {
          width: 30%;
        }
      }
      .tbody {
        width: 100%;
        height: calc(96.5% - 1px);
        overflow-y: auto;
        font-size: 1rem;
        color: @white;
        background: #19213877;
        .tr {
          width: 100%;
          height: 18.8%;
          display: flex;
          align-items: center;
          &:hover {
            background: #0a112771;
          }
          & > div:nth-of-type(1) {
            width: 30%;
            & > img {
              width: 12.5rem;
              height: 7.75rem;
            }
          }
          & > div:nth-of-type(2) {
            width: 10%;
          }
          & > div:nth-of-type(3) {
            width: 30%;
          }
          & > div:nth-of-type(4) {
            width: 30%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            & > .sort_btn {
              color: #dedc78;
              &:hover {
                cursor: pointer;
              }
            }
            & > .delete_btn {
              color: #dc523e;
              &:hover {
                cursor: pointer;
              }
            }
            .el-input--suffix .el-input__inner {
              padding: 0 0 0 10px;
              width: 46px;
            }
            .el-input__icon {
              width: 12px;
            }
          }
          & > div {
            text-align: center;
          }
        }
        .upload {
          padding: 5% 0;
          width: 100%;
          border-bottom: 1px solid #152d4c;
          display: flex;
          justify-content: space-around;
          align-items: center;
          .el-button {
            background: linear-gradient(#1c4364 0%, #0a1127 100%);
            border: 1px solid @blue;
            color: @white;
          }
        }
      }
    }
    .phone {
      width: 18.8125rem;
      height: 33.375rem;
      padding: 4.875rem 1.375rem 4.875rem 1.4375rem;
      background: url("../../assets/imgs/phone.png") no-repeat;
      background-size: 100% 100%;
      margin: 0 auto;
      & > img:nth-of-type(1) {
        width: 100%;
        height: 36%;
      }
      & > img:nth-of-type(2) {
        width: 100%;
        height: 64%;
        position: relative;
        top: -0.25rem;
      }
    }
  }
  .el-upload__tip {
    color: @white;
  }
}
</style>