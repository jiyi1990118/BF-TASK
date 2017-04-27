/*路径解析*/

//nodejs 路径 (Path)
var Path=require('path');

//错误日志包
var err=require('../errorMsg');

//解析路径中的变量
var parseConfig=function(path,config){
    var flag=true;
    path=path.replace(/\{[\s]*([^\s\}]+)[\s]*\}/g,function(reg,$1){
        $1=$1.replace(/\[([\S]+)\]/g,function(reg,$1){
            return '.'+$1;
        });

        var attrs=$1.split('.');
        var value=config;
        for(var attr in attrs){
            value=value[attrs[attr]];
            if(typeof value === "undefined"){
                err.log(err.config.pathErr,reg,'中', attrs[attr].yellow+'属性不存在！');
                flag=false;
                break;
            }
        }
        return value;
    });

    return flag?path:false;
};

//dest路径中的系统文件变量解析
var parseFileVar=function(path,src){
    var flag=true;
    path=path.replace(/\{:[\s]*([^\s\}]+)[\s]*\}/g,function(reg,$1){
        switch ($1){
            //获取路径根目录
            case 'root':
                //$1=src.match(/^[\S]*?\//)[0];
                $1=Path.resolve();
                break;
            //获取路径部分
            case 'dir':
                $1=src.match(/^([\S]+)\/[\S]+$/)[1];
                break;
            //获取路径path部分
            case 'path':
                $1=src.match(/^[\S]*?\/([\S]+)\/[\S]+$/)[1];
                break;
            //获取路径中文件名称部分
            case 'file':
                $1=src.match(/^[\S]+\/([^\s]+)$/)[1];
                break;
            //获取路径中文件名部分
            case 'name':
                $1=src.match(/^[\S]+\/([^\s\.]+)[\S]*$/)[1];
                break;
            //获取路径中文件后缀
            case 'suffix':
                $1=src.match(/^[\S]+\/[^\s\.]+([\S]*)$/)[1];
                break;
            //获取当前时间戳
            case 'time':

                break;
            //获取自定义格式化时间
            case 'date':

                break;
            //获取随机数
            case 'random':

                break;
            //匹配不到的处理
            default :
                flag=false;
                err.log(err.config.pathErr,reg,'中', $1.yellow+'属性不存在！');
        }
        //console.log($1);
        return $1;
    });
    return flag?path:false;
};



var parseSrc=function(src,config){
    src=parseConfig(src,config);
    return src;
};

var parseDest=function(dest,src,config){
    if(!src){
        return false;
    }
    dest=parseFileVar(dest,src);
    dest=parseConfig(dest,config);
    return dest;
};

module.exports={
    src:parseSrc,
    dest:parseDest
};