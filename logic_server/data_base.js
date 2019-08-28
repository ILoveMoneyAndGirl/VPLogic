var mysql = require('mysql');
var C=require("./const")
var conn = mysql.createConnection({
    host: C.DataBaseIp(),
    user: C.DataBaseUserName(),
    password: C.DataBasePassword(),
    port: C.DataBaseProt()
});
conn.connect();

var dropDataBase='drop database '+C.DataName();
var createDataBase='create database '+C.DataName();
var useDataBase='use '+C.DataName();
console.log("use database.........");
conn.query(useDataBase,function(err,res){
	if(err){
		console.log("use database error ...!");
		console.log(err);
	}
});
// SQL("zz",function(err,res){
// 	console.log("dddddddddd");
// })

// var modeSql='select * from user';
// var paramsSql=['l','www.lg.com'];
// conn.query(modeSql,paramsSql,function (err, res,fields) {
// 		console.log("err........");
// 		console.log(err);
// 		if(err){
// 			// callback(err,res);
// 		}
// 		// else{
// 		// 	var r=[];
// 		// 	for(var i=0; i<res.length; i++){
// 		// 		var t={};
// 		// 		t["address"]=res[i].name;
// 		// 		t["id"]=res[i].id.toString();
// 		// 		t["info"]=res[i].type+' '+res[i].ip+':'+res[i].prot;
// 		// 		t["status"]=0;
// 		// 		r[i]=t;
// 		// 	} 
// 		// 	console.log("r........");
// 		// 	console.log(r);
// 		// }
// 		// if(res[0].cookie==null){
// 		// 	console.log("res[0].cookie==null");
// 		// }
// 		console.log("res........length");
// 		// console.log(res.length)
// 		console.log("res........res[0]");
// 		// console.log(res[0])
// 		console.log("res........res[0].username");
// 		// console.log(res[0].username)
// 		console.log("res........");
// 		console.log(res);
// 		console.log("fields........");
// 		// console.log(fields);
// 	});


var user='create table user (id INT(11) AUTO_INCREMENT,'+
	'username VARCHAR(40),'+
	'password VARCHAR(40),'+
	'cookie VARCHAR(30),'+
	'invationcode VARCHAR(30),'+
	'registercode VARCHAR(30),'+
	'isuse bit default 0,'+
	'PRIMARY KEY (id))';


var proxy='create table proxy (id INT(11) AUTO_INCREMENT,'+
	'name VARCHAR(20),'+
	'type VARCHAR(20),'+
	'ip VARCHAR(20),'+
	'prot VARCHAR(10),'+
	'PRIMARY KEY (id))';



var proxySetting='create table proxySetting (id INT(11) AUTO_INCREMENT,'+
	'username INT(11),'+
	'proxyid INT(11),'+
	'PRIMARY KEY (id))';



var urllist='create table urllist (id INT(11) AUTO_INCREMENT,'+
	'username INT(11),'+
	'url VARCHAR(255),'+
	'PRIMARY KEY (id))';

var sql = {
    // "dropDataBase"     : dropDataBase,
    // "createDataBase"      : createDataBase,
    "useDataBase"  : useDataBase,
    // "user"  : user,
    // "proxy"  : proxy,
    // "urllist"  : urllist,
    // "proxySetting"  : proxySetting
};

// for(var key in sql) {
//     // 使用数据库
//     console.log(key+'...');
// 	conn.query(sql[key], function (err, res,fields) {
// 	 	if (err) {
// 	 		console.log(err);
// 	 		process.exit(0);	
//     		throw err;
// 	  	}
// 	  	console.log(res);
// 	  	if (fields) {
// 	  		console.log(fields);
// 	  	};
	  	
// 	});
// }
// function SQL(sql,callback){
// 	console.log(callback);
// 	callback();
// }
exports.SQL=function (sql,params,callback)
{
	conn.query(sql,params,callback);
	// console.log(callback);
	// callback();
}

// conn.end();