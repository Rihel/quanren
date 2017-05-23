/**
 * @module {title} title
 * @requires jQuery
 */
define(function (require) {
    var $ = require('jQuery');
   
    var def = {
        text: '',
        isBack: false,
        backCallback: function () {

        }
    }

    function title(opt) {
        var dtd = $.Deferred();
        this.set = $.extend({}, def, opt);
        this.title = $('<div class="title">');
        this.back = $('<a href="javascript:void(0)" ><i class="fa fa-arrow-left"></i>返回</a>');
        this.text = $('<h4>').html(this.set.title);
        var title = this.init();
        dtd.resolve(title);
        return dtd;
    }
    title.prototype = {
        constructor: title,
        init: function () {
            var self = this;
            if (this.set.isBack) {
                this.title.append(this.back);
                console.log(self.set.backCallback)
                this.back.click(function (e) {
                    self.set.backCallback && self.set.backCallback();
                })
            }
            this.title.append(this.text);
            return this.title;
        }
    };
    return function (opt) {
        return new title(opt);
    }
})