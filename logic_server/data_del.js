//邮箱是否存在
var database=require('./data_base.js')
var common=require('./common.js')
var C=require('./const.js')


exports.emallIsExist=function (emall,callback)
{
	// var modeSql='select * from user where username=? and isuse=?'
	var modeSql='select * from user where username=? and isuse=1';
	var paramsSql=[emall];
	database.SQL(modeSql,paramsSql,callback);
}

function sendEamll(emall,t,txt,hml,res,count,err,callback)
{	
	if(count<res.length){
		common.SedEamll(emall,t,txt,hml,res[count].emall,res[count].smtp,res[count].password,function(er,info){
			if(er){
				count=count+1;
				sendEamll(emall,t,txt,hml,res,count,er,callback)
			}else{
				var modeSql='update  emall set sendcount=? where id=?';
				var paramsSql=[res[count].sendcount+1,res[count].id];
				database.SQL(modeSql,paramsSql,function(errr,ress){
				  callback(er,info);
				});
			}
		});
	}else{
		callback(err);
	}

}

exports.SendEmall=function(emall,t,txt,hml,callback){
	
	var modeSql='select * from emall order by sendcount';
	var paramsSql=[];
	database.SQL(modeSql,paramsSql,function(err,res){
		if(err){
			callback(err,null);
		}
		else{
			sendEamll(emall,t,txt,hml,res,0,null,callback)
		}
	});
}


function sendRegisterEmall(emall,registerCode,appName,callback){
	var t="欢迎注册 "+appName;
	var txt="点击 <a href='"+C.SedEamllUrl()+"?action=emallBack&userEmail="+emall+"&registerCode="+registerCode+"'>这里</a> 激活账号 ";

	var modeSql='select * from emall order by sendcount';
	var paramsSql=[];
	database.SQL(modeSql,paramsSql,function(err,res){
		if(err){
			callback(err,null);
		}
		else{
			sendEamll(emall,t,txt,txt,res,0,null,callback)
		}
	});
}
//发验证码至邮箱 注册
exports.sendVerificationCodeToEmall =function (emall,password,invationEmall,appName,callback)
{	
	var modeSql='select * from user where username=? and isuse=0';
	var paramsSql=[emall];
	database.SQL(modeSql,paramsSql,function(err,res){
		if (err){
			callback(err,res)
		}else if(res.length>0){
			var modeSql='update  user set password=?,invationemall=? where id=?';
			var paramsSql=[password,invationEmall,res[0].id];
			database.SQL(modeSql,paramsSql,function (err, r){
				if(err){
					callback(err,res)
				}
				else{
					sendRegisterEmall(emall,res[0].registercode,appName,callback)
				}
			});
		}
		else{
			var free=0;
			if(C.isFree()){
				free=1;
			}
			var modeSql='insert into user (username,password,registercode,invationcode,invationemall,isfree) VALUES (?,?,?,?,?,?)';
			var invationcode=common.Getuuid();
			var registercode=common.Getuuid();
			// var d=new Date();
			// d.setDate(d.getDate()+C.tryDay());
			// var date=common.DateTostr(d);
			var paramsSql=[emall,password,registercode,invationcode,invationEmall,free];
			database.SQL(modeSql,paramsSql,function (err, res,fields) {
	 			if (err) {
	 				callback(err,res);
	  			}
	  			else{
	  				sendRegisterEmall(emall,registercode,appName,callback);
	  			}
			});
		}
	});
}
//激活账号
exports.activationUser =function (emall,registercode,callback)
{
	var modeSql='select * from user where username=? and registercode=?';
	var paramsSql=[emall,registercode];
	database.SQL(modeSql,paramsSql,function(err,res){
		if (err){
			callback(err,res)
		}else if(res.length>0){
			if(res[0].isuse==1){
				return callback(err,res);
			}else{
				if(res[0].invationemall!=null&&res[0].invationemall!=''){
				AddTime(C.invationDay(),res[0].invationemall,function(err,res){
					if(err){
						AliveUser(1,C.tryDay(),emall,callback);
					}else{
						AliveUser(1,C.tryDay()+C.invationDay(),emall,callback);
					}
				})
				}else{
					AliveUser(1,C.tryDay(),emall,callback);
				}
			}
		}
		else{
			callback(true,null);
		}
	});
}

function AliveUser(isuse,day,emall,callback){
		var d=new Date();
		d.setDate(d.getDate()+day);
		var date=common.DateTostr(d);
		var modeSql='update  user set isuse=?,date=? where username=?';
		var paramsSql=[isuse,date,emall];
		database.SQL(modeSql,paramsSql,callback);

		// console.log(" InitUserUrl ..................................")
		InitUserUrl(emall)
}

function AddTime(day,username,callback){
		 var modeSql='select * from user where username=?';
		 var paramsSql=[username];
		 database.SQL(modeSql,paramsSql,function(err,res){
		 	if(err){
		 		callback(err,res);
		 	}else if(res.length>0){
		 		var d=common.strToDate(res[0].date);
		 		// console.log("before.......")
		 		// console.log(day)
		 		// console.log(common.DateTostr(d))
				d.setDate(d.getDate()+day);
				// console.log("after.......")
		 	// 	console.log(common.DateTostr(d))
				var date=common.DateTostr(d);
				modeSql='update  user set date=? where username=?';
				paramsSql=[date,username];
				database.SQL(modeSql,paramsSql,callback);
		 	}else{
		 		callback(true,null)
		 	}
		 });
}
exports.updateTime=function(date,username,callback){
  	modeSql='update  user set date=? where username=?';
	paramsSql=[date,username];
	database.SQL(modeSql,paramsSql,callback);
}
exports.getUserInfo =function (userName,callback)
{
	var modeSql='select * from user where username=?';
	var paramsSql=[userName];
	database.SQL(modeSql,paramsSql,callback);
}
exports.getUserInfoById =function (id,callback)
{
	var modeSql='select * from user where id=?';
	var paramsSql=[id];
	database.SQL(modeSql,paramsSql,callback);
}

exports.setVipType=function(vipType,username,callback){
  	modeSql='update  user set viptype=? where username=?';
	paramsSql=[vipType,username];
	database.SQL(modeSql,paramsSql,callback);
}

exports.getGoodsInfo =function (goodsId,callback)
{
	var modeSql='';
	var paramsSql=[];

	if(goodsId==null||goodsId==""||typeof(goodsId)=='undefined'){
		modeSql='select * from goods';
	}else{
		modeSql='select * from goods where id=?';
	 	paramsSql=[goodsId];
	}

	database.SQL(modeSql,paramsSql,callback);
}


function InitUserUrl(userName){
	// console.log(" InitUserUrl .....................enter.............")
	var modeSql='select * from urllist where username=?';
	var name='l';
	var paramsSql=[name];
	database.SQL(modeSql,paramsSql,function(err,res){
		if(err){
			// console.log(err);
			return;
		}
		for(var i=0;i<res.length;i++){
			// console.log("insert.....url")
			var modeSql='insert into urllist (username,url) VALUES (?,?)';
			var paramsSql=[userName,res[i].url];
			database.SQL(modeSql,paramsSql);
		}
	});
}

//验证用户名密码
exports.verifyUserNameAndPassword =function (userName,password,callback)
{
	var modeSql='select * from user where username=? and password=? and isuse=1';
	var paramsSql=[userName,password];
	database.SQL(modeSql,paramsSql,callback);
}

exports.resetPassword=function(username,oldPassword,newpassword,callback)
{
	var modeSql='select * from user where username=? and password=?';
	var paramsSql=[username,oldPassword];
	database.SQL(modeSql,paramsSql,function(err,res){
		if(err){
			// console.log('resetPassword..........err.......')
			callback(err,callback);
		}
		else if(res.length==1){
			var modeSql='update user set password=? where id=?';
			var paramsSql=[newpassword,res[0].id];
			database.SQL(modeSql,paramsSql,callback);
		}
		else{
			// console.log('resetPassword..........!=1.......')
			callback(true,null);
		}
	});
}


exports.updatePassword=function(id,password,callback)
{
	var modeSql='update user set password=? where id=?';
	var paramsSql=[password,id];
	database.SQL(modeSql,paramsSql,callback);
}

//更新cookie
exports.updateCookie =function (userName,callback)
{
		var modeSql='select* from user where username=?';
		var paramsSql=[userName];
		database.SQL(modeSql,paramsSql,function(err,res){
			if (err){
				callback(err,res);
			}else if(res.length>0){
				var cookie=common.Getuuid();
				var cookiename=res[0].cookienow;
				if(cookiename==''||cookiename==null||typeof cookiename=='undefined'){
					cookiename='cookie1';
				}
				var modeSql='update  user set '+cookiename+'=? where username=?';
				var paramsSql=[cookie,userName];
				database.SQL(modeSql,paramsSql,function(err,res1){
				if (err){
						callback(err,res1);
					}else{
						callback(err,cookie);
						var modeSql='update  user set cookienow =? where username=?';
						if(cookiename=='cookie'){
							cookiename='cookie1';
						}else{
							cookiename='cookie';
						}
						var paramsSql=[cookiename,userName];
						database.SQL(modeSql,paramsSql,function(err,res3){
							if(err){
								console.log('update cookienow err');
							}else{
								console.log('update cookienow seusses');
							}
						});
					}				
				});
			}else{
				callback(true);
			}				
		});
}

//获取邀请码
exports.getInvationCode =function(userName,callback)
{
	var modeSql='select invationcode from user where username=?';
	var paramsSql=userName;

	database.SQL(modeSql,paramsSql,function(err,res){
		if(err){
			callback(err,res);
		}
		else{
			callback(err,res[0].invationcode);
		}
	});
}
//获取websocket key
exports.getKey =function (userName,callback)
{
	// if(emall!="1010017806@qq.com") return true;
	// else return false;
	callback(null,'xxxxxxxxxxx');
}
//判断是否登录
exports.isLogin =function (userName,cookie,callback)
{
	var modeSql='select * from user where username=? and (cookie=? or cookie1=?)';
	var paramsSql=[userName,cookie,cookie];
	database.SQL(modeSql,paramsSql,callback);
}

//获取prxList
exports.getIpControlPrxList =function (isIpControl,callback){
	var modeSql='select * from proxy where isIpControl=?';
	var paramsSql=[isIpControl];
	database.SQL(modeSql,paramsSql,function(err,res){
		callback(err,res);
	});
}
//获取prxList
exports.getPrxList =function (userName,callback)
{	
	var modeSql='select * from user where username=?';
	var paramsSql=[userName];
	database.SQL(modeSql,paramsSql,function(err,res){
		if(err){
			callback(err,res);
		}else if(res.length>0){
			var date=common.strToDate(res[0].date);
			var now=new Date();
			// console.log(res);
			if(res[0].isfree){
				// console.log("isFree..........")
				// console.log(res[0].username)

				var modeSql='select * from proxy where isfree=?';
				var paramsSql=[1];
				database.SQL(modeSql,paramsSql,function(err,res){
					if(err){

						callback(err,res);
					}
					else{
						var r=[];
						var p=[];
						var pindex=0;
						for(var j=0;j<res.length;j++){
							
							if(res[j].p==10){
								p[pindex]=res[j];
								pindex=pindex+1;
							}
						}
						for(var i=0; i<res.length; i++){
							if(res[i].p!=10){
								var t={};
								t["address"]=res[i].name;
								t["id"]=res[i].id.toString();
								t["info"]=res[i].type+' '+res[i].ip+':'+res[i].prot;
								for(var v=0;v<p.length;v++){
									t["info"]=t["info"]+";"+p[v].type+" "+p[v].ip+":"+p[v].prot;
								}
								t["status"]=res[i].status;
								r[i]=t;
							}
		
						} 
						callback(err,r);
					}
				});
			}
			else if (now-date<0){
				// console.log("is no Free..........")
				// console.log(res[0].username)

				var modeSql='select * from proxy where isnofree=?';
				var paramsSql=[1];
				database.SQL(modeSql,paramsSql,function(err,res){
					if(err){
						callback(err,res);
					}
					else{
						var r=[];
						var p=[];
						var pp=[];

						var a=[];

						var pindex=0;
						var aindex=0
						
						for(var j=0;j<res.length;j++){

							if(res[j].p==10){
								p[pindex]=res[j];
								pp[pindex]=pindex;
								pindex=pindex+1;
							}else{
								a[aindex]=j;
								aindex=aindex+1;
							}

							
						}
						var rindex=0;
						// console.log(":::::::")
						// console.log(a.length)
						for(var i=0; i<res.length; i++){
							if(res[i].p!=10){

								// console.log(":::::::2")
								// console.log(i)
								var c=Math.floor(Math.random()*a.length);

								var t={};
								t["address"]=res[i].name;
								t["id"]=res[i].id.toString();
								// t["info"]=res[i].type+' '+res[i].ip+':'+res[i].prot;
								// console.log("??????>>>>>>")
								// console.log(a[c])
								// console.log(c)

								t["info"]=res[a[c]].type+' '+res[a[c]].ip+':'+res[a[c]].prot;
								a.splice(c,1);


								var ps=[];

								for (var ii = 0; ii < pp.length; ii++) {
									ps[ii]=pp[ii];
								}

								for(var v=0;v<p.length;v++){
									var x=Math.floor(Math.random()*ps.length);

									// t["info"]=t["info"]+";"+p[v].type+" "+p[v].ip+":"+p[v].prot;
									t["info"]=t["info"]+";"+p[ps[x]].type+" "+p[ps[x]].ip+":"+p[ps[x]].prot;
									ps.splice(x,1);
								}
								t["status"]=res[i].status;

								// r[a[c]]=t;
								// console.log(">>>>>>>>>>>>")
								// console.log(a[c])
								r[rindex]=t

								rindex=rindex+1;
							}
						} 
						// console.log(r)
						callback(err,r);
					}
				});
			}
			else{
				var r=[];
				callback(null,r);
			}
		}
		else{
			var r=[];
			callback(null,r);
		}
	});


	
	
	
	// return[{"address":"稳定高速","id":"8","info":"HTTPS mall.double-click.biz:443","status":0},{"address":"Mac专线","id":"27","info":"HTTPS mp3.double-click.biz:443","status":3},{"address":"香港高速","id":"24","info":"HTTPS mark.double-click.info:8120","status":3},{"address":"香港高速1","id":"23","info":"HTTPS shop.double-click.info:8120","status":3},{"address":"日本2号","id":"29","info":"HTTPS eax.double-click.co:8120","status":0},{"address":"日本1号","id":"30","info":"HTTPS man.double-click.co:8120","status":0}];
}
//获取UrlList
exports.getUrlList =function (userName,callback)
{	
	var modeSql='select id,url from urllist where username=?';
	var paramsSql=[userName];
	database.SQL(modeSql,paramsSql,function(err,res){
		if(err){
			callback(err,res);
		}
		else{
			var r={};
			for(var i=0; i<res.length; i++){
				r[res[i].id]=res[i].url;
			} 
			callback(err,r);
		}
	});
	// return {"6111505":"chrome.com","6111626":"labalec.fr","6111504":"chinagfw.org"};
}
//更新用户代理设置
exports.updateUserPxy =function (userName,cookie,model,pxyId,callback)
{
	
	var modeSql='update  proxySetting set proxyid=? where username=?';
	var paramsSql=[pxyId,userName];
	database.SQL(modeSql,paramsSql,callback);
}
//删除代理网址
exports.deleteURL =function (userName,cookie,serialId,callback)
{
	var modeSql='delete from urllist where id=?';
	var paramsSql=[serialId];
	database.SQL(modeSql,paramsSql,callback);
}

//增加代理网址
function addurl(userName,url,callback){
	var modeSql='insert into urllist (username,url) VALUES (?,?)';
	var paramsSql=[userName,url];
	database.SQL(modeSql,paramsSql,callback);
}

//修改代理网址
exports.updateURL=function(id,url,callback){
	var modeSql='update urllist set url=? where id=?';
	var paramsSql=[url,id];
	database.SQL(modeSql,paramsSql,callback);
}

exports.geturlid=function(userName,url,callback){
	var modeSql='select id from urllist where username=? and url=?';
	var paramsSql=[userName,url];
	database.SQL(modeSql,paramsSql,callback);
}

exports.addURL =function (userName,url,callback){
	 addurl(userName,url,callback)
}

function addurls(username,urls,index,callback){
	if(index<urls.length){
		addurl(username,urls[index],function(err,res){
			if(err){
				callback(err,res);
			}else{
				addurls(username,urls,index+1,callback);
			}
		});
	}else{
		callback();
	}
}
exports.addURLs =function (userName,urls,callback)
{
  addurls(userName,urls.split(','),0,callback)
}

exports.loadNotice =function (name,callback){
	var modeSql='select *from notice where type=? order by id desc';
	var paramsSql=[name];
	database.SQL(modeSql,paramsSql,callback);
}

exports.gettip=function (callback){
	var modeSql='select *from tip where isuse=?';
	var paramsSql=[1];
	database.SQL(modeSql,paramsSql,callback);
}

exports.getPxyInfo =function (id,callback){
	var modeSql='select *from proxy where id=?';
	var paramsSql=[id];
	database.SQL(modeSql,paramsSql,callback);
}
exports.getVipInfo =function (id,callback){
	var modeSql='select *from vip where id=?';
	var paramsSql=[id];
	database.SQL(modeSql,paramsSql,callback);
}
exports.getVipCode =function (type,callback){
	var modeSql='select *from viplogincode where type=?';
	var paramsSql=[type];
	database.SQL(modeSql,paramsSql,callback);
}

exports.selectPxy =function (ip,port,callback){
	var modeSql='select *from proxy where ip=? and prot=?';
	var paramsSql=[ip,port];
	database.SQL(modeSql,paramsSql,callback);
}
exports.ResetPxy=function(isfree,isnofree,callback){
	var modeSql='update proxy set isfree=?,isnofree=? where id>0';
	var paramsSql=[isfree,isnofree];
	database.SQL(modeSql,paramsSql,callback);
} 
exports.setPxy =function (ip,port,type,name,status,id,isfree,isnofree,callback){
	console.log("ip........database");
	console.log(ip);
	var modeSql='update proxy set ip=?,prot=?,type=?,name=?,status=?,isfree=?,isnofree=? where id=?';
	var paramsSql=[ip,port,type,name,status,isfree,isnofree,id];
	database.SQL(modeSql,paramsSql,callback);
}

exports.addPxy=function (ip,port,type,name,status,isfree,isnofree,callback){
	var modeSql='insert into proxy (ip,prot,type,name,status,isfree,isnofree) VALUES (?,?,?,?,?,?,?)';
	var paramsSql=[ip,port,type,name,status,isfree,isnofree];
	database.SQL(modeSql,paramsSql,callback);
}
exports.getmobliePxy=function (p,callback){
	var modeSql='select *from proxy where p=3 or p=?';
	var paramsSql=[p];
	database.SQL(modeSql,paramsSql,callback);
}

//退出
exports.logout =function (userName,cookie)
{
	updateCookie(userName,cookie)
}
