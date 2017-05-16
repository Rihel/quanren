require(['jQuery', 'step', 'plupload'], function($, step, plupload) {
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



    var uploader = new plupload.Uploader({
        browse_button: 'file', //触发文件选择对话框的按钮，为那个元素id
        url: 'http://oss.aliyuncs.com', //服务器端的上传页面地址
        filters: {
            mime_types: [ //只允许上传图片文件
                {
                    title: "Image files",
                    extensions: "*", //fxxk : android mobile might have file without extension
                    //extensions : "jpg,png,bmp,jpeg",
                }
            ],
            max_file_size: '8mb', //最大只能上传8mb的文件
            prevent_duplicates: true //不允许选取重复文件
        },
    });


    var tokenURL = 'http://m.qren163.cn:8080/v1/api/auth/upload/token';

    function getInputFileName(fileinputDOM) {
        var dtd = $.Deferred();
        var postfix = fileinputDOM.files[0].name.postfix();
        if (postfix == undefined || postfix == null) {
            postfix = ".jpg";
        }
        var fileSuffix = postfix.toString().toLowerCase();
        return customName + fileSuffix;
    }
    $.get(tokenURL)
        .then(data => {
            console.log(data);
        })

})