var compile = document.getElementById("compile");
//构造函数
function Slider(opts){

	this.defaults = {
		'container' : 'container',//容器的id名
		'sections' : '.page',//子容器
		'easing' : 'ease',//特效方式，ease-in,ease-out,linear
		'duration' : 800,//每次动画执行的时间 单位为毫秒
		'pagination' : false,//是否显示分页
		'loop' : true,//是否循环
		'direction' : 'vertical',//滑动的方向 horizontal,vertical,
		'callback' : function(index){//index 从0开始
		}
	};

	//参数继承
	for(var attr in opts) {
		this.defaults[attr] = opts[attr];
	}


	//构造函数需要的参数
	this.outer = document.getElementById(this.defaults.container);
	if(!this.outer) {return false;}

	this.list = this.outer.children;
	this.winW = window.innerWidth;
	this.winH = window.innerHeight;
	this.len = this.list.length;
	this.index = 0;
	this.duration = this.defaults.duration;
	this.easing = this.defaults.easing;
	this.loop = this.defaults.loop;
	this.canMove = true;
	this.arrElement = [];
	this.init();
}

Slider.prototype = {
	constructor: Slider,

	//初始化
	init: function() {
		this.setStyle();
		if(this.defaults.pagination){
			this.initPagination();
		}
		this.bindDOM();
	},

	//设置样式
	setStyle: function() {
		this.outer.style.cssText = 'width:'+ this.winW + 'px;height:' + this.winH + 'px;';
		var _len;
		if(this.defaults.direction == 'horizontal' ) {//水平
			this.cellWidth = this.winW;
			this.cellHeight = 0;
		}else if(this.defaults.direction == 'vertical' ) {//垂直
			this.cellWidth = 0;
			this.cellHeight = this.winH;
		}

		this.arrElement.push(this.list[this.len-1]);
		this.arrElement.push(this.list[this.index]);
		this.arrElement.push(this.list[this.index+1]);
		_len = this.arrElement.length;

		for(var i=0; i<_len; i++) {
			this.arrElement[i].style[this.SuportCss('transform')] = 'translate3d('+(i-1)*this.cellWidth+'px, '+(i-1)*this.cellHeight+'px, 0)';
			this.arrElement[i].style.zIndex = 99;
		}
		for(var i=0; i<this.list.length; i++) {
			this.list[i].style.display = 'none';
		}
		this.list[this.index].style.zIndex = 100;
		this.list[this.index].style.display = 'block';
	},

	//初始化分页
	initPagination: function() {
		var str = '';
		this.pageHtml = document.createElement('ul');
		this.pageHtml.id = 'pages';
		str = '<li class="active"></li>';

		for(var i=1; i<this.len; i++) {
			str += '<li></li>'
		}
		this.pageHtml.innerHTML = str;

		compile.appendChild(this.pageHtml);
	},

	//返回css的某个属性
	SuportCss: function(property) {
		var transform = ["-webkit-transform","-ms-transform","-moz-transform","transform"],
			transition = ["-webkit-transition","-ms-transition","-moz-transition","transition"];
		var attr = property == 'transform' ? transform : transition;
		var pro,toUpperCase,str;
		var el = document.createElement('div');
		for(var i=0; i<attr.length;i++){
			if(attr[i] in el.style){
				pro = attr[i];
				if(pro.charAt(0) == '-') {
					pro = attr[i].substring(1);
					str = pro.charAt(pro.indexOf('-')+1).toUpperCase();
					pro = pro.replace(/-[a-z]/g,str);
				}
				return pro;
			}
		}
	},

	//绑定 DOM 事件
	bindDOM: function() {
		var self = this;

		//手指按下的处理事件
		self.startHandler = function(e) {

			e.preventDefault();

			//记录刚刚开始按下的时间 转化为mms
			self.startTime = new Date() * 1;

			//记录手指按下的坐标  touchs 是手指按住的区域点
			self.start = self.defaults.direction == 'horizontal' ? e.touches[0].pageX : e.touches[0].pageY;

			//清除偏移量 --> 手指滑动的距离
			self.offset = 0;

			if(self.canMove) {
				self.outer.addEventListener('touchmove', self.moveHandler);
				self.outer.addEventListener('touchend', self.endHandler);
			}
		};

		//手指移动的处理事件
		self.moveHandler = function(e){

			e.preventDefault();
			var _len = self.arrElement.length;
			var attrX,attrY;

			//计算手指的偏移量
			if(self.defaults.direction == 'horizontal') {
				self.offset = e.touches[0].pageX - self.start;
				attrX = 1;
				attrY = 0;
			}else {
				self.offset = e.touches[0].pageY - self.start;
				attrX = 0;
				attrY = 1;
			}

			if(!self.loop) {
				if(self.index == 0) {
					if(self.offset>=0) {return false;}
				}else if (self.index == self.len-1) {
					if(self.offset<=0) {return false;}
				}
			}

			for(var i=0; i<_len; i++) {
				self.arrElement[i].style.display = 'block';
				self.arrElement[i].style[self.SuportCss('transition')] = 'none';
				self.arrElement[i].style[self.SuportCss('transform')] = 'translate3d('+((i-1)*self.cellWidth+self.offset*attrX)+'px, '+((i-1)*self.cellHeight+self.offset*attrY)+'px, 0)';
			}
		};

		//手指抬起的处理事件
		self.endHandler = function(e) {
			e.preventDefault();
			//边界就翻页值
			var boundary = self.defaults.direction == 'horizontal' ? self.winW/6:self.winH/6;
			//手指抬起的时间值
			var endTime = new Date() * 1;

			//当手指移动时间超过300ms 的时候，按位移算
			if(endTime - self.startTime > 300){
				if(self.offset >= boundary){
					self.goIndex('-1');
				}else if(self.offset < 0 && self.offset < -boundary){
					self.goIndex('+1');
				}else{
					self.goIndex('0');
				}
			}else{
				//优化
				//快速移动也能使得翻页
				if(self.offset > 50){
					self.goIndex('-1');
				}else if(self.offset < -50){
					self.goIndex('+1');
				}else{
					self.goIndex('0');
				}
			}
		};

		//绑定事件
		self.outer.addEventListener('touchstart', self.startHandler);
	},

	goIndex: function(n) {
		var idx = this.index;
		var cidx, _len, _action;
		var self = this;
		var onOff = true;

		//如果传数字 2,3 之类可以使得直接滑动到该索引
		if(typeof n == 'number'){
			cidx = idx;
		//如果是传字符则为索引的变化
		}else if(typeof n == 'string'){
			cidx = idx + n*1;
		}
		if (cidx < idx){
			_action = 'down';
		} else if (cidx > idx) {
			_action = 'up';
		}
		this.arrElement.length = 0;
		if(this.loop) {
			//当索引右超出
			if(cidx > this.len-1){
				cidx = 0;
			//当索引左超出
			}else if(cidx < 0 ){
				cidx = this.len-1;
			}
		}else {
			//当索引右超出
			if(cidx > this.len-1){
				cidx = this.len - 1;
				onOff = false;
			//当索引左超出
			}else if(cidx < 0){
				cidx = 0;
				onOff = false;
			}
		}
		//保留当前索引值
		this.index = cidx;

		if(cidx == this.len - 1) {
			this.arrElement.push(this.list[this.len-2]);
			this.arrElement.push(this.list[this.len-1]);
			this.arrElement.push(this.list[0]);
		}else if(cidx == 0) {
			this.arrElement.push(this.list[this.len-1]);
			this.arrElement.push(this.list[0]);
			this.arrElement.push(this.list[1]);
		}else {
			this.arrElement.push(this.list[cidx-1]);
			this.arrElement.push(this.list[cidx]);
			this.arrElement.push(this.list[cidx+1]);
		}
		if(!onOff) {return false;}
		self.canMove = false;
		_len = this.arrElement.length;
		if (_action == 'up'){
			this.arrElement[_len-1].style.display='none';
		} else if (_action == 'down') {
			this.arrElement[0].style.display='none';
		}
		for(var i=0; i<_len; i++) {
			this.arrElement[i].style[this.SuportCss('transition')] = this.duration/1000 + 's ' +this.easing;
			this.arrElement[i].style[this.SuportCss('transform')] = 'translate3d('+(i-1)*this.cellWidth+'px, '+(i-1)*this.cellHeight+'px, 0)';
		}
		self.outer.removeEventListener('touchmove', self.moveHandler);
		self.outer.removeEventListener('touchend', self.endHandler);
		setTimeout(function() {
			self.canMove = true;
			for(var i=0; i<self.len; i++) {
				if(self.defaults.pagination){
					self.pageHtml.children[i].className = '';
				}
				if(i != cidx) {
					self.list[i].style.display = 'none';
					self.list[i].style.zIndex = 99;
				}else {
					self.list[i].style.zIndex = 100;
				}
			}
			if(self.defaults.pagination){
				self.pageHtml.children[cidx].className = 'active';
			}
			//回调函数
			if(idx !== cidx) {
				typeof self.defaults.callback === 'function' && self.defaults.callback(cidx);
			}
		},this.duration);
	}
};
