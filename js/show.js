//图片缓存对象
var imgCache = [];
//图片列表
var imgList = ['lxy','zle','lyr','an','wxh','sm','sqs','liyr','jt','txj','llk','hlk','zx','xcq','cl','ngh','wh','wpx','xx','lyg','hls','yth','lml','mrzy','jyf','tyr','ly','xm','x','xhjx','mcl','xcx','jc','hfz','jl','liy','lb','lm','blts','fqx','fls','xl','yqs','hy','zy','wry','ywy','ar','xyz'];
//当前图片索引
var imgIndex = 0;
//初始化
window.onload = function(){
	imgLoad();
	
	$("#large_list").onmousemove = function(e){ slide(e, "large_list", 230, 460, 60); };
	$("#short_list").onmousemove = function(e){ slide(e, "short_list", 250, 450, 50); };
	
	for (var i = 0; i < $(".subList_check").length; i++){
		$(".subList_check")[i].onclick = function(e){
			var list = $.nextNode($.nextNode(e.target));
			if ($.getStyle(list).width.slice(0, -2) > 100){
				e.target.checked = false;
			}
		}
	}
	for (var i = 0; i < $(".subList_img").length; i++){
		$(".subList_img")[i].onmousemove = function(e){
		    //控制在48%-52%之间
			e.target.style.backgroundPosition = 48  + Math.floor((1 - $.getOffsetX(e)/150)*4) + "%";
		}
		$(".subList_img")[i].onclick = function(e){
		    //放上遮罩
			$("#mask").style.display = "block";
			
			$.addClass(e.target.parentNode, "w0");
			
			var attach = document.createElement('li');
			attach.className = "attachList";
			e.target.parentNode.parentNode.insertBefore(attach, e.target.parentNode);
			var width = document.body.clientWidth - 60;
			$("#large_list").style.transition = "all 1.5s ease-in";
			
			setTimeout(function(){ 
				attach.style.width = width*2 + "px"; 
				$("#large_list").style.left = $("#large_list").style.left.slice(0, -2) - width + "px"; 
				$("#large_list").style.opacity = 0;
				setTimeout(function(){ 
					//恢复点击而缩小的图片list
					$.removeClass(e.target.parentNode, "w0");
					
					$("#large_list").style.transition = "all 0.7s ease-out";
					e.target.parentNode.parentNode.removeChild(attach);
					//撤出遮罩
					$("#mask").style.display = "none";
					//隐藏box
					$("#box").style.opacity = 0;
					setTimeout(function(){ 
					    $("#box").style.display = "none"; 
						//显示舞台
						$("#stage").style.display = "block";
						//设置要显示的图片
						$("#image").src = "images/" + e.target.id + ".png";
						//设置图片索引
						imgIndex = imgList.indexOf(e.target.id);
						//$("#image").onload = function(){
						setTimeout(function(){
							$("#image").style.opacity = 1;
						}, 100);							
						//}
					}, 700);
					
				}, 1700);
			}, 600);
		}		
	}
	
	$("#pre").onclick = function(){ exImg(-1); }
	$("#next").onclick = function(){ exImg(1); }
	
	for (var i = 0; i < $(".shortSubList_img").length; i++){
		$(".shortSubList_img")[i].onclick = function(e){
			imgIndex = imgList.indexOf(e.target.id.slice(0, -2));
			exImg(0);
		}
	}
	
	$("#by").onclick = function(){
		//收起图片
		$("#image").style.opacity = 0;
		//收起shortBox
		$.addClass($("#shortBox"), "w0");
		setTimeout(function(){
			//收起舞台
			$("#stage").style.display = "none";
			//恢复by
			$.removeClass($("#shortBox"), "w0");
			//显示box 
			$("#box").style.display = "block"; 	
			setTimeout(function(){
				$("#box").style.opacity = 1;
				$("#large_list").style.opacity = 1;
			}, 100);
		}, 800);
	}
	//无白色闪烁的图片切换
	/* var img = $(".subList_img");
	for (var i = 0; i < img.length; i++){
		console.log(img[i].innerHTML);
		img[i].style.backgroundImage = "url('images/"+img[i].id+".png')";
		console.log(img[i].style.backgroundImage);
	} */
}

function slide(e, id, m, n, o){
	var x = e.clientX - m;  //事件发生点处计算部分x
	var w = document.body.clientWidth - n; //窗口计算部分宽度
	var llx = $.getStyle($("#"+id)).width.slice(0, -2)*1; //大列表宽度
	x = x > 0 ? x : 0;
	x = x < w ? x : w;
	
	$("#"+id).style.left = "-" + (llx - document.body.clientWidth + o) * x/w + "px";
}
//切换图片
function exImg(n){
	if (n < 0 && imgIndex == 0){
		imgIndex = imgList.length - 1;
	} else if (n > 0 && imgIndex == imgList.length - 1){
		imgIndex = 0;
	} else {
		imgIndex += n;
	}
	$("#image").style.opacity = 0;
	setTimeout(function(){
		$("#image").src = "images/" + imgList[imgIndex] + ".png";
		//$("#image").onload = function(){
			$("#image").style.opacity = 1;
		//}
	}, 800);
	
}
//图片预加载
function imgLoad(){
	for (var i = 0; i < imgList.length; i++){
		var img = new Image();
		img.onload = function(){
			img.onload = null;
			imgCache.push(img);
		}
		img.src = "images/" + imgList[i] + ".png"; 
	}
}