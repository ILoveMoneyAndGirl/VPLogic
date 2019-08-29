
var http = require('http');
var url=require('url');    //URL解析模块
var ws = require("nodejs-websocket");
var logic=require('./logic.js');
var setting=require("./config/setting.js");

let path = require('path');
//导入querystring模块（解析post请求数据）
let querystring = require('querystring');

try{
  http.createServer(function (request, response) {

      if (request.url === '/payback' && request.method === 'POST') {//下单
        
        let dataBuffer = '';
        request.on('data', function (chunk) {
            // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
            dataBuffer += chunk;
        });
        request.on('end', async function () {
            dataBuffer = decodeURI(dataBuffer)
            let msg = querystring.parse(dataBuffer);
            logic.PayBack(msg,function(data){
                res.end(JSON.stringify(data))
            })
        });
      }else if(request.url === '/setting' && request.method === 'POST') {// 系统设置

        let dataBuffer = '';
        request.on('data', function (chunk) {
            // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
            dataBuffer += chunk;
        });

        request.on('end', async function () {
            dataBuffer = decodeURI(dataBuffer)
            let msg = querystring.parse(dataBuffer);
            logic.Setting(msg,function(data){
                res.end(JSON.stringify(data))
            })
        });

      }else if(url.parse(request.url).pathname!='/favicon.ico'){ //客户端通信
         var arg=url.parse(request.url.replace(/amp;/g ,""),true).query;
         try{
              logic.LogicDel(arg,function(data){
                if(data){
                  console.log("HTTP SEND:",data);
                  response.end(JSON.stringify(data)) 
                 }
              });
            }catch(exception) {
              response.end("server error..") ;
    	        console.log("error....");
    	        console.log(exception);
            }
   }
}).listen(setting.webPort);
}catch(e){
   console.log(e);
}
// 终端打印如下信息
console.log('HttpServer running at '+setting.webIp+" "+setting.webPort);

var server = ws.createServer(function(conn){
    conn.on("text", function (str) {
    	 try{
         logic.LogicDel(JSON.parse(str),function(data){
            if(data){
                console.log("WS SEND:",data);
                conn.sendText(JSON.stringify(data))
             }
         })
    	}catch(e){
    	   console.log("ws error...");
    	   console.log(e);
    	}
    });
    conn.on("close", function (code, reason) {
      //  console.log(code);
       // console.log(reason)
      //  console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
//        console.log(code);
  //      console.log(reason)
    //    console.log("异常关闭")
    });
}).listen(setting.socketPort)

console.log('socketSever running at '+setting.socketIp+" "+setting.socketPort);

