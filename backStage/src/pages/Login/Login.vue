<template>
  <!-- <div class="login" :style="{ 'background-image': `url(${backgroundImage})` }"> -->
  <div class="login">
    <div class="login_box" v-show="!telLogin">
      <!-- 登录标题 -->
      <div class="title">
        <!-- <img src="@/assets/imgs/icon.png" alt /> -->
        <label>智能哨兵后台管理登录</label>
      </div>
      <el-form :model="ruleForm" status-icon ref="ruleForm">
        <el-form-item
          prop="username"
          autocomplete="on"
          :rules="[
            {
              required: true,
              message: '账号不能为空',
              trigger: 'blur'
            },
            userRule
          ]"
        >
          <div class="input_box">
            <img src="@/assets/imgs/acc_icon.png" alt />
            <el-input placeholder="请输入您的账号" v-model="ruleForm.username"></el-input>
          </div>
        </el-form-item>
        <el-form-item
          prop="password"
          :rules="[
            {
              required: true,
              message: '密码不能为空',
              trigger: 'blur'
            }
          ]"
        >
          <div class="input_box">
            <img src="@/assets/imgs/lock_icon.png" alt />
            <el-input
              type="password"
              v-model="ruleForm.password"
              placeholder="请输入密码"
              autocomplete="off"
              show-password="true"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item
          prop="password"
          :rules="[
            {
              required: true,
              message: '验证码不能为空',
              trigger: 'blur'
            }
          ]"
        >
          <div class="rule_code">
            <el-input
              v-model="ruleForm.captcha"
              class="code_input"
              placeholder="请输入验证码"
              autocomplete="off"
            ></el-input>
            <div class="img_code">
              <img :src="imgCode" alt="图形验证码" @click="getImageCode()" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label-width="0">
          <button class="login_btn" @click.prevent="submitForm('ruleForm')">登录</button>
        </el-form-item>
        <!-- <button class="verification_code_btn" @click.prevent="telLogin = !telLogin">手机验证码登录</button> -->
      </el-form>
    </div>
  </div>
</template>

<script>
import IP, { login, getImgCode } from "@/apis/api";
import moment from "moment";
export default {
  data() {
    return {
      // 18081077687    123456
      IP, //公用IP
      ruleForm: {
        username: "", //账号
        password: "", //密码
        captcha: "", //验证码
        currentTimes: "" //验证码时间戳
      },
      imgCode: "" //图像验证码
      // telLogin: false,
      // getCodeMsg: "获取验证码",
      // ruleFormTel: {
      //   currentTimes: "", //验证码时间戳
      //   tel: "", //手机号码
      //   code: "", //手机验证码
      //   captcha: "" //验证码
      // }

      // 获取验证码按钮内容
    };
  },
  methods: {
    submitForm(formName) {
      // this.$router.push("/home");
      this.$refs[formName].validate(async valid => {
        if (valid) {
          login(this.ruleForm).then(res => {
            sessionStorage.token = res.data.tkt;
            sessionStorage.userdata = JSON.stringify(res.data);
            this.$message({
              type: "success",
              message: "验证成功"
            });
            this.$router.push("/home");
            sessionStorage.dropdatapathname = "/home";
          });
        } else {
          return false;
        }
      });
    },
    // 获取图形验证码
    getImageCode() {
      this.ruleForm.currentTimes = moment().valueOf(); //时间戳
      // console.log( this.ruleForm.currentTimes )
      // this.ruleFormTel.currentTimes = moment().valueOf(); //时间戳
      getImgCode(this.ruleForm.currentTimes).then(res => {
        this.imgCode = res.data;
      });
    }
  },
  created() {
    this.getImageCode();
  },
  computed: {
    // 验证规则
    userRule() {
      let rule = /^\d*$/; //只能输入整数
      let flag = rule.test(this.ruleForm.account);
      if (flag) {
        return {
          pattern: /^[1]\d{10}$/,
          message: "请输入正确的手机号码",
          trigger: "blur"
        };
      } else {
        return {};
      }
    }
  }
};
</script>

<style lang="less">
.login {
  height: 100%;
  width: 100%;
  background: url("../../assets/imgs/login_bg.jpg") no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    width: 42rem;
    height: 32.75rem;
    background: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .el-form-item {
      .input_box {
        width: 26.5rem;
        padding-left: 1.125rem;
        height: 3.5rem;
        background: rgba(255, 255, 255, 0.205);
        border: 2px solid #d8d8d8;
        border-radius: 5px;
        display: flex;
        align-items: center;
        & > img {
          width: 1.375rem;
          height: 1.375rem;
        }
      }
      .tel_input_box {
        margin-top: 4.125rem;
      }
      .rule_code {
        display: flex;
        width: 26.875rem;
        padding-right: 0.875rem;
        height: 3.5rem;
        background: rgba(255, 255, 255, 0.205);
        border: 2px solid #d8d8d8;
        border-radius: 5px;
        align-items: center;
        .code_input {
          flex: 2;
        }
        .img_code {
          height: 2.5rem;
          width: 8.125rem;
          flex: 1;
          &:hover {
            cursor: pointer;
          }
          & > img {
            width: 100%;
            height: 100%;
          }
        }
        .code_btn {
          height: 2.5rem;
          width: 8.125rem;
          background: none;
          outline: none;
          background: #ce9f26;
          border: none;
          border-radius: 5px;
          line-height: 2.5rem;
          text-align: center;
          color: #fff;
          font-size: 1.125rem;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    .title {
      font-size: 2.75rem;
      padding: 3rem 0 3.125rem;
      color: #2a76b5;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 0.625rem;
      font-weight: bold;
      & > img {
        width: 2.5rem;
        height: 3.75rem;
        margin-right: 1.125rem;
      }
    }
    .login_btn {
      width: 27.875rem;
      height: 3.75rem;
      background: #2a76a8;
      font-size: 1.125rem;
      color: #fff;
      border: none;
      outline: none;
    }
    .verification_code_btn {
      margin: 0 auto;
      display: block;
      font-size: 1rem;
      color: #2a76a8;
      border: none;
      background: none;
      outline: none;
      text-align: center;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .el-input input {
    background: none;
    color: #9f9f9f;
    border: none;
    height: 2.5455rem;
    font-size: 16px;
  }
}
</style>