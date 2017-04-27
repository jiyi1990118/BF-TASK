/*编译包*/

//js编译包
var parseJs=require('./js');

//less编译包
var parseLess=require('./less');

var makeJs=function(src,dest,config){
    parseJs(src,dest,config);
};

var makeLess=function(src,dest,config){
    parseLess(src,dest,config);
};

module.exports={
    js:makeJs,
    less:makeLess
};
