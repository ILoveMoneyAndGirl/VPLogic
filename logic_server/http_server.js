var http = require('http');
var url=require('url');    //URL解析模块
var logic=require('./logic.js')

http.createServer(function (request, response) {

	// 发送 HTTP 头部 
	// HTTP 状态值: 200 : OK
	// 内容类型: text/plain
	// response.writeHead(200, {'Content-Type': 'x-application/json' });
	// console.log(request.url);
	// console.log(url.parse(request.url));


        // var pathname = url.parse(request.url).pathname;  //pathname => select  
        // console.log(pathname)
          
        // var arg = url.parse(request.url).query;          //arg => name=a&id=5  
        // console.log("Request for  agr..." ); 
        // console.log(arg); 
        // // var str = querystring.parse(arg);                //str=> {name:'a',id:'5'}  
          
        // var arg1 = url.parse(request.url, true).query;   //arg1 => {name:'a',id:'5'}  
        // console.log("Request for  arg1");
        //     console.log(arg1);   
          
        // var name = querystring.parse(arg).name;         //name => a  
        // console.log("name = "+name); 

   //      var arg = url.parse(request.url, true).query;   //arg1 => {name:'a',id:'5'}  
    
   //      // console.log("Request for " + arg.action );  
          
   //      // var name = querystring.parse(arg).name;         //name => a  
   //      // console.log("name = "+name);  
   // var data=logic.LogicDel(arg)
   // console.log('Shttp.createServer');
   //  console.log(arg.action);
//    JSON.parse(string)将字符串转为JSON格式

// JSON.stringify(obj)将JSON转为字符串。

   if(url.parse(request.url).pathname!='/favicon.ico')
   {
   	 var arg=url.parse(request.url,true).query;
   	 var data=logic.LogicDel(arg)
   	 response.end(JSON.stringify(data));
   }
    
	
}).listen(8888);

// 终端打印如下信息
console.log('HttpServer running at http://127.0.0.1:8888/');