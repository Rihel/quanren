/**
 * @description 首页的入口文件
 * @requires jQuery,model/title,model/api
 */
require(['jQuery',
'model/title',
'model/api',
'model/tem',
'model/until',
'model/dialog'
], function($, title, api, tem,until,dialog){


	/**
	 * @description 定制一个事件流
	 */
	var init=$.Callbacks();
	init.add(defineTitle);
	init.add(orderPage)
	

	/**
	 * @description 主要执行部分，在用户状态正确之后执行事件流
	 */
	api.userGet()
	   .then(function(data){
	   		console.log(data);
			if(!data.success){
				dialog({
					title:'错误',
					content:'还未登录，返回登录页面',
					btns:['确定'],
					btnsCallback:function(){
						// until.jumpPage('login')
					}
				});
			}else{
				init.fire('首页');
				api.province()
					.then(function(data){
						return api.city();
					})
					.then(function(city){
						return tem('citys',{citys:city.data,first:city.data[0].title})
					})
					.then(function(data){
						$('.order .order-title').html(data);
						console.log($('.order-title h4'));
						$('.order-title h4').on('click',function(){
							$(this).next().slideToggle();
						});
						$('.city-list li').on('click',function(){
							$(this).parent().prev().find('span').html($(this).html());
							$(this).parent().slideUp();
						})
					})
			}
	   })

	/**
	 * 
	 * @description 公共头部信息  
	 * @param {String} titleName 标题 
	 */
	function defineTitle(titleName){
		title({
			title : titleName,
		}).then(function(title){
			$('.index-box').before(title);
		});
	}
	
	/**
	 * 
	 *@description 初始化最近预约 
	 */
	function orderPage(){
		api.orderPage().then(function(data){
			return tem('init', data.dataLst[0]);
		}).then(function(temStr){
			$('.index-box').html(temStr);
			$('.menu-item').click(function(){
				console.log(111);
			})
		})
	}











})