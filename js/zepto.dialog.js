;(function($){
	var Dialog = function(config){

		var _this = this;

		//默认参数配置
		this.config = {
			//对话框宽
			width:'auto',

			//对话框高
			height:'auto',

			//对话框的类型
			type:'waiting',

			//对话框提示信息
			message:null,

			//按钮配置
			buttons:null,

			//弹出框延迟多久关闭
			delay:null,

			//延时关闭的回调函数
			delayCallback:null,

			//对话框遮罩透明度
			maskOpacity:null,

			//遮罩层点击是否关闭
			maskClose:null,

			//是否启用动画
			effect:null

		};

		//默认参数扩展
		if(config && $.isPlainObject(config)){
			$.extend(this.config,config);
		} else {
			this.isConfig = true;
		}

		//创建基本的DOM
		this.body = $('body');
		this.mask = $('<div class="g-dialog-container">');
		this.win = $('<div class="dialog-window">');
		this.winHeader = $('<div class="dialog-header">');
		this.winContent = $('<div class="dialog-content">');
		this.winFooter = $('<div class="dialog-footer">');

		//渲染DOM
		this.creat();

	};
	Dialog.zIndex = 10000;
	Dialog.prototype = {
		animate: function(){
			var _this = this;
			this.win.css('-webkit-transform','scale(0,0)');
			setTimeout(function(){
				_this.win.css('-webkit-transform','scale(1,1)');
			},100);
		},
		//创建弹出框
		creat:function(){
			var _this = this,
			    config = this.config,
			    mask = this.mask,
			    win = this.win,
			    header = this.winHeader,
			    content = this.winContent,
			    footer = this.winFooter,
			    body = this.body;

			Dialog.zIndex++;
			this.mask.css('zIndex',Dialog.zIndex);

			header.click(function(){
				return false;
			})

			content.click(function(){
				return false;
			})

			//如果没有传递任何配置参数,弹出一个等待的图标形式的弹框
			if(this.isConfig){
				win.append(header.addClass('waiting'));
				if(config.effect){
					this.animate();
				}
				mask.append(win);
				body.append(mask);
			} else {
				header.addClass(config.type);
				win.append(header);
				if(config.message){
					win.append(content.html(config.message));
				}
				if(config.buttons){
					this.creatButtons(footer,config.buttons);
					win.append(footer);
				}
				mask.append(win);
				body.append(mask);
				if(config.width != 'auto'){
					win.width(config.width);
				};
				if(config.height != 'auto'){
					win.height(config.height);
				};
				if(config.maskOpacity){
					mask.css('background',"rgba(0, 0, 0, "+config.maskOpacity+")");
				};
				if(config.delay && config.delay!=0){
					window.setTimeout(function(){
						_this.close();
						config.delayCallback && config.delayCallback();
					},config.delay);
				};
				if(config.maskClose){
					mask.click(function(){
						_this.close();
					})
				}
				if(config.effect){
					this.animate();
				}
			}

		},
		creatButtons: function(footer,buttons){
			var _this = this;
			$(buttons).each(function(i){
				var type = this.type ? ' class='+this.type+'' : '';
				var btnText = this.text ? this.text : '按钮'+(++i);
				var callback = this.callback ? this.callback : '';
				var button = $('<button'+type+'>'+btnText+'</button>');
				if(callback){
					button.click(function(e){
						var isClose = callback();
						e.stopPropagation();
						if(isClose !== false){
							_this.close();
						}
					})
				} else {
					button.click(function(e){
						e.stopPropagation();
						_this.close();
					})
				}
				
				footer.append(button);
			})
		},
		close:function(){
			this.mask.remove();
		}
	};
	window.Dialog = Dialog;
	$.dialog = function(options){
		return new Dialog(options);
	}
})(Zepto);
