define(function (require) {
	var $=require('jQuery'),template=require('tmpl');
	/**
	 * 模板引擎的promise封装
	 * @param {String} name 模板id名
	 * @param{Objecs} data  数据
	 */
	return function (idName,data) {
		var dtd=$.Deferred();
		var done=template(idName,data);
		dtd.resolve(done);
		return dtd;
	}
})