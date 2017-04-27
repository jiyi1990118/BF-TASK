// 编译包
var run=require('BF-task');

//编译配置
config={
    option:{
        path:{
            src:'./src/frame',
            dest:'./frame'
        }
    },
    task:{
        js: {
            boot: {
                src: '{option.path.src}/boot.js',
                dest: '{option.path.dest}/{:name}{:suffix}',
                mode: 'b'    //b:美化   c:压缩
            },
            core: {
                src:'{option.path.src}/core/index.js',
                dest:'{option.path.dest}/core/{:name}{:suffix}',
                mode: 'b'
            },
            plugins: {
                src:'{option.path.src}/plugins/index.js',
                dest:'{option.path.dest}/plugins/{:name}{:suffix}',
                mode: 'b'
            },
            gui: {
                src:'{option.path.src}/gui/index.js',
                dest:'{option.path.dest}/gui/{:name}{:suffix}',
                mode: 'c'
            }
        }
    }
};

run(config);

