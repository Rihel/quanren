define(function(require){
	var $ = require('jQuery');
	var tpl = require('tmpl');
	var hostName = 'http://m.qren163.cn:8080/v1/api/';
	// var url_check_client_status = url_root + 'v1/api/user/status';
	// var url_register_new_client = url_root + 'v1/api/auth/register';
	// var url_get_login_client_data = url_root + 'v1/api/user/get'; //当前登录用户的资料获取URL
	// var url_login_client = url_root + 'v1/api/auth/login'; //登录当前用户
	// var url_get_b1_list = url_root + 'v1/api/provider/list'; //B1 列表数据
	// var url_submit_order_b1 = url_root + 'v1/api/order/submit'; //B1 预约服务提交
	// var url_cancel_order_b1 = url_root + 'v1/api/order/cancel'; //B1 预约服务取消
	// var url_get_current_client_order_history = url_root + 'v1/api/order/page'; //C 的预约历史记录查询
	// var url_get_qr_service_no = url_root + 'v1/api/order/serviceno'; //获取全仁服务码( C端 )
	// var url_wx_unified_order = url_root + 'v1/api/wxpay/unifiedorder'; //wx支付接口

	// var ClientStatus_Pre_ForVal01 = "0"; //等待1审
	// var ClientStatus_In_Val01 = "1"; //一审中
	// var ClientStatus_Pre_Val02 = "2"; //等待2审
	// var ClientStatus_In_Val02 = "3"; //2审中
	// var ClientStatus_Failed_Val01 = "4"; //1审 驳回
	// var ClientStatus_Failed_Val02 = "5"; //2审 驳回
	// var ClientStatus_Disable = "6"; //失效
	// var ClientStatus_Enable = "7"; //有效
	// var ClientStatus_Deleted = "8"; //逻辑删除
	// var ClientStatus_WaitForPay = "9"; //一审通过,等待支付
	var api = {

		userLogin  : hostName + 'auth/login',//登录
		orderPage  : hostName + 'order/page',//预约列表
		userGet    : hostName + 'user/get',//获取用户信息
		userStatus : hostName + 'user/status',//获取用户状态

		carbrand : hostName + 'dict/carbrand/list',//车品牌
		carmodel : hostName + 'dict/carmodel/list',//车型


		clitype    : hostName + 'dict/clitype/list',//客户类型
		clitStatus : hostName + 'dict/clitstatus/list',//客户状态


		province : hostName + 'dict/province/list',//省份
		city     : hostName + 'dict/city/list',//城市
		district : hostName + 'dict/district/list',//城区列表

		payStatus : hostName + 'dict/paystatus/list',//支付状态

		providerList : hostName + 'provider/list',//服务商列表

	};
	//登录操作

	var control = {};

	control.base = function(url, dataStr, fn){
		$.ajax({

			url         : url,
			data        : dataStr || '',
			xhrFields   : {
				withCredentials : true
			},
			timeout     : 3000, //超时时间设置，单位毫秒
			crossDomain : true,
			success     : function(data){
				fn && fn(data);
			}
		})
	}
	control.login = function(username, passowrd){
		var dtd = $.Deferred();
		this.base(api.userLogin, {
			name : username,
			pwd  : passowrd,
		}, function(data){
			dtd.resolve(data);
		})
		return dtd;
	}
	control.orderPage = function(arg){
		var dtd = $.Deferred();
		this.base(api.orderPage, arg, function(data){
			if(data.success){
				dtd.resolve(data.data);
			}
		});

		return dtd;
	}
	control.userGet = function(arg){
		var dtd = $.Deferred();
		this.base(api.userGet, arg, function(data){

			dtd.resolve(data);

		});
		return dtd;
	}
	control.userStatus = function(mobile){
		var dtd = $.Deferred();
		this.base(api.userStatus, {
			mobile : mobile
		}, function(data){
			dtd.resolve(data);
		})
		return dtd;
	}
	control.province = function(statusCode, countryCode){
		var dtd = $.Deferred();
		this.base(api.province, {
			statusCode   : statusCode,
			conuntryCode : countryCode
		}, function(data){
			dtd.resolve(data);
		});
		return dtd;
	}
	control.city = function(){
		var dtd = $.Deferred();
		this.base(api.city, {}, function(data){
			dtd.resolve(data);
		});
		return dtd;
	}
	control.district = function(cityCode){
		var dtd = $.Deferred();
		this.base(api.district, {
			cityCode : cityCode,
		}, function(data){
			if(data.success){
				dtd.resolve(data.data)
			}else {
				dtd.rbject(data);
			}
		});
		return dtd;
	}
	control.providerList = function(arg){
		var dtd = $.Deferred();
		this.base(api.providerList, arg, function(data){
			if(data.success){
				dtd.resolve(data.data)
			}else {
				dtd.rbject(data);
			}
		});
		return dtd;
	}
	return control;

});