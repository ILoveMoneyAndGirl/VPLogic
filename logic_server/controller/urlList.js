const URLListModel = require("../models").URLList

async  function _getURLByUser(name){

      let urls=await URLListModel.find({userName:name})

      let t={}
      for (var i = 0; i < urls.length; i++) {
        t[urls[i].id]=urls[i].url
      }

      return t
}

class URLList {
    constructor() {
        // super()
    }
   async  getURLByUser(name){
      _getURLByUser(name)
   }


  async  deleteURL(msg,data,next){
      await URLListModel.remove({id:msg.serialId})
      data.data.serialId=msg.serialId

      data.data.urlList= _getURLByUser(msg.lastUser)
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

                    console.log(msg)


      let urls=msg.urls.split(',')

      for (var i = 0; i < urls.length; i++) {
          const url =  new URLListModel({userName:msg.lastUser,url:urls[i]})
          await url.save();
      }

      data.data.urlList=_getURLByUser(msg.lastUser)
      data.data.tabId=msg.tabId;
      data.status=200;
      next(data)
  }

  async  addURL(msg,data,next){
      
      const url =  new URLListModel ({userName:msg.lastUser,url:msg.url})
      await url.save();
      data.data.url=d.url;
      data.data.serialId=msg.serialId
      data.status=200;
      next(data)
   }

}

module.exports = new URLList();