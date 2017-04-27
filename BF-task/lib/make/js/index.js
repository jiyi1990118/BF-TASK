//js解析编译包

//文件包引入
var fs=require('fs');

//nodejs 路径 (Path)
var Path=require('path');

//js注释清除
var clearNote=require('./parse/clearNote');

//代码压缩
var UglifyJS = require("uglify-js");

//代码美化
var jsbeautifier = require("./lib/jsbeautifier");

//读取Include的文件
var readInclude=function(content,path){
    var fileFlag=true;
    content= content.replace(/Include\((["'])([\S]+)\1\)[\s]*;?/g,function(){
        //采用同步读取Include的文件
        var src=Path.normalize(Path.dirname(path)+'/'+Path.normalize(arguments[2]));
        try{
            var code=fs.readFileSync(src,{encoding:'utf8'}).replace(/;[\s]*$/,'')+';';
            return parseMake(code,src);
        }
        catch (e){
            fileFlag=false;
            console.log(path.blue,'Include文件'.yellow,src+'不存在！'.red);
        }
    });
    return fileFlag && content;
};

//读取需要编译的内容
var parseMake=function(content,path){
    var fileFlag=true;
    //获取内容中需要解析的代码
    content=content.replace(/[\s]*\/\/[\s]*@make[\s]*:[\s]*start[\s]+?[\S]*[\r\n]+([\s\S]+?)[\s]*\/\/[\s]*@make[\s]*:[\s]*end[\s]*[\S]*[\r\n]?/ig,function(reg,$1){
        //提取需要编译内容中的Include
        var res=readInclude(clearNote.removeNote($1),path);
        return  typeof res === "boolean"? (fileFlag=false):res;
    });
    return fileFlag && content;
};

//读取引导页面的内容
var readBoot=function(path,callback){
        //文件异步读取（让当前任务异步执行）
        fs.readFile(path,{encoding:'utf8'}, function (err, content) {
            //检查文件是否存在
            if (err){
                console.log(path+'文件路径错误'.red)
            }
            //获取内容中需要解析的代码
            content=parseMake(content,path);

            typeof callback === "function" && callback(content)
        })
};

//内容写入
var writeFile=function(dest,content,src){
    //创建目录
    !function(dest){
        fs.existsSync(Path.dirname(dest)) || arguments.callee(Path.dirname(dest));
        fs.existsSync(dest)|| fs.mkdirSync(dest);
    }(Path.dirname(dest));

    //写入内容到文件中
    fs.writeFile(dest,content,function(err){
        err ?
            console.log(dest+'文件写入失败!'):
            console.log('<-----------文件编译成功--------->\r\n'.green+
        '源文件'.yellow+src.blue+'\r\n'+
        '生成的文件:'.yellow+dest.red);
    })
};

//js解析运行入口
var makeRun=function(src,dest,task,config){
    readBoot(src,function(content){
        if(typeof content === "boolean"){
           return console.log(src,'文件编译失败'.red)
        }

        switch (task.mode){
            case 'c':
                //压缩core.js中所有代码
                content=UglifyJS.minify(content, {
                    fromString: true,
                    mangle:{
                        except:['$','require','exports']
                    }
                }).code;
                break;
            case 'b':
                //js代码美化
                content=jsbeautifier.js_beautify(content);
                break
        }

        writeFile(dest,content,src);
    });
};

module.exports=makeRun;