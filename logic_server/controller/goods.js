const GoodsModel = require("../models").Goods

class Goods {
    constructor() {
        // super()
    }


   	async getGoodsList(msg,next)
    {
        let sendData={}
        sendData.data = await GoodsModel.find(msg.queryObj).sort({
            price: -1
        }).skip(Number(msg.pageSize) * (Number(msg.current) - 1)).limit(Number(msg.pageSize));
        sendData.totalItems = await GoodsModel.count(msg.queryObj);
        next(sendData)
   	}

    async AddGoods(msg,next)
    {
         const newObj = new GoodsModel(msg.newData);
         const data = await newObj.save();
         next(data)
    }

    async UpdateGoods(msg,next)
    {
        const data = await GoodsModel.findOneAndUpdate({id:msg.id},{$set:msg.set})
        next(data)

    }

    async deleteGoods(msg,next)
    {
        const data=  await GoodsModel.remove({
                id: msg.id
            });
        next(data)
    }


  async getGoodsAll(msg,data,next)
  {

        let goods = await GoodsModel.find().sort({
                price: -1
          })

        data.data["goods"]=goods
                console.log("getGoodsAll goods:",goods)
        data.status=200;
        next(data)
      
  }

}

module.exports = new Goods();