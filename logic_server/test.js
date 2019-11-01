//  var responseData={"callback":"","data":"","disptch":true,"msg":"","status":500};

// var t=responseData
// t.status=300
// 	        console.log(t);
// 	        console.log(responseData);
// const Common=require('./common.js')

const UserModel = require("./models").User;

let name="101001806@qq.com"
console.log(UserModel)
 let data=  await UserModel.remove({
                userName: name
            });

 console.log(data)


// const Tip =  require("./config/tip");
// let _setting = require('./config/setting');
// let _config = require('./config/config');
//                 let content=Tip.activeUrl.replace("emall%","1010017806@qq.com").replace("code%","code")

//    Common.SedEamll("1010017806@qq.com",Tip.Welcome,content,content,_config.emall,_config.smtp,_config.password,async function(err,info){
                 
//                                           console.log("////////------>00")

//                        console.log(err)
//                           console.log(info)

                 // if(err){
                 //        data.data=false;
                 //        data.msg=Tip.SendEmailError;
                 //        data.status=500;
                 //        next(data)
                 //    }else{

                 //         let add= emallAddress.split("@")
                 //         let madd= msg.userEmail.split("@")[1]

                 //         console.log("////////------>222")
                 //         console.log(madd)
                 //          console.log(add)

                 //         data.msg=Tip.Register1+emallAddress

                 //         for (var i = 0; i < add.length; i++) {
                 //             if(add[i]==madd)
                 //             {
                 //                 data.msg=Tip.Register
                 //                 break;
                 //             }
                 //         }

                 //         data.data=false
                 //         data.status=200;
                 //          next(data)
                 //      }
                // }); 



// // console.log(Common.GetRandomNum(0,1))

// var d=[2,3,5,7,8,9,11,22,888,232,2123,345,678,891,3456,7412,3456,55,6,0,342]
// var index=[]
// for (var i = 0; i < 10; i++) {
// 	var f=Common.GetRandomNum(0,d.length-1)
// 	index[i]=d[f]
// 	d.splice(f, 1)
// }
 
//  console.log(index)
//    console.log(index.length)

// a=0.01
// b=0.02
// c=0.011
// d="0.01"
// f="0.010"
// if(a==b)
// {
// 	console.log("===")
// }
// else{
// 	console.log("!==")
// }

// if(c==a)
// {
// 	console.log("===")
// }
// else{
// 	console.log("!==")
// }

// if(a==d)
// {
// 	console.log("===")
// }
// else{
// 	console.log("!==")
// }
// if(a==f)
// {
// 	console.log("===")
// }
// else{
// 	console.log("!==")
// }



// let temp={
// 	temp:{
// 		a1:1,
// 		b1:2,
// 		b3:3,
// 		b4:4,
// 		b5:{
// 			vv:"1"
// 		}
// 	},

// 	cc:77
// 	88:"00000"
// }

// let temp={}
// let key=999.02
// let v=999.010
// temp[key]="xxxxxx"
// if(temp[v])
// 	console.log(temp[key])
// console.log(key.toFixed(3))

// console.log(temp)
// delete temp["temp"]["b5"]
// console.log(temp)

// console.log(Math.abs(-222))






















