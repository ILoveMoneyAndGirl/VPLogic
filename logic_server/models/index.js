const mongoose = require('mongoose');
const setting = require('../config/setting');
var url='mongodb://' + setting.dbUserName + ':' + setting.dbPassword + '@' + setting.dbIp + ':' + setting.dbPort + '/' + setting.dbName + ''
mongoose.connect(url, { useMongoClient: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.once('open', () => {
    console.log('connect mongodb success')
})

db.on('error', function (error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});

db.on('close', function () {
    console.log('数据库断开，重新连接数据库');
});



exports.User = require('./user');
exports.Host = require('./host');
exports.Settings = require('./settings');
exports.URLList = require('./urllist');
exports.Notices = require('./notices');
exports.Goods = require('./goods');


