const URLListModel = require("../models").URLList
let config = require('../config/config');

async  function _getURLByUser(name){

      let urls=await URLListModel.find({userName:name})

      let t={}
      for (var i = 0; i < urls.length; i++) {
        t[urls[i].id]=urls[i].url
      }

console.log(config.commonUser)
  console.log(name)

      if(config.commonUser!=name)
      {
        console.log(")))))))))))))")
          let u1= await URLListModel.find({userName:config.commonUser})
          console.log(u1)
          for (var i = 0; i < u1.length; i++) {
            console.log(u1[i].id)
                        console.log(u1[i].url)

            t[u1[i].id]=u1[i].url
          }
      }

              console.log("XXXXXXXX_____getURLByUser>")

              console.log(t)
      return t
}

class URLList {
    constructor() {
        // super()
    }
   async  getURLByUser(name){

      let t= await _getURLByUser(name)
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