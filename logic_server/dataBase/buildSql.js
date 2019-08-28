const setting = require("../config/setting");
// const logUtil = require('../../../utils/middleware/logUtil.js');

let mysql = require('mysql');


/*exports.Back_SQL=function (sql,params,callback)
{
	back_pool.getConnection(function(err,conn){
		if(err){
			callback(err,null,null)
		}else{
			conn.query(sql,params,function(err,results,fields){  
                //释放连接  
                conn.release();  
                //事件驱动回调  
                callback(err,results,fields);  
            });  
		}
	});

}*/

exports.BuildSql=function (sql,params,callback)
{
    // logUtil.console("buildSql->BuildSql->sql",sql)
 	build_pool.getConnection(function(err,conn){
		if(err){
			callback(err,null,null)
		}else{
			conn.query(sql,params,function(err,results,fields){  
                //释放连接  
                conn.release();  
                //事件驱动回调  
                if(results)
                {
                    results=JSON.stringify(results)
                    results=JSON.parse(results)
                }
                callback(err,results,fields);  
            });  
		}
	});

}

/*var back_pool = mysql.createPool({
    host: CONST.BackDataBaseIp(),
    user: CONST.BackDataBaseUserName(),
    password: CONST.BackDataBasePassword(),
    port: CONST.BackDataBaseProt(),
    database:CONST.BackDataName()
});*/


let build_pool = mysql.createPool({
    host: setting.dbIp,
    user: setting.dbUserName,
    password: setting.dbPassword,
    port: setting.dbPort,
    database:setting.dbName,
    bigNumberStrings:true,
    supportBigNumbers:true
});


