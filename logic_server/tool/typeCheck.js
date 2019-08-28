


 //   var   gettype=Object.prototype.toString
 //            var test=""
 //          console.log(gettype.call(test))
 //          test="aaa"
 //          console.log(gettype.call(test))
 //           test=2

 //          console.log(gettype.call(test))
 //          test=[]
 //          console.log(gettype.call(test))
 //           test=[1,2]
 //          console.log(gettype.call(test))
 // test={}
 //          console.log(gettype.call(test))
 // test={aa:1}

 //          console.log(gettype.call(test))
 //           test=null

 //                      console.log(gettype.call(test))
 //           test=function(){}

 //          console.log(gettype.call(test))

 //          test=function(a,b){return a+b}
 //          console.log(gettype.call(test))
 //                       test=false

 //                      console.log(gettype.call(test))

 //                        console.log(typeof({}))
 //                        console.log(typeof([]))
 //                                              console.log(typeof(test2))

 //                      console.log(gettype.call(test2))

function _isNull(vaule)
{
    var  gettype=Object.prototype.toString
    if(gettype.call(vaule)==="[object Null]")
        return true
    return false
}

function _isUndefined(vaule)
{
    if(typeof(vaule)==="undefined")
        return true
    return false
}

exports.isString=function (vaule)
{
    if(typeof(vaule)==="string")
        return true
    return false
}

exports.isBoolean=function (vaule)
{
    if(typeof(vaule)==="boolean")
        return true
    return false
}

exports.isNumber=function (vaule)
{
    if(typeof(vaule)==="number")
        return true
    return false
}

exports.isUndefined=_isUndefined

exports.isObject=function (vaule)
{
    if(typeof(vaule)==="object")
        return true
    return false
}

exports.isNull=_isNull

exports.isArray=function (vaule)
{
    var  gettype=Object.prototype.toString
    if(gettype.call(vaule)==="[object Array]")
        return true
    return false
}

exports.isStrictObject=function (vaule)
{
    var  gettype=Object.prototype.toString
    if(gettype.call(vaule)==="[object Object]")
        return true
    return false
}

exports.isEmpty=function (vaule)
{
    if(_isNull(vaule))
        return true
    if(_isUndefined(vaule))
        return true
    return false
}