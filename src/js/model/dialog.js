define( function(require) {
    var $=require('jQuery');
    function Dialog(opt){
        this.setting=$.extend({},{
            title:'',
            content:''
        },opt);
    };
    Dialog.prototype={
        constructor:Dialog,
        alert:function(){

        },
        tem:function(){
            
        }
    }
    return new Dialog();
});