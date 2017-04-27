/*任务解析包*/

//nodejs 路径 (Path)
var path=require('path');

//路径解析
var pathParse=require('../pathParse');

var make=require('../make');

var task=function(type){
    return function(task,config){
        for(var key in task){
            var src=pathParse.src(task[key].src,config);
            var dest=pathParse.dest(task[key].dest,src,config);

            //检查路径是否有问题
            if(!src || !dest){
                //console.log(JSON.stringify(task[key]).yellow,'配置路径错误');
                continue;
            }
            //路径规范化
            src=path.normalize(path.resolve(src));
            dest=path.normalize(path.resolve(dest));

            switch (type){
                case 'js':
                    //编译js文件
                    make.js(src,dest,task[key],config);
                    break;
                case 'less':
                    //编译js文件
                    make.less(src,dest,task[key],config);
                    break;
            }
        }
    }
};


module.exports={
    js:task('js'),
    less:task('less')
};
