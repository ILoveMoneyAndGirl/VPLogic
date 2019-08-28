const ModeBase = require("./modeBase");



const UserSchema = {
    ref:"user",
    _id: {map:"id",type:Number},
    enable: {type: Number,map:"state"}, //用户是否有效
    deadLine:{map:"deadLine",type:String},//截止日期
    type:{map:"type",type:String},//类型
    cookie: {map:"cookie",type:String},
    password: {map:"password",type:String},//密码
    userName: {map:"userName",type:String},//密码
};


function User(data)
{
    this._data=data
    ModeBase.call(this._data);
}

User.prototype= new ModeBase()
User.prototype.Schema=UserSchema
User.prototype.Refresh="refreshUserInfo"


User.__proto__=User.prototype

User.prototype.authenticationAca=function(d) {

  let mask={"_id":1,"aCA":1,"name":1}
  let data=utils.AssembleData(this.Schema,d,mask)

     let p=new Promise((resolve, reject) => {

        if(typeCheck.isUndefined(data))
        {
            resolve(0)
        }else{
            BuildServer.UpdateData("authIdentityUser",data,function(err){
                if(err)
                    reject(err)
                else
                    resolve(0);
            })
        }
    })

    return p

}

User.prototype.authenticationVca=function(d) {

    let mask={"_id":1,"vCA":1,"description":1,"vType":1}
    let data=utils.AssembleData(this.Schema,d,mask)

     let p=new Promise((resolve, reject) => {

        if(typeCheck.isUndefined(data))
        {
            resolve(0)
        }else{
            BuildServer.UpdateData("authVipUser",data,function(err){
                if(err)
                    reject(err)
                else
                    resolve(0);
            })
        }
    })

    return p

}
User.prototype.regUser=function(d) {

    let mask={"phoneNum":1,"userName":1,"logo":1}
    let data=utils.AssembleData(this.Schema,d,mask)

     let p=new Promise((resolve, reject) => {

        if(typeCheck.isUndefined(data))
        {
            resolve(0)
        }else{
            BuildServer.UpdateData("registerUser",data,function(err){
                if(err)
                    reject(err)
                else
                    resolve(0);
            })
        }
    })

    return p

}

User.prototype.loginUser=function(d) {

    let mask={"phoneNum":1}
    let data=utils.AssembleData(this.Schema,d,mask)

     let p=new Promise((resolve, reject) => {

        if(typeCheck.isUndefined(data))
        {
            resolve(0)
        }else{
            BuildServer.UpdateData("loginUser",data,function(err){
                if(err)
                    reject(err)
                else
                    resolve(0);
            })
        }
    })

    return p

}


module.exports = User

