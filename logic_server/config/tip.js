let _config = require('./config');

module.exports = {
  ServerError:'服务器异常',
  AccountExists:'账号已存在',
  PasswordDifferent:"两次密码不一致!",
  Success:"操作成功！",
  Register:"操作成功，请前往邮箱激活账号！",
  Active:"Success!",
  NoLogin:"未登录",
  LoginError:"账号或密码错误!",
  Error:"失败",
  TimeOut:"体力耗尽",
  TimeOutTip:"亲，请充值VIP，补充体力～",
  NotEmail:"该账号不存在",
  SendEmailError:"邮件发送失败，请确认重试!",
  SendNewPassWord:"新密码已发送至e%请及时登录邮箱，获取密码！",
  FindPassword:"找回密码",
  FindPasswordTxt:"新密码:e%",
  FindPasswordHtml:"<p>新密码:e%</p>",
  Welcome:"欢迎注册StormVPN",
  activeUrl:"点击<a href='"+_config.ActiveUrl+"'>这里</a>激活账号"
}