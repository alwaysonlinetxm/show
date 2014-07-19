/** ------------------------------------------------------------------------------
* TStyle
* @version 1.0
* @explain 封装了一些底层功能的js API以及一些js内置类的扩展
* @author  alwaysonlinetxm
* @email   txm19921005@126.com 
* --------------------------------------------------------------------------------
*/

/** 
* 选择器以及功能函数的宿主函数
* @explain 接收以'#','.'开头或不带前缀的字符串，分别获取对应id，class以及tag的元素/元素列表
* @param   以'#','.'开头的id，class或不带前缀的tag
* @return  参数字符串所对应的元素/元素列表
*/
function $(selector, ele){
	if (selector.match(/^#.+/)){ //简单的id匹配
		return document.getElementById(selector.slice(1));
	} else if (ele != undefined){
	    //修复选择器可以包括父级的bug
		var old = ele.id, id = ele.id = "__sizzle__";
		try {
			var query = '#' + id + ' ' + selector;
			return ele.querySelectorAll(query);
		} catch(e) {
		} finally {
			old ? ele.id = old : ele.removeAttribute("id");
		}
	} else {
		return document.querySelectorAll(selector);
	}
}

/**
* 事件注册
* @explain 为指定元素注册指定的事件
* @param   待注册的元素，待注册的事件类型字符串，绑定的函数
* @return  无
* PS：该函数可为单个元素的同个事件注册绑定多个函数，同时不支持addEventListener和attachEvent除外
*/
$.on = function(elem, type, func){
    if (elem.addEventListener){
        elem.addEventListener(type, func, false);
    } else if (elem.attachEvent){
        elem.attachEvent('on'+type, func);
    } else {
	    elem["on"+type] = func;
	}
}

/**
* 样式获取
* @explain 获取指定元素的当前CSSStyleDeclaration对象，适用于内联样式，内部样式，外部样式
* @param   待配置的元素，第二个可选的伪元素信息
* @return  元素的CSSStyleDeclaration对象
*/
$.getStyle = function(obj, fake){
	fake = fake ? fake : null;
    return window.getComputedStyle ? window.getComputedStyle(obj, fake) : obj.currentStyle;
}

/**
* class添加/删除/检测/转换
* @explain 添加/删除/检测/转换class
* @param   待操作的元素以及待添加/删除/检测/转换的类名
* @return  无
*/
//添加类
$.addClass = function(ele, className){
    if (!new RegExp('(^|\\s+)'+className).test(ele.className)){
		ele.className += " " + className;
	}
}
//删除类
$.removeClass = function(ele, className){
    ele.className = ele.className.replace(new RegExp('(^|\\s+)'+className), "");
}
//检测类
$.hasClass = function(ele, className){
    var regExp = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
    return regExp.test(ele.className);
}
//转换类
$.toggleClass = function(ele, className){
    if ($.hasClass(ele, className)){
        $.removeClass(ele, className);
    } else {
        $.addClass(ele, className);
    }
}

/**
* 兄弟节点获取
* @explain 获取指定节点的前/后兄弟节点，跳过文本
* @param   指定的节点
* @return  前/后兄弟节点
*/
//获取前兄弟节点
$.previousNode = function(ele){
	var pre = ele.previousSibling;
	while (pre.nodeName == "#text"){
		pre = pre.previousSibling;
	}
	return pre;
}
//获取后兄弟节点
$.nextNode = function(ele){
	var next = ele.nextSibling;
	while (next.nodeName == "#text"){
		next = next.nextSibling;
	}
	return next;
}

/**
* 获取页面被卷去部分
* @explain 获取页面被滚动条卷去的高度/宽度
* @param   无
* @return  卷去的高度/宽度
* PS：http://hi.baidu.com/alimyself/item/69a7c5fca55495e41b111ff7
*/
//卷去的高度
$.getScrollTop = function(e){
	return Math.max(
		(document.body?document.body.scrollTop:0),
		(document.documentElement?document.documentElement.scrollTop:0),
		(window.pageYOffset?window.pageYOffset:0)
	);   
}
//卷去的宽度
$.getScrollLeft = function(e){
	return Math.max(
		(document.body ? document.body.scrollLeft : 0),
		(document.documentElement ? document.documentElement.scrollLeft : 0),
		(window.pageYOffset ? window.pageXOffset : 0)
	); 
}

/**
* 获取鼠标事件坐标
* @explain 获取鼠标事件发生时相对于事件触发元素的坐标
* @param   事件对象e，可选参数nonborder，可指定是否把border计算在内，传入true等真值是不计算border在内
* @return  坐标x/y
* PS：http://www.feelcss.com/firefox-support-offsetx-and-offsety.html
*/
//横坐标
$.getOffsetX = function(e, nonborder){
	if (e.offsetX){
		if (nonborder){
			if ($.browser() == "MSIE"){ //IE下offsetX本身就不包括border
				return e.offsetX;
			} else {
				return e.offsetX - $.getStyle(e.target).borderLeftWidth.slice(0, -2);
			}
		} else {
			if ($.browser() == "MSIE"){ 
				return e.offsetX + $.getStyle(e.target).borderLeftWidth.slice(0, -2)*1;
			} else {
				return e.offsetX;
			}
		}
	} else {
		var x1 = e.pageX ? e.pageX : $.getScrollLeft() + e.clientX;
		var ele = e.target;
		var x2 = ele.offsetLeft;
		while (ele.offsetParent){
			ele = ele.offsetParent;
			x2 += ele.offsetLeft;
		}
		return nonborder ? x1 - x2 - $.getStyle(e.target).borderLeftWidth.slice(0, -2) : x1 - x2;
	}
}
//纵坐标
$.getOffsetY = function(e, nonborder){
	if (e.offsetY){
		if (nonborder){
			if ($.browser() == "MSIE"){ //IE下offsetX本身就不包括border
				return e.offsetY;
			} else {
				return e.offsetY - $.getStyle(e.target).borderTopWidth.slice(0, -2);
			}
		} else {
			if ($.browser() == "MSIE"){ 
				return e.offsetY + $.getStyle(e.target).borderTopWidth.slice(0, -2)*1;
			} else {
				return e.offsetY;
			}
		}
	} else {
		var y1 = e.pageY ? e.pageY : $.getScrollTop() + e.clientY;
		var ele = e.target;
		var y2 = ele.offsetTop;
		while (ele.offsetParent){
			ele = ele.offsetParent;
			y2 += ele.offsetTop;
		}
		return nonborder ? y1 - y2 - $.getStyle(e.target).borderTopWidth.slice(0, -2) : y1 - y2;
	}
}

/**
* 获取变量类型
* @explain 获取传入参数变量的类型，参数为对象时，内置对象会获得特定类型，自定义对象统一为object
* @param   待获取类型的对象
* @return  对象的类型，以字符串形式
*/
$.getType = function(obj){
	var t = typeof obj;
    return (t == "object" ? obj == null && "null" || Object.prototype.toString.call(obj).slice(8,-1) : t).toLowerCase();
}

/**
* 简单深拷贝
* @explain 深拷贝一个对象，效率较高，但不适用对象的function属性，Date属性，RegExp属性
* @param   待拷贝的对象
* @return  拷贝后的新对象
*/
$.deepCopy = function(obj){
    return JSON.parse(JSON.stringify(obj));
}

/**
* 递归深拷贝
* @explain 递归地深拷贝一个对象，效率较低，但适用对象的function属性，Date属性，RegExp属性
* @param   待拷贝的对象
* @return  拷贝后的新对象
*/
$.extend = function(source, destination){
	var ret = false;
	if (destination == undefined){
		destination = $.getType(source) == 'array' ? [] : {};
		ret = true;  //需要返回值
	}
    for(var key in source){
		var type = $.getType(source[key]);
		switch (type){
			case 'array': destination[key] = [];
				arguments.callee(source[key], destination[key]);
				break;
			case 'object': destination[key] = {};
				arguments.callee(source[key], destination[key]);
				break;
			case 'date': 
			case 'regexp': 
				destination[key] = source[key].copy();
				break;
			default: destination[key] = source[key];
		}
	}
	if (ret){
		return destination;
	}
}

/**
* 对象继承
* @explain 继承指定的对象
* @param   待继承的对象
* @return  继承后的对象
*/
$.inherit = function(pro){
    if (pro == null) throw TypeError();
	//存在Object.create则直接调用，参数为要创建对象的原型
	if (Object.create) return Object.create(pro); 
	
	var type = typeof pro;
	if (type !== 'object' && type != 'function') throw TypeError();
	//定义构造函数，以此来创建新对象，以{}创建的对象具有Object.prototype原型
	function func(){};
	func.prototype = pro;
	return new func();
}

/**
* 浏览器类型判断
* @explain 获取浏览器类型
* @param   无
* @return  浏览器类型字符串
*/
$.browser = function(){
    if (navigator.userAgent.indexOf("MSIE") >= 0){
        return "MSIE"; 
    }
    if (navigator.userAgent.indexOf("Firefox") >= 0){
        return "Firefox"; 
    }
    if (navigator.userAgent.indexOf("Opera") >= 0){
        return "Opera"; 
    }
	if (navigator.userAgent.indexOf("Chrome") >= 0){
        return "Chrome"; 
    }
    if (navigator.userAgent.indexOf("Safari") >= 0) { 
        return "Safari"; 
    } 
    if (navigator.userAgent.indexOf("Camino") >= 0){ 
        return "Camino"; 
    } 
    if (navigator.userAgent.indexOf("Gecko") >=0 ){ 
        return "Gecko"; 
    } 
}

/**
* canvas检测
* @explain 检测是否支持canvas元素
* @param   无
* @return  支持则返回ture，否则返回false
*/
$.isCanvasEnable = function(){
    return !!document.createElement('canvas').getContext;
}

/**
* 文件类型匹配
* @explain 将传入文件名与指定后缀名进行匹配，判断类型是否匹配
* @param   fname为文件名(可包含路径)，参数types为包含允许类型的数组，如["jpg", "png", "gif"]
* @return  匹配则返回ture，否则返回false
*/
$.checkFileType = function(fname, types){
    var last = fname.slice(fname.lastIndexOf(".")+1).toLowerCase();
	for (var key in types){
	    if (last == types[key].toLowerCase()) return true;
	}
	return false;
}

/**
* 随机颜色获取
* @explain 随机获取颜色
* @param   无
* @return  颜色十六进制表示值
*/
$.getRandomColor = function(){
	return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
}

/**
* 属性配置
* @explain 对指定对象的指定属性进行属性配置，配置值、可枚举性、可写性、可配置性
* @param   待配置得对象，要配置的属性数组(可选)，属性配置对象
* @return  配置完的对象
* PS：当不指定任何属性时，默认对所有属性进行配置
*/
$.config = function(obj){
    if (typeof obj == "object"){
		if (arguments.length == 2){
			var names = Object.getOwnPropertyNames(obj);
			var configs = arguments[1];
		} else if (arguments.length == 3 && Array.isArray(arguments[1])){
		    var names = arguments[1];
			var configs = arguments[2];
		}		
		names.forEach(function(n){   //检测是否有此自有属性，有则进行设置
		    if (obj.hasOwnProperty(n)) Object.defineProperty(obj, n, configs);
		});
	}
	return obj;
}

/***************************************************** 原生类扩展 *****************************************************/ 

/**
* Date类扩展
* @explain 规格化日期格式为 YY-MM-DD hh:mm:ss
* @param   无
* @return  规格化后的日期字符串
*/
Date.prototype.shortFormat = function() {
	var hours = "0" + this.getHours();
    var mins = "0" + this.getMinutes();
    var secs = "0" + this.getSeconds();
	
    if(hours > 9)
	   hours = this.getHours();
    if(mins > 9)
	   mins = this.getMinutes();
    if(secs > 9)
	   secs = this.getSeconds();

    return this.getFullYear() + "-" + (this.getMonth()+1)+ "-" + this.getDate() + " " + hours + ":" + mins + ":" + secs;
}

/**
* Date类扩展
* @explain 拷贝当前Date对象
* @param   无
* @return  当前Date对象的拷贝
*/
Date.prototype.copy = function() {
	return new Date(this.getTime());
}

/**
* RegExp类扩展
* @explain 拷贝当前RegExp对象
* @param   无
* @return  当前RegExp对象的拷贝
*/
RegExp.prototype.copy = function() {
	var gim = ""; 
	if (this.global) {
		gim += "g";
	}
	if (this.ignoreCase) {
		gim += "i";
	}
	if (this.multiline) {
		gim += "m";
	}
	return new RegExp(this.source, gim);
}

/**
* String类扩展
* @explain 去除字符串的前导，后导空格
* @param   无
* @return  去除空格后的字符串
*/
//除去前后空格
String.prototype.Trim = String.prototype.trim || function(){ 
    return this.replace(/(^\s*)|(\s*$)/g, ""); 
} 
//除去前导空格
String.prototype.LTrim = function(){ 
    return this.replace(/(^\s*)/g, ""); 
}
//除去后导空格 
String.prototype.RTrim = function() { 
    return this.replace(/(\s*$)/g, ""); 
}