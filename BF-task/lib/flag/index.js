/**
 * Created by xiyuan on 2015/3/14.
 */
//参数解析
var args=process.argv.slice(1);;
for(var i in args){
    args[i]=args[i].toString();
}

module.exports=args;