//返回值 逻辑处理

var config = require('../config/config');
var common=require('./common.js')
var crypto = require('crypto');
var C=require("./const")
var data_del=require('./data_del.js')

var responseData={"callback":"","data":"","disptch":true,"msg":"","status":500};
var RD_data={"comment":null,"comments":[],"cookie":"","homePage":C.homePage(),"invationCode":"","invationLink":C.invationLink(),"key":"","msg":"","notices":[],"praiceLink":C.praiceLink(),"prxList":[],"serialId":"","tabId":"","url":"","urlList":null,"userEmail":"","versionStatus":0};


function pingServer(d,response,callback){

	var _data= JSON.parse(JSON.stringify(RD_data));
	_data.userEmail=d.lastUser;

	var data=JSON.parse(JSON.stringify(responseData));

	if(d.hasOwnProperty("disptch")){
    	data.disptch=d.disptch;
  	}
  	
	data.data=_data;
	data.cookie=d.cookie;
	data_del.isLogin(d.lastUser,d.cookie,function(err,res){
		
		if(err){
			callback(data,response);
		}
		else if(res.length>0){
			data.status=200;
			_data.invationCode=res[0].invationCode;
			callback(data,response);
		}else{
			callback(data,response);
		}
	});
}


function register (d,response,callback) {

	var data=JSON.parse(JSON.stringify(responseData));

	if(d.hasOwnProperty("disptch")){
    	data.disptch=d.disptch;
  	}

	if(d.password==d.rePassword)
	{

		data_del.emallIsExist(d.userEmail,function(err,res){

			if(err){

				data.data=false
			  	data.msg="邮箱查询错误";
			 	data.status=500;
			 	callback(data,response);
			}
			else if(res.length>0){
				data.data=false;
				data.msg="邮箱已注册";
			 	data.status=500;
			 	callback(data,response)

			}
			else {
				data_del.sendVerificationCodeToEmall(d.userEmail,d.password,d.invitationEmail,"sayHello",function(err,info){
					if(err){
						data.data=false;
						data.msg="注册异常! 有可能是邮件发送失败，请检查邮箱地址！"
						data.status=500;
						callback(data,response);
					}
					else{
						data.data=true
						data.msg="注册成功，已发送注册验证至"+ d.userEmail+",登录邮箱完成注册!"
						data.status=200;
						callback(data,response);
					}

				});
			}

		});

	}
	else
	{
		data.data=false;
		data.msg="两次密码不一致!"
		data.status=500;
		callback(data,response)
	}

}

function checkRegister(d,response,callback){
	var data=JSON.parse(JSON.stringify(responseData));
	if(d.hasOwnProperty("disptch")){
    	data.disptch=d.disptch;
  	}
	data_del.emallIsExist(d.userEmail,function(err,res){
		if(err){
			data.data=true
		  	data.msg="邮箱查询错误";
		 	data.status=500;
		}
		else if(res.length>0){
			data.data=true;
			data.msg="邮箱已注册";
		 	data.status=500;
		}

		else {
			data.data=false
			data.status=200;
		}
		callback(data,response);
	});
}
function login(d,response,callback){
	var data=JSON.parse(JSON.stringify(responseData));
	if(d.hasOwnProperty("disptch")){
    	data.disptch=d.disptch;
  	}
	data_del.verifyUserNameAndPassword(d.userEmail,d.password,function(err,res,filed){
		if(err){
			data.data= false;
			data.status=500;
			data.msg="数据查询异常！"
			callback(data,response);
		}else if (res.length!=1){
			data.data= false;
			data.status=0;
			data.msg="账号或者密码错误！"
			callback(data,response);
		}
		else{
			var _data=JSON.parse(JSON.stringify(RD_data));
	  		data_del.updateCookie(d.userEmail,function(err,res){
	  			if(err){
	  				data.data= false;
					data.status=500;
					data.msg="数据生成异常！"
	  			}else{
	  				_data.cookie=res
	  				_data.userEmail=d.userEmail;
	  				data.data=_data;
	  				data.status=200;
	  				data_del.getInvationCode(d.userEmail,function(err,res){
	  				_data.invationCode=res
					if(err){
							_data.invationCode="NULL"
					}
					data_del.getKey(d.userEmail,function(err,res){
						_data.key=res

						callback(data,response);
					});
	  				});
	  			}
	  		})

		}
	});
}


function resetPassword(d,response,callback)
{
	var data=JSON.parse(JSON.stringify(responseData));
	if(d.hasOwnProperty("disptch")){
    	data.disptch=d.disptch;
  	}
	data.data=null;
	if(d.newPwd1==d.newPwd2){
		data_del.resetPassword(d.lastUser,d.oldPwd,d.newPwd2,function(err,res){
			if(err){
				data.msg="密码修改失败!";
				data.status=500
				callback(data,response);
			}
			else{
				data.msg="密码修改成功!";
				data.status=200;
				callback(data,response)

			}
		});
	}
	else{
		data.msg="两次密码输入不一致!";
		data.status=500;
		callback(data,response)

	}
}
function findPassword(d,response,callback)
{
	var data=JSON.parse(JSON.stringify(responseData));
	if(d.hasOwnProperty("disptch")){
    	data.disptch=d.disptch;
  	}
	data_del.emallIsExist(d.userEmail,function(err,res){
		if(err){
			data.msg="邮箱查询错误!";
			data.status=500;
			callback(data,response);

		}else if(res.length<1){
			data.msg="邮箱不存在!";
			data.status=500;
			callback(data,response)

		}else{
			var newPassWord=common.GetRandomNum(100000,999999);
			var md5 = crypto.createHash('md5');
			md5.update(newPassWord.toString());
			data_del.updatePassword(res[0].id,md5.digest('hex'),function(err,res){
			if(err){
					data.msg="密码更新失败，请重试！"

					data.status=500;
					callback(data,response);

			}else{
				var txt='您的新密码：'+newPassWord+'请及时登录系统,修改密码';
				data_del.SendEmall(d.userEmail,'找回密码',txt,txt,function(err,res){
				if(err){
					data.msg="邮件发送失败，请重试！";
					data.status=500;
					callback(data,response)

					}else{
						data.msg="邮件已发送至"+d.userEmail+"请及时登录邮箱，修改密码！";
							data.status=200;
							callback(data,response);

						}
					});
				}
			});
		}

	});
}

function emallBack(d,response,callback)
{
	data_del.activationUser(d.userEmail,d.registerCode,function(err,res){
		var tip='注册验证成功!'
		if(err){
			tip='sorry，注册验证失败，原因未知，再试一次？!'
		}
		response.writeHead(200, {'Content-Type': 'text/html'});  

  		response.write('<head><meta charset="utf-8"/></head>');  



  		response.end('<p>'+tip+'</p>');



		callback();



	})
}

//--------------WebSocket-----------------

function checkLogin(d,response,callback)
{
	var data=JSON.parse(JSON.stringify(responseData));
	if(d.hasOwnProperty("disptch")){
    	data.disptch=d.disptch;
  	}
	data.callback=d.callback;
	data_del.isLogin(d.lastUser,d.cookie,function(err,res){
		if(err){
			data.msg="强制退出"
			data.data="FORCE_LOGOUT"
			data.status=500;

		}else if(res.length>0){
			data.data=true;
			data.status=200;
			if(res[0].isfree){
				data['day']='Free';
			}else{
				var now= new Date();
				var day=common.strToDate(res[0].date)-now;

				if(day<0){
					data['day']='0 天 0小时';
				}else{
					var t=1*1000*60*60;
					var time=day/t; //小时

					day=Math.floor(time/24);

					time=Math.floor(time%24)

					data['day']=day+'天'+time+'小时';
				}

			}
			var links={};
			var array=d.version.split("_");
			var v;
			var n;
			if(array.length>1){
				n=array[0];
				v=array[1];
			}else{
				v=array[0];
				n="HelloWorld";
			}

			var arg='?userEmail='+d.lastUser+'&version='+v+'&invationcode='+res[0].invationcode;
			links['mallurl']=C.mallurl(n)+arg+'&action=buy';
			links['homePage']=C.homePage(n)+arg+'&action=gohome';
			links['invationLink']=C.invationLink(n)+arg+'&action=invation';
			links['praiceLink']=C.praiceLink(n)+arg+'&action=praice';
			links['goolgeStroeLink']=C.goolgeStroeLink(n);

			data['links']=links;

		}else{
			data.msg="强制退出"
			data.data="FORCE_LOGOUT"
			data.status=500;
		}
		callback(data,response);
	})
}
function fetchPac(d,response,callback)
{
	var data=JSON.parse(JSON.stringify(responseData));
	if(d.hasOwnProperty("disptch")){
    	data.disptch=d.disptch;
  	}
	data.callback=d.callback;
	data.status=200;
	var _data=JSON.parse(JSON.stringify(RD_data));
	data_del.getInvationCode(d.lastUser,function(err,res){
		if(err){
			_data.invationCode="NULL"
			var n={'title':'error','content':'获取邀请码失败!'};
			_data.notices[0]=n;
		}
		else{
			_data.invationCode=res
		}
		data_del.getPrxList(d.lastUser,function(err,res){
			if(err){
				_data.prxList=[];
				var n={'title':'error','content':'获取服务器失败!'};
				_data.notices[0]=n;

			}
			else{
				_data.prxList=res;
				if(res.length==0){
					var n={'title':'体力耗尽','content':'亲，到期啦，请续费～'};
					_data.notices[0]=n;
				}
			}
			data_del.getUrlList(d.lastUser,function(err,res){

				if(err){
					_data.urlList={};
				}
				else{
					_data.urlList=res;
				}

			if(_data.notices.length>0){
				data.data=_data;
				callback(data,response);
			}
			else{
			 	data_del.gettip(function(err,res){
					if(!err&&res.length>0){
						var n={'title':'','content':''};
						n.title=res[0].title;
						n.content=res[0].tip;
						console.log(n);
						_data.notices[0]=n;
					}
					data.data=_data;
					callback(data,response);
				});
			}

			});

		});

	});

}

function loadPxyList(d,response,callback)
{
	var data=JSON.parse(JSON.stringify(responseData));
	if(d.hasOwnProperty("disptch")){
    	data.disptch=d.disptch;
  	}
	data.callback=d.callback;
	var _data=JSON.parse(JSON.stringify(RD_data));
	data_del.getPrxList(d.lastUser,function(err,res){
		if(err){
			_data.prxList=[];
			var n={'title':'error','content':'获取服务器失败!'};
			_data.notices[0]=n;
		}
		else{
			_data.prxList=res;

			if(res.length==0){
				var n={'title':'体力耗尽','content':'亲，到期啦，请续费～'};
				_data.notices[0]=n;
			}
		}
		if(_data.notices.length>0){
			data.data=_data;
			data.status=200;
			callback(data,response);
		}
		else{
		 	data_del.gettip(function(err,res){
				if(!err&&res.length>0){
					var n={'title':'','content':''};
					n["title"]=res[0].title;
					n["content"]=res[0].tip;
					console.log(n);
					console.log("ffff...");
					_data.notices[0]=n;
				}
				data.data=_data;
				data.status=200;
				callback(data,response);
			});
		}

	});
}

function deleteURL(d,response,callback)
{
	var data=JSON.parse(JSON.stringify(responseData));
	if(d.hasOwnProperty("disptch")){
    	data.disptch=d.disptch;
  	}
	data.callback=d.callback;
	var _data=JSON.parse(JSON.stringify(RD_data));
	_data.serialId=d.serialId;
	data.data=_data;
	data.status=200;
	//删除数据
	data_del.deleteURL(d.lastUser,d.cookie,d.serialId,function(err,res){
		if(err){
				data.msg="数据库操作失败，请重试！";
				data.status=500;
				callback(data,response)

		}else{
			data_del.getUrlList(d.lastUser,function(err,res){
				if(err){
					data.msg="数据库操作失败，请重试！";
					data.status=500;
					callback(data,response);
				}
				else{
					_data.urlList=res;
					callback(data,response);
				}
			});
		}
	});
}

function addURL(d,response,callback){
	var data=JSON.parse(JSON.stringify(responseData));
	if(d.hasOwnProperty("disptch")){
    	data.disptch=d.disptch;
  	}
	var _data=JSON.parse(JSON.stringify(RD_data));
	data.callback=d.callback;
	data.status=200;
	data_del.addURL(d.lastUser,d.url, function(err,res){
		if(err){
			data.msg="数据库操作失败，请重试！";
			data.status=500;
			callback(data,response)
		}else{
			data_del.geturlid(d.lastUser,d.url, function(err,res){
				if(err){
					data.msg="数据库操作失败，请重试！";
					data.status=500;
					callback(data,response)
				}else{
					_data.url=d.url;
					_data.serialId=res[0].id;
					data.data=_data;
					callback(data,response);
				}
			});
		}

	});

}

function addURLs(d,response,callback)
{
	var data=JSON.parse(JSON.stringify(responseData));
	if(d.hasOwnProperty("disptch")){
    	data.disptch=d.disptch;
  	}

	var _data=JSON.parse(JSON.stringify(RD_data));

	data.callback=d.callback;

	_data.tabId=d.tabId;

	data.status=200;

	data_del.addURLs(d.lastUser,d.urls, function(err,res){
		if(err){
				data.msg="数据库操作失败，请重试！";
				data.status=500;
				data.data=_data;
				callback(data,response);
		}else{
			data_del.getUrlList(d.lastUser,function(err,res){
				if(err){
					data.msg="数据库操作失败，请重试！"
					data.status=500;
					data.data=_data;
					callback(data,response);
				}
				else{
					_data.urlList=res;
					data.data=_data;
					callback(data,response);
				}

			});
		}
	});

}

function updateURL(d,response,callback){

	var data=JSON.parse(JSON.stringify(responseData));

	if(d.hasOwnProperty("disptch")){

    	data.disptch=d.disptch;
  	}
	data.callback=d.callback;
	data.status=200;
	var _data=JSON.parse(JSON.stringify(RD_data));
	_data.url=d.url;
	_data.serialId=d.serialId;
	data.data=_data
	data_del.updateURL(d.serialId,d.url,function(err,res){
		if(err){
			data.status=500
			data.msg="修改失败！"
		}
		callback(data,response);
	});
}

function fetchDomains(d,response,callback)
{
	var data=JSON.parse(JSON.stringify(responseData));
	if(d.hasOwnProperty("disptch")){
    	data.disptch=d.disptch;
  	}
	data.callback=d.callback;
	var _data=JSON.parse(JSON.stringify(RD_data));
	data_del.getUrlList(d.lastUser,function(err,res){
		if(err){
			data.msg="数据库操作失败，请重试！";					
			data.status=500;
			data.data=_data;
			callback(data,response);
		}
		else{
			_data.urlList=res;
			data.data=_data;
			callback(data,response);
		}
	});
}


function loadNotice (d,response,callback){

	var data=JSON.parse(JSON.stringify(responseData));
	if(d.hasOwnProperty("disptch")){
    	data.disptch=d.disptch;
  	}
	data.callback=d.callback;
	var _data=JSON.parse(JSON.stringify(RD_data));
	_data['comments']=[];
	var array=d.version.split("_");
	var v;
	var n;
	if(array.length>1){
		n=array[0];
		v=array[1];

	}else{
		v=array[0];
		n="HelloWorld";
	}
	data_del.loadNotice(n,function(err,res){
		if(err){
			data.msg="数据库操作失败，请重试！";
			data.data=_data;
			callback(data,response);
		}else{
			for(var i=0;i<res.length;i++){
				var t={};
				t['notice']=res[i].comment;
				t['date']=res[i].date;
				_data.comments[i]=t;
			}
			data.status=200;
			data.data=_data;
			callback(data,response);

		}

	})
}


function executeVip(pxyId,type,callback){
	data_del.getPxyInfo(pxyId,function(err,res){
		if(err){
			callback(false);

		}else if (res.length>0) {
			if(type=='i'){
				data_del.getVipInfo(res[0].iqiyiid,function(err,res1){
					if(err){
						callback(false);
					}else if (res1.length>0) {
						data_del.getVipCode(res1[0].type,function(err,res2){
							if(err){
								callback(false);
							}else if(res2.length>0){
								var str=res2[0].content.replace(/'liang_usr_name~~'/g,"'"+res1[0].username+"'");
								var str1=str.replace(/'liang_pass_word~~'/g,"'"+res1[0].password+"'");
								callback(str1);
							}else{
								 callback(false);
							}

						});

					}else{
					  callback(false);
					}
				});
			}

		}else{
		  callback(false);
		}

	});

}

function vipLogin(d,response,callback){
	var data=JSON.parse(JSON.stringify(responseData));
	data.data=false;
	data_del.isLogin(d.lastUser,d.cookie,function(err,res){
		if(err){
			data.msg="强制退出"
			data.data="FORCE_LOGOUT"
			data.status=500;
			callback(data,response);
		}else if(res.length>0){
			data.status=200;
			if(res[0].isfree){
				executeVip(d.pxyId,d.type,function(code){
					data.data=code;;
					callback(data,response);
				});
			}else{
				var day=common.strToDate(res[0].date)-now;
				if(day>0){
					//执行
					executeVip(d.pxyId,type,function(code){
						data.data=code;
						callback(data,response);			
					});
				}else{
					callback(data,response);
				}
			}
		}else{
			data.msg="强制退出"
			data.data="FORCE_LOGOUT"
			data.status=500;
			callback(data,response);
		}

	})
}



function updatePxy(d,response,callback,i){

	if(i==null || i == "undefined"){
		data_del.ResetPxy(0,0,function(){
			updatePxy(d,response,callback,0);
		})
	}else if (i<d.prxyList.length){

		data_del.selectPxy(d.prxyList[i].ip,d.prxyList[i].prot,function(err,res){

			if(err){

			}else if(res.length>0){
				data_del.setPxy(d.prxyList[i].ip,d.prxyList[i].prot,d.prxyList[i].type,d.prxyList[i].name+"(go)",d.prxyList[i].status,res[0].id,1,1,function(){

					updatePxy(d,response,callback,i+1);

				});

			}else{
				data_del.addPxy(d.prxyList[i].ip,d.prxyList[i].prot,d.prxyList[i].type,d.prxyList[i].name+"(go)",d.prxyList[i].status,1,1,function(){

					updatePxy(d,response,callback,i+1);

				});

			}

		})

	}

}

function addTime(d,response,callback){
data_del.getUserInfo(d.user,function(err,res){
			if(err) {
				response.end("failure");
				console.log(err)
			}else if(res.length>0){
				console.log(res[0].username+" addTime.....");

				var now= new Date();
				var day=common.strToDate(res[0].date);
				if(day-now<0){
					day=now;
				}

				if(d.goodsId=='up'){
					data_del.setVipType("CRX_AND_MOBILE",d.user,function(err,res){
						if(err){
							console.log("up error");
							response.end("failure");
						}
					});
				}else{
					data_del.getGoodsInfo(d.goodsId,function(err,res){
						if(err){
							response.end("failure");
						}
						else if(res.length>0){
							 day.setDate(day.getDate()+res[0].day);
							 var date=common.DateTostr(day);
							 data_del.updateTime(date,d.user,function(err,up){
							 	if(err){
							 		response.end("failure");
							 	}else{
							 		data_del.setVipType(res[0].viptype,d.user,function(err,res){
										if(err){
											console.log("up error");
											response.end("failure");
										}else{
											response.end("success");
							 				console.log("addTime flish...");
										}
									});
							
							 	}
							 });
						}
						else{
							response.end("failure");
							console.log("goodsId length <0...")
						}
					});
				}

			}else{
				response.end("failure");
				console.log("user length <0...")
			}

	})
}
function userInfo(d,response,callback){
	console.log("user info ......")
	var userInfo={};
	data_del.getUserInfo(d.user,function(err,res){
		if(err||res.length<=0){
			console.log("not user!..........");
			userInfo["isUserError"]=1;
		}else{
			userInfo["user"]=res;
			response.end(JSON.stringify(userInfo));
		
		}
	});
}



function payInfo(d,response,callback){
	var payInfo={};
	data_del.getUserInfo(d.user,function(err,res){
		if(err||res.length<=0){
			console.log("not user!..........");
			payInfo["isUserError"]=1;
		}else{
			payInfo["user"]=res;
		}
		data_del.getGoodsInfo(d.goodsId,function(err,goods){
			if(err||goods.length<=0){
				payInfo["isGoodsError"]=1;
				console.log("not goods!.........."+d.goodsId);
				response.end(JSON.stringify(payInfo));
	
			}else{
				payInfo["goods"]=goods;
				response.end(JSON.stringify(payInfo));
			}
		});
	});
}



function getMoblie(d,response,callback){
    var DIRECT_URL = "['https://api.gecko.la','https://api2.gecko.la','chrome-extension://','chrome://']";
    var DIRECT_HOST = "['10.[0-9]+.[0-9]+.[0-9]+', '172.[0-9]+.[0-9]+.[0-9]+', '192.168.[0-9]+.[0-9]+']";
    var DIRECT_DNS = "['0.0.0.0', '127.0.0.1', 'localhost', 'api.gecko.la', 'api2.gecko.la']";

    data_del.getmobliePxy(d.p,function(err,pxy){
    	if(err||pxy.length<=0){
    		response.end("function FindProxyForURL(url, host){return 'DIRECT';}");
    	}else{
			var s="";
			for (var i = 0; i < pxy.length; i++) {
					s=s+pxy[i].type+" "+pxy[i].ip+":"+pxy[i].prot+";";
			};
			s=s.substring(0,s.length-1);
    		var header = getHeader().replace("@", s);
    		var body="";
    		data_del.getUrlList(d.username,function(err,url){
    			if(err||url.length<=0){
    				response.end("function FindProxyForURL(url, host){return 'DIRECT';}");
    			}else{
    				body = getBody().replace("#", JSON.stringify(convertList(url)));
    				response.end(header + body);
    			}
    		});
    	}

    });
    function getHeader() {
        var sb = "function FindProxyForURL(url,host){var D='DIRECT';var p='@';host=host.toLowerCase();";
        sb += " var du = " + DIRECT_URL + ";" + "for(var a in du){if(url.indexOf(du[a]) == 0){return D;}}";
        sb += " var dh = " + DIRECT_HOST + ";" + "for(var b in dh){if(shExpMatch(host,dh[b])){return D;}}";
        sb += " var dn = " + DIRECT_DNS + ";" + "for(var c in dn){if(dnsDomainIs(host,dn[c])){return D;}}";
        return sb
    }
    function getBody() {
        var sb = "var node=#;var hostParts = host.split('.');for(var d=hostParts.length-1;d>=0;d--){var part=hostParts[d];node=node[part];if(node == undefined||node==1){break;}} if(node==1){return p;}return D;}";
        return sb
    }

     function  convertList(list) {
     	var obj = {};
        list = list ? list: this.getList();
        if (list) {
            for (var i in list) {
                var array = list[i].split(".");
                var val = array.pop();
                obj[val] = function() {
                    var arg0 = arguments[0];
                    var arg1 = arguments[1];
                    if (arg1.length > 0) {
                        if (arg0 == 1) return 1;
                        if (typeof arg0 == "undefined") arg0 = {};
                        var av = arg1.pop();
                        arg0[av] = arguments.callee(arg0[av], arg1);
                        return arg0
                    } else return 1
                } (obj[val], array)
            }
        }
        return obj;
    }

}


exports.LogicDel=function (data,response,callback)
{
  	 var mycallback;

        try {

            mycallback = eval(data.action)

        } catch(exception) {}

        if (typeof mycallback === "function") new mycallback(data,response,callback)



}



