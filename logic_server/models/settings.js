/**
 * Created by Administrator on 2015/4/15.
 * 会员对象
 */
var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;



var SettingsSchema = new Schema({
    id: {
        type: String,
        'default': shortid.generate
    },
    maxHoustCount: Number,
    enable: { type: Boolean, default: true },
});

var Settings = mongoose.model("Settings", SettingsSchema);

module.exports = Settings;

