/**
 * Created by Administrator on 2015/4/15.
 * 会员对象
 */
var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;



var UserSchema = new Schema({
    id: {
        type: String,
        'default': shortid.generate
    },
    userName: String,
    password: String,
    type: Number,
    cookie: String,
    bornDate: { type: Date, default: Date.now },
    deadLine: { type: Date, default: Date.now },
    enable: { type: Boolean, default: true },
    ip: String,
});

var User = mongoose.model("HUser", UserSchema);

module.exports = User;

