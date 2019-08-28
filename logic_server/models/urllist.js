var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;



var URLListSchema = new Schema({
    id: {
        type: String,
        'default': shortid.generate
    },
    url: String,
    userName: String,
});

var URLList = mongoose.model("urllist", URLListSchema);

module.exports = URLList;