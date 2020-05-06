const ruleObj = {
  bankCode: /^([1-9]{1})(\d{15}|\d{18})$/, //银行卡
  phone: /^[1]\d{10}$/, //手机号码
  password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/, //密码6~12位 字母数字混合
  number: /^\d*$/, //数字
  idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, //身份证
  email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, //邮箱
};
export function testRule(type, str) {
  return ruleObj[type].test(str);
}
