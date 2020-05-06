<template>
  <div id="business">
    <div class="phone">
      <div class="box">
        <editor ref="editor" />
      </div>
    </div>
    <br />
    <div class="button" @click="uplaodText">上传</div>
  </div>
</template>

<script>
import editor from "@/components/editor";

export default {
  components: { editor },
  methods: {
    uplaodText() {
      this.$refs.editor.upload(2);
    }
  },
  mounted() {
    this.$refs.editor.getContentFetchList(2);
  }
};
</script>

<style lang="less" scoped>
#business {
  width: 100%;

  .phone {
    width: 18.8125rem;
    height: 33.375rem;
    padding: 4.875rem 1.375rem 4.875rem 1.4375rem;
    background: url("../../../assets/imgs/phone.png") no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    .box {
      width: 100%;
      height: 100%;
    }
  }
  .button {
    width: 80px;
    height: 30px;
    margin: 0 auto;
    background: linear-gradient(#1c4364 0%, #0a1127 100%);
    border-radius: 5px;
    color: #fafafa;
    line-height: 30px;
    text-align: center;
    border: 1px solid #64ffef;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>