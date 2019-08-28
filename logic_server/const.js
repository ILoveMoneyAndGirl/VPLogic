

exports.httpServerIp=function (){

 	return "120.26.130.136"

}

exports.httpServerProt=function (){

	return 8888;

}

exports.socketServerIp=function (){

	return "120.26.130.136";

}

exports.socketServerProt=function (){

	return 8001;

}



exports.DataBaseIp=function (){

	 return "10.117.45.69";
}



exports.DataBaseProt=function (){

	return 3306;

}



exports.DataBaseUserName=function (){

	return "lroot";

}



exports.DataName=function (){

	return 'pxydb2';

}



exports.DataBasePassword=function (){

	return "wayz10xs.c.c";

	//return "";

}



exports.SedEamllAdress=function (){

	//return "1341201318@qq.com";
//return "liangyuanbo123@gamil.com";
//return "sayhellobythis@vip.163.com";
return "1101603484@qq.com";

}

exports.SedEamllPassWord=function (){

//	return "jawtghqonsxeidbe";
 //return "wayz10xs";
//return "wayz10xs.c.c";
	return "ky10121125";

}

exports.SedEamllServer=function (){

	return "smtp.qq.com";
	//return "gmail";
//return "smtp.vip.163.com";


}
exports.SedEamllUrl=function (){

	return "http://172.104.85.60/HelloWorld/alive.php";
	//return "gmail";
//return "smtp.vip.163.com";


}

exports.AppName=function (){

	return "HelloWorld";

}



exports.isFree=function (){

	return false;

}



exports.tryDay=function (){

	return 1;

}

exports.invationDay=function (){

	return 1;

}



var mallurl={}; //商城
	mallurl["HelloWorld"]='http://172.104.85.60/hmall/mall.php';
	mallurl["企鹅出墙"]='http://172.104.85.60/hmall/mall.php';
	mallurl["proxy"]='http://172.104.85.60/hmall/mall.php';
	mallurl["gecko"]='http://172.104.85.60/hmall/mall.php';

var homePage={}; //帮助
	homePage["HelloWorld"]='http://172.104.85.60/hmall/mall.php';
	homePage["企鹅出墙"]='http://172.104.85.60/hmall/mall.php';
	homePage["proxy"]='http://172.104.85.60/hmall/mall.php';
	homePage["gecko"]='http://172.104.85.60/hmall/mall.php';
var invationLink={};//邀请
 	invationLink["HelloWorld"]='http://172.104.85.60/hmall/mall.php';
	invationLink["企鹅出墙"]='http://172.104.85.60/hmall/mall.php';
	invationLink["proxy"]='http://172.104.85.60/hmall/mall.php';
	invationLink["gecko"]='http://172.104.85.60/hmall/mall.php';
var praiceLink={};//五星推荐
 	praiceLink["HelloWorld"]='http://172.104.85.60/hmall/mall.php';
	praiceLink["企鹅出墙"]='http://172.104.85.60/hmall/mall.php';
	praiceLink["proxy"]='http://172.104.85.60/hmall/mall.php';
	praiceLink["gecko"]='http://172.104.85.60/hmall/mall.php';
var goolgeStroeLink={};
	goolgeStroeLink["HelloWorld"]='https://chrome.google.com/webstore/detail/helloworld/nbceagogbdhbpnjinekdelphpahoijba';
	goolgeStroeLink["企鹅出墙"]='https://chrome.google.com/webstore/detail/%E4%BC%81%E9%B9%85%E5%87%BA%E5%A2%99/bgjnekhmooneebapldjmcommgechginh';
	goolgeStroeLink["proxy"]='https://chrome.google.com/webstore/detail/niaplaeilikgnbdhodemadkgaadgngpj';
	goolgeStroeLink["gecko"]='https://chrome.google.com/webstore/detail/%E5%A3%81%E8%99%8E%E6%BC%AB%E6%AD%A5/hgfiggpgohbhmcndhefnbphcgjlcahbn?utm_source=en-et-na-us-oc-webstrhm';
exports.mallurl=function (key){

	return mallurl[key];

}

exports.homePage=function (key){

	return homePage[key];
}

exports.invationLink=function (key){

	return invationLink[key];

}

exports.praiceLink=function (key){

   return praiceLink[key];

}

exports.goolgeStroeLink=function (key){
	return goolgeStroeLink[key];
}

