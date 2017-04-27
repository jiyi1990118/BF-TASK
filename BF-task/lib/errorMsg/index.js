/**
 * Created by xiyuan on 2015/3/14.
 */
var config={
    name:'【配置】'.yellow,
    task:'任务配置错误'.red,
    taskVoid:'无有效任务配置'.red,
    taskVoidJs:'无有效Js任务配置'.red,
    taskVoidLess:'无有效Less任务配置'.red,
    pathErr:'路径配置错误'.red
};

var log=function(){
    console.log.apply(this,arguments)
};


module.exports={
    config:config,
    log:log
};
