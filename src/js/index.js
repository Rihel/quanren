require(['jQuery',
'model/title',
'model/api',
'model/tem',
'model/until',
'model/dialog'
], function($, title, api, tem,until,dialog){

	var init=$.Callbacks();
	init.add(defineTitle);
	// init.add(orderPage)
	//检测登录状态
	api.userGet()
	   .then(function(data){
			if(!data.success){
				dialog({
					title:'错误',
					content:'还未登录，返回登录页面',
					btns:['确定'],
					btnsCallback:function(){
						until.jumpPage('login')
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

	//定义头部信息
	function defineTitle(titleName){
		title({
			title : titleName,
		}).then(function(title){
			$('.index-box').before(title);
		});
	}
	//获取最近的预约
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