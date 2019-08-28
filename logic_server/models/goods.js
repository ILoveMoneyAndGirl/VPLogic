var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;



var GoodsSchema = new Schema({
    id: {
        type: String,
        'default': shortid.generate
    },
    price: String,
    days: Number,
    des: String
});

var Goods = mongoose.model("Goods", GoodsSchema);

module.exports = Goods;