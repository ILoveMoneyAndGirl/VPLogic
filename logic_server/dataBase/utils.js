
// $equals 等于 ／ $gt 大于 ／ $gte 大于等于 ／ $lt 小余 ／ $lte 小余等于 ／ $ne 不等于 ／ $in 在数组中 ／ $nin 不在数组中

// $or 或 ／ $and 与 ／ $nor 非

// $exists　查询的字段值是否存在
// $mod　与数据进行取模运算筛选

// $regex　使用正则表达式查询数据

// $where　支持js表达式查询

// Query#all([path], val)　　查询数组的本身及超集


// Query#elemMatch(path, criteria)　　查询数组的交集


// Query#size([path], val)　　查询指定大小的数组


// asc为升序，-1、desc为降序。可以对一个字段进行排序，也可以是多个。

// conditions************************************************************************************************
// The conditions are cast to their respective SchemaTypes before the command is sent.

// Examples:
// // named john and at least 18
// MyModel.find({ name: 'john', age: { $gte: 18 }});

// // executes immediately, passing results to callback
// MyModel.find({ name: 'john', age: { $gte: 18 }}, function (err, docs) {});

// // name LIKE john and only selecting the "name" and "friends" fields, executing immediately
// MyModel.find({ name: /john/i }, 'name friends', function (err, docs) { })

// // passing options
// MyModel.find({ name: /john/i }, null, { skip: 10 })

// // passing options and executing immediately
// MyModel.find({ name: /john/i }, null, { skip: 10 }, function (err, docs) {});

// // executing a query explicitly
// var query = MyModel.find({ name: /john/i }, null, { skip: 10 })
// query.exec(function (err, docs) {});

// // using the promise returned from executing a query
// var query = MyModel.find({ name: /john/i }, null, { skip: 10 });
// var promise = query.exec();
// promise.addBack(function (err, docs) {});



// conditions：查询条件；projection：控制返回的字段；options：控制选项；callback：回调函数。


// options有以下选项：
// 　　new： bool - 默认为false。返回修改后的数据。
// 　　upsert： bool - 默认为false。如果不存在则创建记录。
// 　　runValidators： 如果值为true，执行Validation验证。
// 　　setDefaultsOnInsert： 如果upsert选项为true，在新建时插入文档定义的默认值。
// 　　sort： 如果有多个查询条件，按顺序进行查询更新。
// 　　select： 设置数据的返回。

const sqlKeyword=["group","desc","by","where","update","set","order","and","or","insert","from","left","on","jion"]

const sqlWhereOperator={$equals:"=",$gt:">",$gte:">=",$lt:"<",$lte:"<=",$ne:"<>",$in:"in",$regex:"like"}
const sqlLogicOperator={$or:"or"}


const typeCheck  = require('../tool/typeCheck');

var moment = require('moment')
//字段名和sql关键字冲突处理
function SqlKeywordCheck(key)
{
	let lower=key.toLocaleLowerCase()

    for(var i = 0; i < sqlKeyword.length; i++){
        if(lower === sqlKeyword[i]){
        	key="'"+key+"'"
            return key;
        }
    }
    return key;
}

//获取限制状态
function projectionCheckIn(projection)
{
	for(let key in projection)
	{
		if(projection[key]==0)
			return false
	}

	return true
}



//根据mongo规则 组装条件sql 暂时不支持正则表达式
function AssembleWhere(Schema,conditions)
{
	let wheresql=""
	let leftJion={};

	if(typeCheck.isUndefined(conditions))
	{
		return {sql:wheresql,join:leftJion} 
	}

	//遍历条件
	for( var key in conditions){

		//获取逻辑运算符
		let logicOperator= sqlLogicOperator[key]


		if(!typeCheck.isUndefined(logicOperator)) //是逻辑运算符
		{
			continue
			//未完待续 暂时屏蔽运算符 用法
		}


		let map=Schema[key]["map"]

		if(typeCheck.isUndefined(map)) //不存在表映射，跳过条件
			continue

		let data=conditions[key]

		let type=Schema[key]["type"]

		let table=Schema["ref"] //默认主表

		let ref=Schema[key]["ref"]

		if(!typeCheck.isUndefined(ref)) //存在附表 则使用附表
		{
			table=ref.Schema["ref"]
			type=ref.Schema[map]["type"]
			map=ref.Schema[map]["map"]

			if(!leftJion[table]) //如果不存在 表引用关系 则添加
			{
				let ref_filed=Schema[key]["ref_filed"]
				let c=""
				if(ref_filed) 
					c=`${Schema["ref"]}.${Schema[ref_filed[0]]["map"]}=${table}.${ref.Schema[ref_filed[1]]["map"]}`
				else
					c=`${Schema["ref"]}.${Schema["_id"]["map"]}=${table}.${ref.Schema["_id"]["map"]}`
				leftJion[table]=c
			}
		}
			

		if(typeCheck.isObject(data)) //字段值是对象，根据mongo规则 有更复杂的条件判断
		{
			//遍历对象
			for( var k in data){

				//获取条件操作符
				let operator=sqlWhereOperator[k]

				if(typeCheck.isUndefined(operator)) //不支持该操作符
					break
				if(wheresql.length>0)
					wheresql+=` ${table}.${map} `
				else
					wheresql+=`${table}.${map} `

				wheresql+=operator

				if(operator=="in") // 数组
				{
					let arry=data[k]

					wheresql+= " ("
					for( var i in arry){

						if(type===String)
							wheresql+= `'${arry[i]}',`
						else
							wheresql+= `${arry[i]},`
					}

					wheresql=wheresql.substr(0,wheresql.length-1)+")"

				}else
				{
					if(type===String)
						wheresql+=`'${data[k]}'`
					else if(type===Date)
					{
						wheresql+="'"+moment(data[k]).format("YYYY-MM-DD HH:mm:ss")+"'"

					}
						
					else
						wheresql+=`${data[k]}`
				}
				wheresql+=" and"
			}

		}
		else
		{
			if(type===String)
				wheresql+=` ${table}.${map} ='${data}' and`
			else
				wheresql+=` ${table}.${map} =${data} and`
		}

	}


	if(wheresql.length>0){
  		wheresql=wheresql.slice(0,wheresql.length-4)
  		wheresql="where "+wheresql
  	}

	return {sql:wheresql,join:leftJion} 

}


function AssembleFind(Schema,conditions,projection) {
	let w=AssembleWhere(Schema,conditions)
	let s=AssembleField(Schema,projection)

	for(let key in w.join)
	{
		if(!s.join[key])
		{
			s.sql+=` left join ${key} on ${w.join[key]}`
		}
	}
	
	return `select ${s.sql} ${w.sql}`;
}

function AssembleCount(Schema,conditions) {
	let w=AssembleWhere(Schema,conditions)
	let sql=`select count(*) as count from ${Schema["ref"]}`
	for(let key in w.join)
	{
		sql+=` left join ${key} on ${w.join[key]}`
	}
	
	return `${sql} ${w.sql}`;
}

//根据mongo规则 组装查询字段sql
function AssembleField(Schema,projection) {

	let fieldSql=""
	let isLimit=false	//是否字段限制
	let isLimitIn=true      //限制状态

	let leftJion={};

	if(!typeCheck.isEmpty(projection))
	{
		isLimit=true
		isLimitIn=projectionCheckIn(projection)
	}

	for(let key in Schema)
	{
		if(key==="ref")
			continue

		if(isLimit){
			if(isLimitIn&&(typeCheck.isUndefined(projection[key])||projection[key]!=1))  //为1组装，反之不
				continue
			if(!isLimitIn&&projection[key]==0) //为0不组装，反之组装
				continue
		}
		
		let filed=Schema[key]
		let table=Schema["ref"] //默认主表
		let map=filed["map"]
		let ref=Schema[key]["ref"]
		let type=filed["type"]
		key=SqlKeywordCheck(key)

		if(!typeCheck.isUndefined(ref)) //存在附表 则使用附表
		{
			table=ref.Schema["ref"]
			type=ref.Schema[map]["type"]
			map=ref.Schema[map]["map"]

			if(!leftJion[table]) //如果不存在 表引用关系 则添加
			{
				let ref_filed=filed["ref_filed"]
				let c=""
				if(ref_filed) 
					c=`${Schema["ref"]}.${Schema[ref_filed[0]]["map"]}=${table}.${ref.Schema[ref_filed[1]]["map"]}`
				else
					c=`${Schema["ref"]}.${Schema["_id"]["map"]}=${table}.${ref.Schema["_id"]["map"]}`
				leftJion[table]=c
			}
		}

		if(typeCheck.isUndefined(map)) //不存在表映射，使用默认值
		{
			if(type===String)
				fieldSql+=`'${filed["default"]}' as ${key},`
			else
				fieldSql+=`${filed["default"]} as ${key},`
		}
		else
		{

			if(type===Date)
				fieldSql+=`DATE_FORMAT(${table}.${map},'${filed["DATE_FORMAT"]}') as ${key},`
			else
				fieldSql+=`${table}.${map} as ${key},`
		}
	}

	fieldSql=fieldSql.substr(0,fieldSql.length-1)+" from " + Schema["ref"];

	for(let key in leftJion)
		fieldSql+=` left join ${key} on ${leftJion[key]}`
	return {sql:fieldSql,join:leftJion}
}

function AssembleData(Schema,data,projection) {
	var tempData={}

	let isLimit=false	//是否字段限制
	let isLimitIn=true      //限制状态

	if(!typeCheck.isEmpty(projection))
	{
		isLimit=true
		isLimitIn=projectionCheckIn(projection)
	}


	for(let key in data)
	{
		if(isLimit){
			if(isLimitIn&&(typeCheck.isUndefined(projection[key])||projection[key]!=1))  //为1组装，反之不
				continue
			if(!isLimitIn&&projection[key]==0) //为0不组装，反之组装
				continue
		}

		let filed=Schema[key]
		let map=filed["map"]
		
		if(typeCheck.isUndefined(map)) //不存在表映射，跳过
			continue
		else{

			let ref=filed["ref"]

			if(ref)
				map=ref.Schema[map]["map"]				

			tempData[map]=data[key]
		}
			
	}

	return tempData
}


function AssembleUpdate(Schema,conditions,options) {


	let dataSql=""

	for(let op in options){
		if(op=="$set")
		{
			let data=options[op]

			for(let k in data){

				let filed=Schema[k]
				let map=filed["map"]

				if(typeCheck.isUndefined(map)) 
					continue;
				if(!typeCheck.isUndefined(filed["ref"])) 
					continue;					

				if(filed["type"]===String)
					dataSql+=`${map}='${data[k]}',`
				else
					dataSql+=`${map}=${data[k]},`
			}
		}
	}

	dataSql=dataSql.substr(0,dataSql.length-1);
	let where=AssembleWhere(Schema,conditions).sql
  return `UPDATE ${Schema["ref"]} SET ${dataSql} ${where}`
}

module.exports.AssembleFind = AssembleFind
module.exports.AssembleWhere = AssembleWhere
module.exports.AssembleCount = AssembleCount
module.exports.AssembleField = AssembleField
module.exports.AssembleData = AssembleData
module.exports.AssembleUpdate = AssembleUpdate







