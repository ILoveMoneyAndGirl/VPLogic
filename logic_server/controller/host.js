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


    async AddHost(){

    }

    async UpdateHost(){

    }

    async deleteHost(){

    }


}

module.exports = new Host();