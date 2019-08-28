
var http = require('http');
var querystring = require('querystring');
var request = require('request')
var crypto = require('crypto')

PostData({
    appId:"xxxx",
    targePrice:0,
    transactionId:"sdsdsdsd",
    data:"得到的",
    time:"xxxx",
    signature:"MD5",
    callBack:"",
    channel:"",
},"127.0.0.1",3000,"/order")

function PostData (data,host,port,path){


	console.log("PostData",data)

	var content = querystring.stringify(data);

	var options = {
	  hostname: host,
	  port: port,
	  path: path,
	  method: 'POST',
	};

	var req = http.request(options, function (res) {
		if(res.statusCode==200){
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
		    		console.log('BODY: ' + chunk);
		    });
		}else{
			console.log("服务器请求错误",res.statusCode)
		}

	});
	req.on('error', function (e) {
		console.log("PostData->req.on->error",e.message)
	});
	req.write(content);
	req.end();
}
