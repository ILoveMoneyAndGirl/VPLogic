const UserModel = require("../models").User;
const GoodsModel = require("../models").Goods

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
            data.data.userEmail=r.userName
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
            let links={}
            links['homePage']=_config.homePage;
            links['helpQQ']=_config.helpQQ;
            links['helpEmail']=_config.helpEmail;
            links['chromeLink']=_config.chromeLink;


            data['links']=links;
         }
    }else {
           data.msg="强制退出"
            data.data="FORCE_LOGOUT"
            data.status=500;
    }

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


    async findPassword(msg,data,next)
    {
          const r=await UserModel.findOne({userName:msg.userEmail});
          if(r){
            var newPassWord=Common.GetRandomNum(100000,999999);

            Common.SedEamll(r.userName,Tip.FindPassword,tip.FindPasswordTxt.replace("e%",newPassWord),tip.FindPasswordHtml.replace("e%",newPassWord),_config.emall,_config.smtp,_config.password,function(err,info){
                if(err){
                    data.msg=tip.SendEmailError;
                    data.status=500;
                    next(data)
                }else{
                    await UserModel.findOneAndUpdate({userName:msg.userEmail},{$set:{password:newPassWord}});
                    data.msg=Tip.SendNewPassWord.replace("e%", r.userName);
                    data.status=200;
                    next(data)
                }
            });

          }else{
                data.msg=tip.NotEmail;
                data.status=500;
                next(data)
          }
    }

   async addTime(msg,next) 
    {
        const u=await UserModel.findOne({userName:msg.userName});
        const g=await GoodsModel.findOne({id:msg.goodsId});
        let newDeadLine=new Date()
        if((u.deadLine- newDeadLine)>0)
            newDeadLine=u.deadLine
        newDeadLine.setDate(newDeadLine.getDate()+g.days);
        await UserModel.findOneAndUpdate({userName:msg.userName},{$set:{deadLine:newDeadLine}})

        next({price:g.price})
    }



    async userInfo(msg,data,next) 
    {

    }

}

module.exports = new User();