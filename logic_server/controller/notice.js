
const NoticesModel = require("../models").Notices

class Notice {

    constructor() {
        // super()
    }

    async LoadTip(msg,data,next)
    {

        let tip = await NoticesModel.find()
        data.data["tip"]=tip
        data.status=200;
        next(data)
      
  }

    async  getOneNotice(name){

   		return await NoticesModel.findOne({enable:true})
     }

     async getNoticeList(msg,next)
    {
        let sendData={}
        sendData.data = await NoticesModel.find(msg.queryObj).skip(Number(msg.pageSize) * (Number(msg.current) - 1)).limit(Number(msg.pageSize));
        sendData.totalItems = await NoticesModel.count(msg.queryObj);
        next(sendData)
   	}

    async AddNotice(msg,next)
    {
         const newObj = new NoticesModel(msg.newData);
         const data = await newObj.save();
         next(data)
    }

    async UpdateNotice(msg,next)
    {
        const data = await NoticesModel.findOneAndUpdate({id:msg.id},{$set:msg.set})
        next(data)
    }

    async deleteNotice(msg,next)
    {
        const data=  await NoticesModel.remove({
                id: msg.id
            });
        next(data)
    }

}

module.exports = new Notice();
