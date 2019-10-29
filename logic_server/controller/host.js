const HostModel = require("../models").Host
const UserModel = require("../models").User
const SettingsModel = require("../models").Settings

const config = require('../config/config');


const Common=require('../common.js')

const Tip =  require("../config/tip");


class Host {
    constructor() {
        // super()
    }


   	async GetHost()
   	  {
   	  	let hostList=await HostModel.find({status:0}).sort({
            type: 1
        })
   	  	let list=[]

   	  	let count=config.maxHostCount<hostList.length?config.maxHostCount:hostList.length

   	  	for (var i = 0; i < count; i++) {
   	  		let t={}
        //   let index=Common.GetRandomNum(0,hostList.length-1)
   	  		// let host=hostList[index]
         let  host=hostList[i]
          // hostList.splice(index,1)
   	  		t["address"]=host.name
   	  		t["id"]=host.id
   	  		t["info"]=host.head+' '+host.host+":"+host.port
   	  		t["status"]=host.status
   	  		list[i]=t
   	  	}

        let lastList=[]

        for (var i = 0; i < list.length; i++) {
          lastList[i]={}
          lastList[i]["address"]=list[i]["address"]
          lastList[i]["id"]=list[i]["id"]
          lastList[i]["status"]=list[i]["status"]
          lastList[i]["info"]=list[i]["info"]
            for (var j = 0; j < list.length; j++) {
                if(j==i)
                    continue
                lastList[i]["info"]=lastList[i]["info"]+";"+list[j]["info"]
            }
        }
   	  	return lastList
   	  
   	  }


    async getHostList(msg,next)
    {
        let sendData={}
        sendData.data = await HostModel.find(msg.queryObj).sort({
            status: 1
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

        let info=JSON.parse(msg.info)


      for (var i = 0; i < info.length; i++) {
           console.log(info[i])

          let c= await HostModel.count({host:info[i].host})
          if(c>0)
          {
              console.log(info[i].host)
              await HostModel.findOneAndUpdate({host:info[i].host},{$set:{port:info[i].port}})
              console.log("Update Seccess")
          }else{
              console.log(info[i])
              const newObj = new HostModel({host:info[i].host,port:info[i].port,type:0,head:"https",status:0,name:info[i].name});
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