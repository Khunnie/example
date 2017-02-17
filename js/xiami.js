$(function(){
	$(".info a").on("tap",function(){
		$(".info a").css("border-bottom",0);
		$(".info a").removeClass("active");
		$(this).addClass("active")
		$(this).css("border-bottom","0.05rem solid #fa7829");       
	})
	$(".title a").on("tap",function(){
		$(".title a").removeClass("active");
		$(this).addClass("active");
	})
	var len = $("#move li").length;
	var index = 1;
	var W = $("#move li").width();
	var onOff = false; 
	var Move = document.getElementById("move");
	Move.addEventListener("webkitTransitionEnd",function (){
        if( index >= len-1  ){  //判断出是否到最后一张
            Move.style.transition = "none"; 
            Move.style.left = -W + "px";
            index= 1;          
        }else if(index <= 0){
            Move.style.transition = "none"; 
            Move.style.left = -(len-2)*W+"px";
            index = len-2;
        }
        onOff = false;  //当每一次执行，把开关关闭
    });
    $("#cycle").on("touchstart",function(){
    	clearInterval(timer);
    })
    $("#cycle").on("touchend",function(){
    	play();
    	
    })
	$("#cycle").on("swipeleft",function(){
		if( onOff ) return;
        index++;
        if( index > len-1 ){
            index = 1;
        }
        Tab();
        onOff = true;
	})
	$("#cycle").on("swiperight",function(){
		if( onOff ) return;
        index--;
        if( index < 0 ){
            index = len-2;
        }
        Tab();
        onOff = true;
	})
	function play(){
		timer = setInterval(function (){
            index++;
            if( index > len-1){
                index = 1;
            }
            console.log(index)
         	Tab();
        },3000);
	}
	function Tab(){
		$("#move").css("transition","1s");
		$("#move").css("left",-index *W) ;
           var a = 0;
            a=index-1;
//          console.log(a)
            if (a>len-3) {
                a=0
            } 
            if(a<0){
                a=len-3;
            }
            if (a<len) {
	            $("#dot span").removeClass("write");
				$("#dot span").eq(a).addClass("write");
            }
	}
	play();
//	var iNow = 0;
//	var index = 0;
//	var nStartX = 0;
//	var Cycle = document.getElementById("cycle");
//	Cycle.addEventListener("touchstart",function(event){
//		event.preventDefault();
//		nStartX = event.targetTouches[0].pageX;
//		console.log(nStartX);
//	})
//	Cycle.addEventListener("touchend",function(event){
//		event.preventDefault();
//		var W = $("#move li").width();
//		var L = $("#move").position().left%W;
//		var _W = W/2;//Z中点判断
//		var _m = $("#move li").length-1;
//		var Ml = $("#move").position().left;
//		if(L<=_W){
//			Ml=Ml - L;
//		}else{
//			Ml = Ml + (W - L);
//		}
//		if(Ml >=0){
//			Ml=0;
////			index++;
////			$("#move").animate({"left":-index*$("#move li").width()},200);
//			
//		}else if(Ml <= -W * _m){
//			Ml = -W * _m;
//		}
//		
//		console.log(_W)
//	})
//	Cycle.addEventListener("touchmove",function(event){
//		event.preventDefault();
//		var touch = event.targetTouches[0];
//		var _L = $("#move").position().left+touch.pageX-nStartX;
//		nStartX = touch.pageX;
//		$("#move").css("left",_L);
//	})
})
