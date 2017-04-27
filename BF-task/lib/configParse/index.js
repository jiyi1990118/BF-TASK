/*配置解析包*/

//错误消息配置包
var err=require('../errorMsg');

//任务解析包
var taskParse=require('../taskParse');

var check=function(config,callback,checkType,args){
    //检查配置是否正确
    if(typeof config.task === "object"){
        var task=config.task;
        var jsFlag=null;
        var lessFlag=null;
        var cmd=args[1];
        var type=checkType;

        //任务分配
        if(cmd.match(/^make$/i)){
            /*编译所有*/
            //检查任务类型
            for(var key in task){
                switch (key){
                    case 'js':
                        type=jsFlag='js';
                        break;
                    case 'less':
                        type=lessFlag='less';
                        break;
                }
                callback(type,task[key],config);
            }

        }else if(cmd.match(/^make:\w+(?::\w+)?$/i)){

            var cmdMatch=cmd.match(/^make:\w+:(\w+)$/i);
            var cmdChild=cmdMatch && cmdMatch[1];

            try{
                var task=cmdChild ? new Array(task[type][cmdChild]) : task[type];
                if(task){
                    lessFlag=jsFlag=type;
                    callback(type,task,config)
                }
            }
            catch (e){
                console.error(cmd+'任务配置不存在！')
            }
        }

        //检查是否有效的任务配置
        if(!type){
            err.log(err.config.name,err.config.taskVoid)
        }else if(!jsFlag && checkType== 'js'){
            err.log(err.config.name,err.config.taskVoidJs)
        }else if(!lessFlag && checkType== 'less'){
            err.log(err.config.name,err.config.taskVoidLess)
        }
    }else{
        err.log(err.config.name,err.config.task)
    }
};

var jsTask=function(type,task,config){
    type=== 'js' && taskParse.js(task,config);
};

var lessTask=function(type,task,config){
    type=== 'less' && taskParse.less(task,config);
};

var makeTask=function(type,task,config){
    switch (type){
        case 'js':
            taskParse.js(task,config);
            break;
        case 'less':
            taskParse.less(task,config);
            break;
    }
};

module.exports={
    jsTask:function(args,config){
        check(config,jsTask,'js',args);
    },
    lessTask:function(args,config){
        check(config,lessTask,'less',args);
    },
    makeTask:function(args,config){
        check(config,makeTask,'',args);
    }
};
