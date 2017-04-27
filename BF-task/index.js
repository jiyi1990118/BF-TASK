/**
 * Created by xiyuan on 2014/12/16.
 */
//颜色包
var colors=require('colors/lib');

//命令行参数解析
var args=require('./lib/flag');

//命令解析
var cmd=require('./lib/cmd');

//对外开放的接口
module.exports=function(config){
    cmd(args,config);
};

