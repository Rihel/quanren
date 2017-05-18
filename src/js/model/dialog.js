define(function (require) {
    var $ = require('jQuery');

    function dialog(opt) {
        /**
         * 
         * 组件默认配置
         */
        var defaults = {
            title: '错误',
            content: $('.dialog-template').html() || '',
            btnVal: '确定'
        }
        this.setting = $.extend({}, defaults, opt);



        this.container = $('<div class="container dialog-container">');
        this.mark = $('<div class="dialog-mark">');
        this.box = $('<div class="dialog-box modal-content">');
        this.title = $('<div class="dialog-title modal-header">');
        this.titleText = $('<h4 class="modal-title"></h4>').html(this.setting.title)
        this.closeButton = $('<button type="button" class="close" ><span class="fa fa-close"></span></button>')

        this.title.append(this.closeButton).append(this.titleText);
        var self = this;
        this.closeButton.click(function () {
            self.close();
        })
        this.content = $('<div class="dialog-content modal-body">').html(this.setting.content);
        this.controls = $('<div class="dialog-controls modal-footer">');

        return this;
    }
    dialog.prototype = {
        constructor: dialog,
        alert: function () {
            var self = this;
            this.init();
            // this.controls.append('<input type="button" value="确定">');
            // this.controls.find('input').click(function () {
            //     self.close();
            // });
            $('body').append(this.container);

            this.start();
            return this;
        },
        start: function () {
            var self = this;
            this.mark.fadeIn(300, function () {
                self.box.fadeIn();
            })
        },
        confirm: function () {
            var self = this;

            this.init();

            $('body').append(this.container);
            this.start();
        },
        init: function () {
            var self = this;
            this.container.append(this.mark).append(this.box);
            console.log(this.container);
            this.box.append(this.title).append(this.content).append(this.controls);
            if (this.setting.btns) {
                $.each(this.setting.btns, function (index, item) {
                    self.controls.append($('<input type="button" class="btn btn-primary"/>').val(item));
                });
            }
            var btns = this.controls.find('input');
            btns.click(function(){
                self.close();
                self.setting.btnsCallback && self.setting.btnsCallback(btns, self);
            })
            this.mark.click(function () {
                self.close();
            })
        },
        close: function () {
            var self = this;
            this.box.fadeOut(300, function () {
                self.mark.fadeOut(300, function () {
                    self.container.remove();
                });
            });
        }
    }

    return function (opt) {
        return new dialog(opt);
    };

});