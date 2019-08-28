var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;



var NoticesSchema = new Schema({
    id: {
        type: String,
        'default': shortid.generate
    },
    title: String,
    content: String,
    enable: { type: Boolean, default: true },
});

var NoticesSchema = mongoose.model("notices", NoticesSchema);

module.exports = NoticesSchema;