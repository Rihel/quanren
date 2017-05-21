require([
		'jQuery',

		'model/tem',
		'model/api',
		'model/until',
		'model/dialog'
	],
	function($, tem, api, until, dialog){

		var loginBox = $('.login-box');
		var username = loginBox.find('#username');
		var password = loginBox.find('#password');
		username.val(until.getItem('username') || '');
		password.val(until.getItem('password') || '');

		username.trigger('change');
		username.on('change', function(){
			var name = username.val();
			if(!until.isPhone(name)){
				$(this).parent().addClass('has-error');
				$(this).next().addClass('fa-close');
				$(this).nextAll('.message').html('请输入正确的手机号码').css('color', '#a94442');
			}else {
				$(this).parent().removeClass('has-error').addClass('has-success');
				$(this).next().removeClass('fa-close').addClass('fa-check');
				$(this).nextAll('.message').html('');
				password.removeAttr('disabled');
				$('.login-btn').removeAttr('disabled');
			}
		})
		$('.login-btn').on('click', function(){
			var name = username.val();
			var pwd = password.val();
			if(name === '' || pwd === ''){
				dialog({
					title   : '错误',
					content : '用户名或者密码不能为空',
					btns    : ['确定']
				});
				return;
			}
			api.userStatus(name)
			   .then(function(state){
			   		until.setItem('moblie',name);
			   		if(state<=6){
						statusHander(state.status);
					}else {
			   			return api.login(name,pwd,state.status);
					}
			   })
				.then(function(){
					var status=arguments[0];
					if(status===7){
						until.jumpPage('index',{p:name});
					}
					if(status===9){
						until.jumpPage('notify_bind_wx')
					}
				},function(){
					tipAlert('错误','用户名密码错误')
				})
		})

		function tipAlert(title,msg){
			dialog({
				title   : title,
				content : msg,
				btns    : ['确定']
			});
		}
		function statusHander(status){
			var message=[];
			message[0]=message[1]=message[2]=message[3]='您的资料已经提交初步审核，请耐心等候.';
			message[4]='您的注册资料需要修改。';
			message[5]='您的支付资料需要修改';
			message[6]='用户已失效';
			function tips(mes,jumpPage,data){
				var arg=arguments;
				dialog({
					title:'温馨提示',
					content:mes,
					btns    : ['确定'],
					btnsCallback:function(btns){
						if(arg.length>1){
							$(btns).click(function(){
								until.jumpPage(jumpPage,data);
							})
						}
					}
				})
			}
			var hander={
				0:function(){
					tips(message[status],'notify_pre_validation01')
				},
				1:function(){
					tips(message[status],'notify_pre_validation01')
				},
				2:function(){
					tips(message[status],'notify_pre_validation01')
				},
				3:function(){
					tips(message[status],'notify_pre_validation01')
				},
				4:function(){
					tips(message[status],'notify_pre_validation02',{p:until.getItem('mobile')})
				},
				5:function(){
					tips(message[status],'notify_pre_validation02',{p:until.getItem('mobile')})
				},
				6:function(){
					tips(message[status])
				}
				
			}
			hander[status.toString()];

		}

	})