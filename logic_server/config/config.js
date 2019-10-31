let _setting = require('./setting');

module.exports = {
  maxHostCount:20,
  mallurl:"dddd",
  helpQQ:"请访问https://github.com/fishdivetechnology/StormVPN，该页面有联系QQ",
  helpEmail:"fishdivetechnology@gmail.com",
  homePage:"https://github.com/fishdivetechnology/StormVPN",
  chromeLink:"https://chrome.google.com/webstore/detail/stormvpn/gdgekinnjookhmchkemmnejcnfcaehhc?hl=zh-CN&authuser=1",
  praiceLink:"",
  payUrl:"http://pay.liguaika.xyz:3000/order",
  payToken:"q02PLH5Q",
  appID:"Owy2e3E",
  emall:"fishdivetechnology@gmail.com",
  smtp:"smtp.gmail.com",
  password:"fishDiveyibo.c.c.c",
  netIP:_setting.netIP,
  tryDay:10,
  commonUser:"test3@test.com",
  ActiveUrl:"http://"+_setting.netIP+":"+_setting.webPort+"/?action=activeCount&emall=emall%&code=code%"
}
