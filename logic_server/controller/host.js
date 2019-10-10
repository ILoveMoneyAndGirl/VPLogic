const HostModel = require("../models").Host
const UserModel = require("../models").User
const SettingsModel = require("../models").Settings

const Setting = require('../config/setting');


const Common=require('../common.js')

const Tip =  require("../config/tip");


class Host {
    constructor() {
        // super()
    }


   	async GetHost()
   	  {
   	  	let hostList=await HostModel.find({enable:true})
   	  	let list=[]

   	  	let count=Setting.maxHostCount<hostList.length?Setting.maxHostCount:hostList.length

   	  	for (var i = 0; i < count; i++) {
   	  		let t={}
          let index=Common.GetRandomNum(0,hostList.length-1)
   	  		let host=hostList[index]
          hostList.splice(index,1)
   	  		t["address"]=host.name
   	  		t["id"]=host.id
   	  		t["info"]=host.head+' '+host.host+":"+host.port
   	  		t["status"]=host.status
   	  		list[i]=t
   	  	}
   	  	return list
   	  
   	  }


    async getHostList(msg,next)
    {
        let sendData={}
        sendData.data = await HostModel.find(msg.queryObj).sort({
            status: -1
        }).skip(Number(msg.pageSize) * (Number(msg.current) - 1)).limit(Number(msg.pageSize));
        sendData.totalItems = await HostModel.count(msg.queryObj);
        next(sendData)
    }

    async AddHost(msg,next)
    {
         const newObj = new HostModel(msg.newData);
         const data = await newObj.save();
         next(data)
    }

    async AddOrUpdateHost(msg,data,next)
    {
      console.log(msg.info)
       console.log(msg.info.length)
         console.log(msg.info[0])
         console.log("????????")
      for (var i = 0; i < msg.info.length; i++) {
                console.log(msg.info[i])

          let c= await HostModel.count({host:msg.info[i].host})
          if(c>0)
          {
              console.log(msg.info[i].host)
              await HostModel.findOneAndUpdate({host:msg.info[i].host},{$set:{port:msg.info[i].port}})
              console.log("Update Seccess")
          }else{
              console.log(msg.info[i])
              const newObj = new HostModel({host:msg.info[i].host,port:msg.info[i].port,type:0,head:"https",status:0,name:msg.info[i].name});
              const data1 = await newObj.save();
              console.log("Add Seccess")
          }
      }
      next({code:1})
    }

    async UpdateHost(msg,next)
    {
        const data = await HostModel.findOneAndUpdate({id:msg.id},{$set:msg.set})
        next(data)

    }

    async deleteHost(msg,next)
    {
        const data=  await HostModel.remove({
                id: msg.id
            });
        next(data)
    }


}

module.exports = new Host();