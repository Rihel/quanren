require(['jQuery', 'step', 'model/api'], function ($, tem, control, step) {
    var step = $("#myStep").step();

    // $("#preBtn").click(function (event) {
    //     var yes = step.preStep(); //上一步
    // });
    // $("#nextBtn").click(function (event) {
    //     var yes = step.nextStep();
    // });
    // $("#goBtn").click(function (event) {
    //     var yes = step.goStep(3); //到指定步
    // });
    var file = $('.file');
    var upload = $('.upload');
    var formData = new FormData();
    formData.append('file', file);
    function onprogress(evt){
        console.log(evt.total,evt.loaded);
    }
    upload.click(function () {
        $.ajax({　　　　
            type: "POST",
            　　　　url: "http://m.qren163.cn:8080/v1/api/auth/upload/token",
            　　　　data: formData,
            　　 //这里上传的数据使用了formData 对象
            　　　　processData: false,
            　　　　 //必须false才会自动加上正确的Content-Type
            　　　　contentType: false,
            　　　　　　　　 //这里我们先拿到jQuery产生的 XMLHttpRequest对象，为其增加 progress 事件绑定，然后再返回交给ajax使用
            　　　　xhr: function () {　　　　　　
                        var xhr = $.ajaxSettings.xhr();　　　　　　
                        if (onprogress && xhr.upload) {　　　　　　　　
                            xhr.upload.addEventListener("progress", onprogress, false);　　　　　　　　
                            return xhr;　　　　　　
                        }　　　　
            }
        }).done(data=>{
            console.log(data);
            $.ajax({
                type:'POST',
                url:data.data.formUrl+'/'+data.data.dir,
                data:formData.name,
                success:function(result){
                    console.log(result);
                }
            })
        })
    })
})