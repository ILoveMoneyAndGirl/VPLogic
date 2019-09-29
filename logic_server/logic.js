//返回值 逻辑处理

var config = require('./config/config');
var settings = require('./config/setting');

var common=require('./common.js')
var crypto = require('crypto');

let http = require('http');
let https = require('https');
let url=require('url');


var responseData={"callback":"","data":"","disptch":true,"msg":"","status":500};
var RD_data={"comment":null,"comments":[],"cookie":"","homePage":config.homePage,"invationCode":"","invationLink":config.invationLink,"key":"","msg":"","notices":[],"praiceLink":config.praiceLink,"prxList":[],"serialId":"","tabId":"","url":"","urlList":null,"userEmail":"","versionStatus":0};


const notifyUrl="http://"+config.netIP+":"+settings.webPort+"/payback"
// function pingServer
// function register 
// function checkRegister
// function login(
// function resetPassword
// function findPassword
// //--------------WebSocket-----------------
// function checkLogin
// function fetchPac

// function loadPxyList

// function deleteURL

// function addURL
// function addURLs

// function updateURL

// function fetchDomains

function payOrder(data,callBack)
{
  let serverInfo =url.parse(config.payUrl)
    let port=80
    let protocol=http
    if(serverInfo.port)
        port=serverInfo.port
    if(serverInfo.protocol=='https:'){
        protocol=https
    }
    PostData(data,serverInfo.hostname,port,serverInfo.path,protocol,callBack)
}
function PostData (data,host,port,path,protocol,callBack){

  var content =JSON.stringify(data);

  var options = {
    hostname: host,
    port: port,
    path: path,
    method: 'POST',
    headers: {
       'Content-Type': 'application/json;charset=utf8',
    
     }
  };
	var req = protocol.request(options, function (res) {
		if(res.statusCode==200){
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				console.log("RECV:")
				console.log(chunk)
		   		callBack(null,JSON.parse(chunk))
		    });
		}else{
			callBack(res.statusCode)
		}

	});
  // var req = protocol.request(options);
  req.on('error', function (e) {
    callBack(e)
  });
  req.setTimeout(10000, function(){
     this.abort()
  })

  req.write(content);
  req.end();
}

const { User,Host,URLList,Notice,Goods,Setting} = require('./controller');

const userModel = require('./models').User;
const goodsModel = require('./models').Goods;


const typeCheck  = require('./tool/typeCheck');

const setting = require('./config/setting');
const Tip =  require("./config/tip");


var EventEmitter = require('events').EventEmitter; 
var event = new EventEmitter(); 


event.on('pingServer',User.isLogin); 
event.on('register',User.register); 
event.on('checkRegister',User.checkRegister); 
event.on('resetPassword',User.resetPassword);
event.on('findPassword',User.findPassword);
event.on('getUserInfo',User.getUserInfo);

event.on('login',User.login); 
//--------------WebSocket-----------------
event.on('loadGoods',Goods.getGoodsAll); 
event.on('checkLogin',User.checkLogin); 
event.on('addTime',User.addTime); 
event.on('userInfo',User.userInfo); 
event.on('getInfo',function(msg,data,next){
   var host=["logic.liguaika.xyz:8888","logic.liguaika.xyz:9999"]
   next(host)
}); 

event.on('aboutUS',function(msg,data,next){
	data.status=200;
	data.data['homePage']=config.homePage;
    data.data['helpQQ']=config.helpQQ;
    data.data['helpEmail']=config.helpEmail;
    data.data['chromeLink']=config.chromeLink;
   next(data)
}); 

event.on('getSS',function(msg,data,next){
	
	let ss=[{ip:"139.162.229.240",port:"50013",password:"1234567890",type:"aes-256-cfb",name:"日本",id:"01"},{ip:"139.162.229.240",port:"50013",password:"1234567890",type:"aes-256-cfb",name:"美国",id:"02"},{ip:"139.162.229.240",port:"50013",password:"1234567890",type:"aes-256-cfb",name:"台湾",id:"03"}]
	data.status=200;
	data.data=ss
   	next(data)
}); 



event.on('getServer',function(msg,data,next){
   var host={ip:config.netIP,port:settings.webPort}
   next(host)
}); 

event.on('setting',function(msg,data,next){
	setting.maxHostCount=20
	next([data])
}); 

var responseForm={"callback":"","data":"","disptch":true,"msg":"","status":500};
var subData={"comment":null,"comments":[],"cookie":"","homePage":setting.homePage,"invationCode":"","invationLink":"","key":"","msg":"","notices":[],"praiceLink":setting.praiceLink,"prxList":[],"serialId":"","tabId":"","url":"","urlList":null,"userEmail":"","versionStatus":0};

// var responseBackForm={"callback":"","data":"","disptch":true,"msg":"","status":500};

event.on('fetchPac',async function(msg,data,next){

	let user=await User.getUserByCookie(msg.cookie)
	let now= new Date()
	if(user){
		if(user.deadLine<now)
			data.data.notices[0]={title:Tip.TimeOut,content:Tip.TimeOutTip}
		else{
			
			let list= await Host.GetHost()
			let url=await URLList.getURLByUser(user.userName)
			data.data.prxList=list
			data.data.urlList=url
			data.data.lastUser=user.userName
			data.data.notices[0]=await Notice.getOneNotice()
		}
		data.status=200;
	}

	next(data)

}); 



event.on('loadPxyList',async function(msg,data,next){

	let user=await User.getUserByCookie(msg.cookie)
	let now= new Date()
	if(user){
		if(user.deadLine<now)
			data.data.notices[0]={title:Tip.TimeOut,content:Tip.TimeOutTip}
		else{
		
			let list= await Host.GetHost()
			console.log(list)
			data.data.prxList=list
			data.data.lastUser=user.userName
			data.data.notices[0]=await Notice.getOneNotice()
		}
	 data.status=200;
	}

	 next(data)

}); 

event.on('fetchDomains',async function(msg,data,next){

	let url=await URLList.getURLByUser(msg.lastUser)
	data.data.urlList=url
	data.status=200;
	next(data)
});


// var RequestOrder={
//     appId:"xxxx",
//     orderId:"sdsdsdsd",
//     uId:"",
//     price:0,
//     notifyUrl:"",
//     goodsName:"",
//     channel:"",
//     key:"MD5",
// }

//发起订单
function getRequestKey(msg,token){
    let md5 = crypto.createHash('md5');
    let str=msg.appId+msg.orderId+msg.uId+msg.price+msg.notifyUrl+msg.goodsName+msg.channel+token
    return md5.update(str).digest('hex');
}

event.on('loadQRcode',async function(msg,data,next){	
	  const u=await userModel.findOne({cookie:msg.cookie});
	  const g=await goodsModel.findOne({id:msg.id});
	  if(u&&g){
	  	let sendData={
	  		appId:config.appID,
	  		orderId:common.Getuuid(),
	  		uId:u.id,
	  		price:g.price,
	  		goodsName:g.id,
	  		channel:msg.channel,
	  		notifyUrl:notifyUrl,
	  	}
	  	sendData.key=getRequestKey(sendData,config.payToken)
	  	payOrder(sendData,function(err,qr)
	  	{	
	  		if(err)
	  		{
	  			next(data)
	  		}else{
	  			data.data["qrcode"]=qr.qrCode
				data.data["realPrice"]=qr.realPrice
				data.data["orderId"]=qr.id
				data.data["isAny"]=qr.isAny
				data.data["price"]=qr.price
				data.data["error"]=qr.error
				data.data["msg"]=qr.msg
				data.data["timeOut"]=qr.timeOut

				data.status=200;
				next(data)
	  		}


	  	})
	  }else
	  {
	  	next(data)
	  }

});


// event.on('loadPxyList',Host.loadPxyList(data,response)); 
// event.on('fetchDomains',Host.fetchDomains(data,response)); 
// event.on('updatePxy',Host.updatePxy(data,response)); 


event.on('deleteURL',URLList.deleteURL); 
event.on('addURL',URLList.addURL); 
event.on('addURLs',URLList.addURLs); 
event.on('updateURL',URLList.updateURL); 


// event.on('loadNotice',Notice.loadNotice(data,response)); 

//--------------WebSocket-----------------


//--------------Manager-----------------









exports.LogicDel=function (msg,next)
{	
	console.log("Recive MSG:",msg)


	// if(typeCheck.isUndefined(msg.back))
	// {
	// 	console.log("ACTION:",msg.action)
	// 	event.emit(msg.action,msg,null,next)
	// }else
	// {

		var data=JSON.parse(JSON.stringify(responseForm));
		var content=JSON.parse(JSON.stringify(subData));
		data.data=content

		if(!typeCheck.isUndefined(msg.disptch))
		{
			data.disptch=msg.disptch; 
		}

		if(!typeCheck.isUndefined(msg.callback))
		{
			data.callback=msg.callback;
		}


		console.log("ACTION22:",msg.action)
		event.emit(msg.action,msg,data,next)

	// }


}

event.on('GetUser',User.getUserList); 

event.on('deleteUser',function()
{
	console.log("deleteUsers")
	// User.deleteUsers
}); 


event.on('GetGoods',Goods.getGoodsList); 
event.on('AddGoods',Goods.AddGoods); 
event.on('UpdateGoods',Goods.UpdateGoods); 
event.on('deleteGoods',Goods.deleteGoods); 

event.on('GetHost',Host.getHostList); 
event.on('AddHost',Host.AddHost); 
event.on('UpdateHost',Host.UpdateHost); 
event.on('deleteHost',Host.deleteHost); 


event.on('getSysArg',Setting.get); 
event.on('setSysArg',Setting.set); 
event.on('addUserTime',User.addTime); 
// event.on('config',function(msg,next){
// 	config=msg.config
// 	next({code:0})
// }); 




exports.Setting=function (msg,next){
		console.log("Setting")

	console.log("ACTION1-------:",msg.action)
	console.log(msg)
	event.emit(msg.action,msg,next)
}

exports.PayBack=async function (msg,next)
{	

	// var notifyMsg={
//     id:"",
//     orderId:0,
//     uId:"",
//     goodsName:"",
//     income:"",
//     takeOff:"",
//     code:0,
 //    channel,
//     key,
// }
	if(msg.income>0)
	{
		const u=await userModel.findOne({id:msg.uId});
	  	const g=await goodsModel.findOne({id:msg.goodsName});
	  	let newDeadLine=new Date()
	  	if((u.deadLine- newDeadLine)>0)
	  		newDeadLine=u.deadLine
	  	newDeadLine.setDate(newDeadLine.getDate()+g.days);
	  	await userModel.findOneAndUpdate({id:msg.uId},{$set:{deadLine:newDeadLine}})
	}


	next({code:0})

}




