const URLListModel = require("../models").URLList
let config = require('../config/config');

async  function _getURLByUser(name){

      let urls=await URLListModel.find({userName:name})

      let t={}
      for (var i = 0; i < urls.length; i++) {
        t[urls[i].id]=urls[i].url
      }

      let u1= await URLListModel.find(config.commonUser)
      for (var i = 0; i < u1.length; i++) {
        t[u1[i].id]=u1[i].url
      }

      return t
}

class URLList {
    constructor() {
        // super()
    }
   async  getURLByUser(name){

       console.log("------------------vvvv------->>>>>>>")

      let t= await _getURLByUser(name)
      console.log(":::::::::::---<t",t)
      console.log(t)
      return t
   }


  async  deleteURL(msg,data,next){
      await URLListModel.remove({id:msg.serialId})
      data.data.serialId=msg.serialId

      data.data.urlList= await _getURLByUser(msg.lastUser)
      data.status=200;
      next(data)
   }

  async  updateURL(msg,data,next){
      await URLListModel.findOneAndUpdate({id:msg.serialId},{$set:{url:msg.url}})
      data.data.serialId=msg.serialId
      data.data.url=msg.url
      data.status=200;
      next(data)
   }

  async  addURLs(msg,data,next){


      let urls=msg.urls.split(',')

      for (var i = 0; i < urls.length; i++) {
          const url =  new URLListModel({userName:msg.lastUser,url:urls[i]})
          await url.save();
      }

      data.data.urlList=await _getURLByUser(msg.lastUser)
      data.data.tabId=msg.tabId;
      data.status=200;
      next(data)
  }

  async  addURL(msg,data,next){
      
      const url =  new URLListModel ({userName:msg.lastUser,url:msg.url})
      await url.save();
      data.data.url=msg.url;
      data.data.serialId=msg.serialId
      data.status=200;
      next(data)
   }

}

module.exports = new URLList();