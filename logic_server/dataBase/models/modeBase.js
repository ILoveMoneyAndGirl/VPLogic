// 0删除 1正常 2冻结
const buildSql = require("../buildSql");
const utils = require("../utils");
const typeCheck  = require('../../tool/typeCheck');
// const BuildServer = require("../buildServer");

// conditions：查询条件；projection：控制返回的字段；options：控制选项；callback：回调函数。
function ModeBase (data) {
	if (!(this instanceof ModeBase)) {
        return new ModeBase(data);
    }
	this._sql=""
	this._limitSart=0
	this._limitEnd=20
	this._data=data
}

//排序
ModeBase.prototype.sort = function(arg) {
	let sortSql=""
	for(let key in arg)
	{
		let map=this.Schema[key]["map"]

		if(typeCheck.isUndefined(map)) //不存在表映射，跳过条件
			continue
		if(!typeCheck.isUndefined(this.Schema[key]["ref"])) //引用其它表不排序
			continue
		if(arg[key]==-1)
			sortSql+= `${this.Schema["ref"]}.${map} DESC,`
		else
			sortSql+= `${this.Schema["ref"]}.${map},`
	}

	if(sortSql.length>0)
		sortSql=" ORDER BY "+sortSql.substr(0,sortSql.length-1);
	this._sql+=sortSql;
};


// 限制数量
ModeBase.prototype.limit = function(arg) {
	this._limitEnd=arg
	this._sql+=` limit ${this._limitSart},${this._limitEnd}`; 
};

ModeBase.prototype.call= function(data){
	this._data=data
}


ModeBase.prototype.test = function(conditions,projection,options,callback) {

	console.log("------------------")
	console.log(utils.AssembleFind(this.Schema,conditions,projection));
	console.log(utils.AssembleCount(this.Schema,conditions,projection));

}


// 跳过数量
ModeBase.prototype.skip = function(arg) {
	this._limitSart=arg
};

//获取数量
ModeBase.prototype.count = function(conditions,projection) {

    this._sql=utils.AssembleCount(this.Schema,conditions);

	return new Promise((resolve, reject) => {
		buildSql.BuildSql(this._sql,[],function(err,res){
			if(err)
			{
				reject(err);
			}
			else
			{
				resolve(parseInt(res[0]["count"]));
			}
	 	});
	})
	return p
};

ModeBase.prototype.findOne=function(conditions,projection,options,callback) {

    this._sql=utils.AssembleFind(this.Schema,conditions,projection) +" LIMIT 1";

	let p=new Promise((resolve, reject) => {
    		setTimeout(()=>{
    			buildSql.BuildSql(this._sql,[],function(err,res){
							if(err)
							{
								reject(err);
							}
							else
							{
								if(res.length==1)
									resolve(res[0]);
								else
									resolve(false);
							}
				});
    		})
		})

		return p
}

// 查找
ModeBase.prototype.find = function(conditions,projection,options,callback) {
    this._sql= utils.AssembleFind(this.Schema,conditions,projection) 

	let p=new Promise((resolve, reject) => {
    		setTimeout(()=>{
    			buildSql.BuildSql(this._sql,[],function(err,res){
						if(err)
						{
							reject(err);
						}
						else
						{
							resolve(res);
						}
				});
    		})
		})

		p.sort=(arg)=>{
			this.sort(arg)
			return p
		}
		p.skip=(arg)=>{
			this.skip(arg)
			return p
		}

		p.limit=(arg)=>{
			this.limit(arg)
			return p
		}

		return p
}


ModeBase.prototype.save=function() {

	let p=new Promise((resolve, reject) => {
			if(typeCheck.isUndefined(this._data))
			{
				resolve(0)
			}else
			{
				let saveSql=`INSERT INTO ${this.Schema["ref"]}`
				let filedSql=`(`
				let valueSql=`(`

				for( var key in this._data){
					if(!typeCheck.isUndefined(this.Schema[key]["ref"])) //不存在表映射，跳过
						continue
					let map=this.Schema[key]["map"]
					let type=this.Schema[key]["type"]
					if(typeCheck.isUndefined(map)) //不存在表映射，跳过
						continue
					filedSql+= map+","

					if(type===String)
						valueSql+="'"+this._data[key]+"',"
					else
						valueSql+=this._data[key]+","
				}

				valueSql=valueSql.substr(0,valueSql.length-1)+")"
				filedSql=filedSql.substr(0,filedSql.length-1)+")"

				saveSql=`　${saveSql} ${filedSql} VALUES ${valueSql}`

				buildSql.BuildSql(saveSql,[],function(err,res){
					if(err)
						reject(err);
					else
						resolve(res);
				});
			}

		})
	return p
}


ModeBase.prototype.remove=function(conditions,options) {

	let removeSql=`DELETE FROM ${this.Schema["ref"]} `
	
	let whereSql=utils.AssembleWhere(this.Schema,conditions)
	this._sql=removeSql+whereSql

	let p=new Promise((resolve, reject) => {
			buildSql.BuildSql(this._sql,[],function(err,res){
				if(err)
					reject(err);
				else
					resolve(res);
			});
		})

	return p
}


ModeBase.prototype.findOneAndUpdate=function(conditions,options) {

	let sql=utils.AssembleUpdate(this.Schema,conditions,options)
	let mask={_id:1}
	let data=utils.AssembleData(this.Schema,conditions,mask)
	let cmd=this.Refresh
	let p=new Promise((resolve, reject) => {
		buildSql.BuildSql(sql,[],function(err,res){
				if(err)
				{
					reject(err);
				}
				else
				{	resolve(res);
				}
		 });
	})
	return p

}


ModeBase.__proto__=ModeBase.prototype


module.exports = ModeBase;


