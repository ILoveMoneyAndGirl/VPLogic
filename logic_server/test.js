//  var responseData={"callback":"","data":"","disptch":true,"msg":"","status":500};

// var t=responseData
// t.status=300
// 	        console.log(t);
// 	        console.log(responseData);

// const Common=require('./common.js')

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



let temp={
	temp:{
		a1:1,
		b1:2,
		b3:3,
		b4:4,
		b5:{
			vv:"1"
		}
	},

	cc:77
}


console.log(temp)
delete temp["temp"]["b5"]
console.log(temp)






















