#用于javascript项目打包
   ### 使用配置如 makeFile.js

   ### 使用命令
	`node makeFile make:js 		//编译配置中所有js`
	`node makeFile make:js:core 	//编译配置中的core`
	
	
### js文件中引用其他文件内容 示例：

	/*@make : start*/

	new function ($FRAME) {

			/*公共代码*/
			Include('comm/index.js');

			/*内部框架处理代码*/
			Include('inside/index.js');

			/*框架渲染引擎*/
			Include('engine/index.js');

			/*应用初始化*/
			Include('init/index.js');

			/*第三方扩展*/
			Include('init/extend/index.js');
	}(
   		 /*框架接口*/
    		window.$FRAME = {}
	);

	//@make : end


###代码引用

`//@make : start     `申明引用开始

`Include('init/index.js'); ` 方法引入指定的文件内容插入此处

`//@make : end  `/提示引用结束

案例 example.js


