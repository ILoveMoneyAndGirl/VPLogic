var uuid = require('node-uuid');
var C=require("./const.js")
var nodemailer = require('nodemailer');

// d2.setDate(d.getDate()+11)
// var d=new Date();
// d.setDate(d.getDate()+1);
// console.log(datatostr(d));

exports.strToDate=function(str){
    if(str==null||str==''){
        return new Date();
    }
    var s=str.replace(/-/g,'/');
    return new Date(s);
}
function datatostr(d){
    var yy,MM,dd,hh,mm,ss;
    yy=d.getFullYear();   
    MM=d.getMonth()+1;   
    dd=d.getDate();   
    hh=d.getHours();   
    mm=d.getMinutes();   
    ss=d.getSeconds(); 
    return yy+'-'+MM+'-'+dd+' '+hh+':'+mm+':'+ss;
}
exports.DateTostr=function(d){
    return datatostr(d);
}

exports.SedEamll=function(emall,t,txt,hml,SedEamllAdress,SedEamllServer,SedEamllPassWord,callback){

    var mailOptions = {

    from: SedEamllAdress, // sender address

    to: emall, // list of receivers

    subject: t, // Subject line

    text: txt, // plaintext body

    html: hml // html body

    };



    var transporter = nodemailer.createTransport({

        host: SedEamllServer,

         auth: {

          user: SedEamllAdress,

         pass: SedEamllPassWord

        }

    });

    transporter.sendMail(mailOptions, callback);

}


exports.Getuuid=function(){
    return uuid.v1();
}

exports.GetRandomNum=function(Min,Max)
{   
    var Range = Max - Min;   
    var Rand = Math.random();   
    return(Min + Math.round(Rand * Range));   
}   