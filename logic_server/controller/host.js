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
   	  		let host=hostList[Common.GetRandomNum(0,hostList.length-1)]

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