/**
 * 这个模块是网站的所有api接口
 * @module {Object} api
 * @exports control
 * @requires jQuery,dialog,until
 */
define('control', function (require) {
	/**
	 * 引入依赖模块
	 */
	var $ = require('jQuery');
	var tpl = require('tmpl');
	var dialog = require('model/dialog');
	var until = require('model/until');

	/**
	 * @description api接口根目录
	 * @const {String} hostName
	 */
	var hostName = 'http://m.qren163.cn:8080/v1/api/';


	/**
	 *@description 用户状态
	 * @constant {Object} userStatus
	 */
	var userStatus = {
		preForVal01: "0", //等待1审
		inVal01: "1", //一审中
		preVal02: "2", //等待2审
		inVal02: "3", //2审中
		failedVal01: "4", //1审 驳回
		failedVal02: "5", //2审 驳回
		disable: "6", //失效
		enable: "7", //有效
		deleted: "8", //逻辑删除
		waitForPay: "9", //一审通过,等待支付
	}


	/**
	 *@description 所有请求的路径对象
	 */
	var api = {

		userLogin: hostName + 'auth/login', //登录
		orderPage: hostName + 'order/page', //预约列表
		userGet: hostName + 'user/get', //获取用户信息
		userStatus: hostName + 'user/status', //获取用户状态


		getDraftBox: hostName + 'user/draftbox/get', //获取用户注册草稿箱
		saveDraftBox: hostName + 'user/draftbox/save', //保存用户注册草稿箱

		carbrand: hostName + 'dict/carbrand/list', //车品牌
		carmodel: hostName + 'dict/carmodel/list', //车型


		clitype: hostName + 'dict/clitype/list', //客户类型
		clitStatus: hostName + 'dict/clitstatus/list', //客户状态


		province: hostName + 'dict/province/list', //省份
		city: hostName + 'dict/city/list', //城市
		district: hostName + 'dict/district/list', //城区列表

		payStatus: hostName + 'dict/paystatus/list', //支付状态

		providerList: hostName + 'provider/list', //服务商列表

	};
	
	
	var control = {
		userStatus: userStatus
	};

	/**
	 * ajax底层请求函数，请求带上session Id
	 * @param {String} url 请求路径
	 * @param {Object} dataStr 请求的参数
	 * @param {function} fn 成功回调
	 */
	control.base = function (opt) {
		var option = $.extend({}, {
			xhrFields: {
				withCredentials: true
			},
			timeout: 3000, //超时时间设置，单位毫秒
			crossDomain: true,

			complete: function (XMLHttpRequest, status) {
				if (status == 'timeout') {
					until.closeLoading();
					dialog({
						title: '请求超时',
						content: '网络情况不是很好哟，刷新一下吧~~',
						btns: ['确定刷新', '取消'],
						btnsCallback: function (btns) {
							$(btns).get(0).click(function () {
								window.location.reload();
							})
						}
					})
				}
			}
		}, opt);
		$.ajax(option)
	}

	/**
	 * 登录请求
	 * @param {String} mobile 用户手机号码
	 * @param {String} passowrd 用户密码
	 * @return {Object} 返回一个延迟对象
	 */
	control.login = function (mobile, passowrd) {
		var dtd = $.Deferred();
		var last = [].slice.call(arguments, 2);
		this.base({
			url: api.userLogin,
			type: 'post',
			data: {
				name: mobile,
				pwd: passowrd,
			},
			beforeSend: function () {
				until.loading('登录中...')
			},
			success: function (data) {
				until.closeLoading();
				if (data.success) {
					dtd.resolve.apply(null, last.concat(data));
				} else {
					dtd.reject.apply(null, last.concat(data));
				}
			}
		})
		return dtd;
	}

	/**
	 * 订单列表请求
	 * @param {Object} arg 请求的列表数据：详情见：http://m.qren163.cn:8080
	 * @return {Object} 返回一个延迟对象
	 */
	control.orderPage = function (arg) {
		var dtd = $.Deferred();
		this.base({
			url: api.orderPage,
			data: arg,
			success: function (data) {
				if (data.success) {
					dtd.resolve(data.data);
				}
			}
		});

		return dtd;
	}
	control.userGet = function (arg) {
		var dtd = $.Deferred();
		this.base({
			url: api.userGet,
			type: 'get',
			data: arg,
			beforeSend: function () {
				until.loading('正在加载数据...')
			},
			success: function (data) {
				until.closeLoading();
				if (data.success) {
					dtd.resolve(data);
				} else {
					dtd.reject(data);
				}
			}
		});
		return dtd;
	}
	control.userStatus = function (mobile) {
		var dtd = $.Deferred();
		this.base({
			url: api.userStatus,
			data: {
				mobile: mobile
			},
			success: function (data) {
				if (data.success) {
					dtd.resolve(data.data);
				} else {
					dtd.reject(data);
				};
			}
		})
		return dtd;
	}
	control.province = function (statusCode, countryCode) {
		var dtd = $.Deferred();
		this.base({
			url: api.province,
			data: {
				statusCode: statusCode,
				conuntryCode: countryCode
			},
			success: function (data) {
				dtd.resolve(data);

			}
		});
		return dtd;
	}
	control.city = function () {
		var dtd = $.Deferred();
		this.base(api.city, {}, function (data) {
			dtd.resolve(data);
		});
		return dtd;
	}
	control.district = function (cityCode) {
		var dtd = $.Deferred();
		this.base(api.district, {
			cityCode: cityCode,
		}, function (data) {
			if (data.success) {
				dtd.resolve(data.data)
			} else {
				dtd.rbject(data);
			}
		});
		return dtd;
	}
	control.providerList = function (arg) {
		var dtd = $.Deferred();
		this.base(api.providerList, arg, function (data) {
			if (data.success) {
				dtd.resolve(data.data)
			} else {
				dtd.rbject(data);
			}
		});
		return dtd;
	}
	control.carBrandList = function () {
		var dtd = $.Deferred();
		this.base({
			url: api.carbrand,
			success: function (data) {
				if (data.success) {
					dtd.resolve(dtaa.data);
				}
			}
		});
		return dtd;
	}
	control.getDraftBox = function (mobile) {
		var dtd = $.Deferred();
		this.base({
			url: api.getDraftBox,
			data: {
				mobile: mobile
			},
			success: function (data) {
				if (data.success) {
					dtd.resolve(data.data);
				}
			}
		});
		return dtd;
	}
	return control;
});