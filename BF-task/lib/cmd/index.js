/*cmd 命令解析包*/

//配置解析包
var configParse=require('../configParse');

//cmd命令执行
var cmdParse=function(args,config){
    var cmd=args[1];

    if(cmd.match(/^make$/i)){
        /*编译所有*/
        configParse.makeTask(args,config);
    }else if(cmd.match(/^make:js(?::[\w]+)?$/i)){
        /*编译js*/
        configParse.jsTask(args,config);
    }else if(cmd.match(/^make:less(?::[\w]+)?$/i)){
        /*编译less*/
        configParse.lessTask(args,config);
    }else{
        console.log('【use】:'.bgBlue);            //使用方法
        console.log('\tmake'.yellow);              //编译less、js
        console.log('\tmake:js'.yellow);           //编译js
        console.log('\tmake:less '.yellow);        //编译less
    }
};

module.exports=function(args,config){
    cmdParse(args,config);
};
