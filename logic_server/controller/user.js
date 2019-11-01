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


    async getUserList(msg,next)
    {
        let sendData={}
        sendData.data = await UserModel.find(msg.queryObj).sort({
            deadLine: -1
        }).skip(Number(msg.pageSize) * (Number(msg.current) - 1)).limit(Number(msg.pageSize));
        sendData.totalItems = await UserModel.count(msg.queryObj);
        next(sendData)
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


    async getUserInfo(msg,data,next) 
   {

     const u=await UserModel.findOne({cookie:msg.cookie});

        data.status=200;
    if(u){
        let day=u.deadLine-new Date()
        if(day<0)
        {
             data['day']='0 天 0小时'
             data["timeOut"]=true
        }

         else{
            var t=1*1000*60*60;
            var time=day/t; //小时
            day=Math.floor(time/24);
            time=Math.floor(time%24)
            data['day']=day+'天'+time+'小时';
            data["timeOut"]=false
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



    async activeCount(msg,data,next){

        let newDeadLine=new Date()
        newDeadLine.setDate(newDeadLine.getDate()+_config.tryDay);
       let a =await UserModel.findOneAndUpdate({userName:msg.emall,activeCode:msg.code,enable:false},{$set:{enable:true,deadLine:newDeadLine}});
       
       if(a) next({msg:Tip.Active})
        else next({msg:"failed!"})
    }

    async register(msg,data,next) 
    {
        if(msg.password==msg.rePassword)
        {
            //数据库处理....
            const r=await UserModel.findOne({userName:msg.userEmail});

            if(r)
            {
                if(r.enable)
                {
                    data.data=false;
                    data.msg=Tip.AccountExists;
                    data.status=500;
                    next(data)
                }else{
                var code=Common.GetRandomNum(100000,999999);
                await UserModel.findOneAndUpdate({userName:msg.userEmail},{$set:{password:msg.password,activeCode:code}})
                let content=Tip.activeUrl.replace("emall%",msg.userEmail).replace("code%",code)
                Common.SedEamll(msg.userEmail,Tip.Welcome,content,content,_config.emall,_config.smtp,_config.password,async function(err,info){
                 if(err){
                        data.data=false;
                        data.msg=Tip.SendEmailError;
                        data.status=500;
                        next(data)
                    }else{
                         data.data=false
                         data.msg=Tip.Register
                         data.status=200;
                          next(data)
                      }
                }); 
                }
        

            }else{
                var code=Common.GetRandomNum(100000,999999);

                 const user = new UserModel({userName:msg.userEmail,password:msg.password,activeCode:code})
                 await user.save();
                 let content=Tip.activeUrl.replace("emall%",msg.userEmail).replace("code%",code)
                Common.SedEamll(msg.userEmail,Tip.Welcome,content,content,_config.emall,_config.smtp,_config.password,async function(err,info){
                 if(err){
                        data.data=false;
                        data.msg=Tip.SendEmailError;
                        data.status=500;
                        next(data)
                    }else{
                         data.data=false
                         data.msg=Tip.Register
                         data.status=200;
                          next(data)
                      }
                }); 
            }
         }else{
                data.data=false;
                data.msg=Tip.PasswordDifferent;
                data.status=500;
                next(data)
         }
    }

   async checkRegister(msg,data,next)
    {
        const r=await UserModel.findOne({userName:msg.userEmail,enable:true});
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

    async deleteUsers(msg,next)
    {
        const data=  await UserModel.remove({
                id: msg.id
            });
        next(data)
    }


//     function login(d,response,callback){
//     var data=JSON.parse(JSON.stringify(responseData));
//     if(d.hasOwnProperty("disptch")){
//         data.disptch=d.disptch;
//     }
//     data_del.verifyUserNameAndPassword(d.userEmail,d.password,function(err,res,filed){
//         if(err){
//             data.data= false;
//             data.status=500;
//             data.msg="数据查询异常！"
//             callback(data,response);
//         }else if (res.length!=1){
//             data.data= false;
//             data.status=0;
//             data.msg="账号或者密码错误！"
//             callback(data,response);
//         }
//         else{
//             var _data=JSON.parse(JSON.stringify(RD_data));
//             data_del.updateCookie(d.userEmail,function(err,res){
//                 if(err){
//                     data.data= false;
//                     data.status=500;
//                     data.msg="数据生成异常！"
//                 }else{
//                     _data.cookie=res
//                     _data.userEmail=d.userEmail;
//                     data.data=_data;
//                     data.status=200;
//                     data_del.getInvationCode(d.userEmail,function(err,res){
//                     _data.invationCode=res
//                     if(err){
//                             _data.invationCode="NULL"
//                     }
//                     data_del.getKey(d.userEmail,function(err,res){
//                         _data.key=res

//                         callback(data,response);
//                     });
//                     });
//                 }
//             })

//         }
//     });
// }



    async login(msg,data,next) 
    {
        let cookie=Common.Getuuid();
        const r=await UserModel.findOneAndUpdate({userName:msg.userEmail,password:msg.password,enable:true}, { $set:{cookie:cookie}});
        if(r){
            data.data.cookie=cookie
            data.data.key=cookie
            data.data.invationCode="NULL"
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
            Common.SedEamll(r.userName,Tip.FindPassword,Tip.FindPasswordTxt.replace("e%",newPassWord),Tip.FindPasswordHtml.replace("e%",newPassWord),_config.emall,_config.smtp,_config.password,async function(err,info){
                if(err){
                    data.msg=Tip.SendEmailError;
                    data.status=500;
                        console.log(err)

                    next(data)
                }else{
                    await UserModel.findOneAndUpdate({userName:msg.userEmail},{$set:{password:newPassWord}});
                    data.msg=Tip.SendNewPassWord.replace("e%", r.userName);
                    data.status=200;
                    next(data)
                }
            });

          }else{
                data.msg=Tip.NotEmail;
                data.status=500;
                next(data)
          }
    }

   async addTime(msg,next) 
    {
        const u=await UserModel.findOne({id:msg.userName});
        const g=await GoodsModel.findOne({id:msg.goodsId});
        let newDeadLine=new Date()
        if((u.deadLine- newDeadLine)>0)
            newDeadLine=u.deadLine
        newDeadLine.setDate(newDeadLine.getDate()+g.days);
        await UserModel.findOneAndUpdate({id:msg.userName},{$set:{deadLine:newDeadLine}})

        next({price:g.price})
    }



    async userInfo(msg,data,next) 
    {

    }

}

module.exports = new User();