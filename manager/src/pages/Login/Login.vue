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
          prop="tel"
          autocomplete="on"
          :rules="[
            {
              required: true,
              message: '手机号码不能为空',
              trigger: 'blur'
            },
            userRule
          ]"
        >
          <div class="input_box">
            <img src="@/assets/imgs/acc_icon.png" alt />
            <el-input placeholder="请输入您的手机号" v-model="ruleForm.tel"></el-input>
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
        <button class="verification_code_btn" @click.prevent="telLogin = !telLogin">手机验证码登录</button>
      </el-form>
    </div>
    <div class="login_box" v-show="telLogin">
      <!-- 登录标题 -->
      <div class="title">
        <!-- <img src="@/assets/imgs/icon.png" alt /> -->
        <label>智能哨兵后台管理登录</label>
      </div>
      <el-form :model="ruleFormTel" status-icon ref="ruleFormTel">
        <el-form-item
          prop="captcha"
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
              v-model="ruleFormTel.captcha"
              class="code_input"
              placeholder="请输入验证码"
              autocomplete="off"
            ></el-input>
            <div class="img_code">
              <img :src="imgCode" alt="图形验证码" @click="getImageCode()" />
            </div>
          </div>
        </el-form-item>
        <el-form-item
          prop="tel"
          autocomplete="on"
          :rules="[
            {
              required: true,
              message: '手机号码不能为空',
              trigger: 'blur'
            },
            userRule
          ]"
        >
          <div class="rule_code">
            <el-input v-model="ruleFormTel.tel" class="code_input" placeholder="请输入手机号码"></el-input>
            <button class="code_btn" @click.prevent="getCode">{{getCodeMsg}}</button>
          </div>
        </el-form-item>
        <el-form-item prop="password">
          <div class="input_box">
            <img src="@/assets/imgs/lock_icon.png" alt />
            <el-input v-model="ruleFormTel.code" placeholder="请输入短信验证码" autocomplete="off"></el-input>
          </div>
        </el-form-item>
        <el-form-item label-width="0">
          <button class="login_btn" @click.prevent="submitTelForm('ruleFormTel')">登录</button>
        </el-form-item>
        <button class="verification_code_btn" @click.prevent="telLogin = !telLogin">密码登录</button>
      </el-form>
    </div>
  </div>
</template>

<script>
import IP, { login, getImgCode, getMsgLoginCode, msgLogin } from "@/apis/api";
import moment from "moment";
import "./cover.css";
export default {
  data() {
    return {
      // 18081077687    123456
      IP, //公用IP
      ruleForm: {
        tel: "", //账号
        password: "", //密码
        captcha: "", //验证码
        currentTimes: "" //验证码时间戳
      },
      imgCode: "", //图像验证码
      telLogin: false,
      getCodeMsg: "获取验证码",
      ruleFormTel: {
        currentTimes: "", //验证码时间戳
        tel: "", //手机号码
        code: "", //手机验证码
        captcha: "" //验证码
      }

      // 获取验证码按钮内容
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          login(this.ruleForm).then(res => {
            console.log(res);
            sessionStorage.tkt = res.data.tkt;
            sessionStorage.homeUserId = res.data.homeUserId;
            sessionStorage.userId = res.data.userId;
            sessionStorage.name = res.data.name;
            sessionStorage.integral = res.data.integral;
            this.$message({
              type: "success",
              message: "验证成功"
            });
            this.$router.push("/point");
            sessionStorage.pathname = "/point";
          });
        } else {
          return false;
        }
      });
    },
    submitTelForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(this.ruleFormTel);
          msgLogin(this.ruleFormTel).then(res => {
            this.$message({
              type: "success",
              message: "验证成功"
            });
            sessionStorage.token = res.data.tkt;
            sessionStorage.homeUserId = res.data.homeUserId;
            sessionStorage.userId = res.data.userId;
            sessionStorage.name = res.data.name;
            sessionStorage.integral = res.data.integral;
            this.$router.push("/point");
          });
        } else {
          return false;
        }
      });
    },

    // 点击发送手机验证码.
    getCode() {
      let seconds = 60;
      let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (this.ruleFormTel.tel && this.ruleFormTel.captcha) {
        if (reg.test(this.ruleFormTel.tel)) {
          document.querySelector(" .code_btn").disabled = true;
          getMsgLoginCode(this.ruleFormTel).then(res => {
            console.log(res);
          });
          let timer = setInterval(() => {
            seconds -= 1;
            this.getCodeMsg = seconds + "s";

            if (seconds == 0) {
              this.getCodeMsg = "获取验证码";
              clearInterval(timer);
              document.querySelector(" .code_btn").disabled = false;
            }
          }, 1000);
        } else {
          this.$message({
            showClose: true,
            message: "错了哦，请输入正确手机号码",
            type: "error"
          });
        }
      } else {
        this.$message({
          showClose: true,
          message: "请输入验证码和手机号",
          type: "error"
        });
      }
    },

    // 获取图形验证码
    getImageCode() {
      this.ruleForm.currentTimes = moment().valueOf(); //时间戳
      this.ruleFormTel.currentTimes = moment().valueOf(); //时间戳
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

<style lang="less" scoped>
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
    width: 30.5455rem;
    height: 24.2727rem;
    background: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .el-form-item {
      .input_box {
        width: 19.27rem;
        padding-left: 0.82rem;
        height: 2.5455rem;
        background: rgba(255, 255, 255, 0.205);
        border: 2px solid #d8d8d8;
        border-radius: 5px;
        display: flex;
        align-items: center;
        & > img {
          width: 1rem;
          height: 1rem;
        }
      }
      .tel_input_box {
        margin-top: 3rem;
      }
      .rule_code {
        display: flex;
        width: 19.5rem;
        padding-right: 0.59rem;
        height: 2.5455rem;
        background: rgba(255, 255, 255, 0.205);
        border: 2px solid #d8d8d8;
        border-radius: 5px;
        align-items: center;
        .code_input {
          flex: 2;
        }
        .img_code {
          height: 1.86rem;
          width: 5.91rem;
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
          height: 1.86rem;
          width: 5.91rem;
          background: none;
          outline: none;
          background: #ce9f26;
          border: none;
          border-radius: 5px;
          line-height: 1.86rem;
          text-align: center;
          color: #fff;
          font-size: 0.8rem;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    .title {
      font-size: 2rem;
      padding: 2.14rem 0 2.32rem;
      color: #2a76b5;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 0.4545rem;
      font-weight: bold;
      & > img {
        width: 1.86rem;
        height: 2.77rem;
        margin-right: 0.77rem;
      }
    }
    .login_btn {
      width: 20.25rem;
      height: 2.68rem;
      background: #2a76a8;
      font-size: 0.9091rem;
      color: #fff;
      border: none;
      outline: none;
    }
    .verification_code_btn {
      margin: 0 auto;
      display: block;
      font-size: 0.7273rem;
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
}
</style>