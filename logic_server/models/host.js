var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;



var HostSchema = new Schema({
    id: {
        type: String,
        'default': shortid.generate
    },
    host: String,
    port: String,
    type: Number,
    enable: { type: Boolean, default: true },
    head: { type: String, default: "https" },
    name:String,
    status:{ type: Number, default: 0 },

});

var Host = mongoose.model("Host", HostSchema);

module.exports = Host;