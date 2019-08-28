const UserModel = require("../models").User;
const Common=require('../common.js')

const Tip =  require("../config/tip");
let _setting = require('../config/setting');
let _config = require('../config/config');
var uuid = require('node-uuid');


class User {
    constructor() {
        // super()
    }




    //pingServer 消息
    //客户端消息处理

        // var rd = data.data;
        // versionStatus = rd.versionStatus;
        // homePage = rd.homePage;
        // invat_link = rd.invationLink;
        // praise_link = rd.praiceLink;
        // showNotices(rd.notices);
        // if (data.status == 200) {
        //     if (rd.invationCode) invationCode = rd.invationCode;
        //     if (versionStatus == 0 || versionStatus == 1) {
        //         setLastLoginName(rd.userEmail);
        //         var key = rd.key;
        //         initWebSocket(key)
        //     } else {
        //         setIconUpdate();
        //         setProxy();
        //         Domains.clear();
        //         geckoPxy.clear();
        //         opPageOnInstall()
        //     }
        // } else {
        //     setIconLogin();
        //     reset()
        // }

   async isLogin(msg,data,next) 
    {
        // data.cookie=msg.cookie
        // data.userEmail=msg.lastUser;
        // data.data= "";
         data.status=5000;
        const r=await UserModel.findOne({cookie:msg.cookie});
        if(r){
            data.status=200;
            data.data.key=uuid.v1();
        }
        next(data)
    }


   async checkLogin(msg,data,next) 
   {

     const u=await UserModel.findOne({cookie:msg.cookie});

         data.data=true;
            data.status=200;
    if(u){
        let day=u.deadLine-new Date()
        if(day<0)
             data['day']='0 天 0小时'
         else{
            var t=1*1000*60*60;
            var time=day/t; //小时
            day=Math.floor(time/24);
            time=Math.floor(time%24)
            data['day']=day+'天'+time+'小时';

           // var links={}



  // maxHostCount:10,
  // mallurl:"dddd",
  // helpQQ:"1010017806",
  // helpEmail:"1010017806@qq.com",
  // homePage:"",
  // praiceLink:"",

            // var arg='?userName='+d.lastUser
            // links['mallurl']=_config.mallurl+arg+'&action=buy';
            // links['homePage']=_config.homePage+arg+'&action=gohome';
            // links['invationLink']=_config.mallurl+arg+'&action=invation';
            // links['praiceLink']=_config.mallurl+arg+'&action=praice';
            // links['goolgeStroeLink']=_config.mallurl;

            //data['links']=links;
         }
    }else {
           data.msg="强制退出"
            data.data="FORCE_LOGOUT"
            data.status=500;
    }


//     data_del.isLogin(d.lastUser,d.cookie,function(err,res){
//         if(err){
//             data.msg="强制退出"
//             data.data="FORCE_LOGOUT"
//             data.status=500;

//         }else if(res.length>0){
//             data.data=true;
//             data.status=200;
//             if(res[0].isfree){
//                 data['day']='Free';
//             }else{
//                 var now= new Date();
//                 var day=common.strToDate(res[0].date)-now;

//                 if(day<0){
//                     data['day']='0 天 0小时';
//                 }else{
//                     var t=1*1000*60*60;
//                     var time=day/t; //小时

//                     day=Math.floor(time/24);

//                     time=Math.floor(time%24)

//                     data['day']=day+'天'+time+'小时';
//                 }

//             }
//             var links={};
//             var array=d.version.split("_");
//             var v;
//             var n;
//             if(array.length>1){
//                 n=array[0];
//                 v=array[1];
//             }else{
//                 v=array[0];
//                 n="HelloWorld";
//             }

//             // var arg='?userEmail='+d.lastUser+'&version='+v+'&invationcode='+res[0].invationcode;
//             // links['mallurl']=C.mallurl(n)+arg+'&action=buy';
//             // links['homePage']=C.homePage(n)+arg+'&action=gohome';
//             // links['invationLink']=C.invationLink(n)+arg+'&action=invation';
//             // links['praiceLink']=C.praiceLink(n)+arg+'&action=praice';
//             // links['goolgeStroeLink']=C.goolgeStroeLink(n);

//             data['links']=links;

//         }else{
//             data.msg="强制退出"
//             data.data="FORCE_LOGOUT"
//             data.status=500;
//         }
//         callback(data,response);
//     })
// }
        next(data)
   }

    

    async getUserByName(name) 
    {
        const user=await UserModel.findOne({userName:name})
        return user
    }

    async getUserByCookie(c) 
    {
        const user=await UserModel.findOne({cookie:c})
        return user
    }



    async register(msg,data,next) 
    {
        if(msg.password==msg.rePassword)
        {
            //数据库处理....
            const r=await UserModel.findOne({userName:msg.userEmail});

            if(r)
            {
                data.data=false;
                data.msg=Tip.AccountExists;
                data.status=500;

            }else{
                  const user = new UserModel({userName:msg.userEmail,password:msg.password})
                  await user.save();

                  data.data=true
                  data.msg=Tip.Success
                  data.status=200;
            }
            next(data)
         }
    }

   async checkRegister(msg,data,next)
    {
        const r=await UserModel.findOne({userName:msg.userEmail});
        if(r)
        {
            data.data=true;
            data.msg=Tip.AccountExists;
            data.status=500;
        }
        else
        {
            data.data=false
            data.status=200;
        }
        next(data);
    }

    async login(msg,data,next) 
    {
        let cookie=Common.Getuuid();
        const r=await UserModel.findOneAndUpdate({userName:msg.userEmail,password:msg.password}, { $set:{cookie:cookie}});
        if(r){
            let content={}
            data.data.cookie=cookie
            data.data.key=cookie
            data.data.userEmail=r.userName
            data.status=200;

        }else{
            data.data= false;
            data.status=500;
            data.msg=Tip.Error
        }
        next(data);
    }

        
    async resetPassword(msg,data,next) 
    {
        if(msg.newPwd1==msg.newPwd2)
        {
            await UserModel.findOneAndUpdate({userName:msg.lastUser,password:msg.oldPwd}, { $set:{password:msg.newPwd2}});
            data.msg=Tip.Success;;
            data.status=200;
        }
        else
        {
           data.msg=Tip.PasswordDifferent;
           data.status=500;
        }
        next(data)
    }

    addTime(msg,next) 
    {

    }

    userInfo(msg,data,next) 
    {

    }

}

module.exports = new User();