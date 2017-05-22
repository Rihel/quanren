require(['jQuery',
    'step',
    'model/api',
    'model/until',
    'model/uploadOssAll'
], function ($, step, api, until, oss) {
    /**
     * 创建上传对象
     */
    var uploadImagesToAliOSS=oss.uploadImagesToAliOSS;
    /**
     *上传类型
     */
    var uploadType=oss.uploadType;
  
    var uploadIdFront=uploadImagesToAliOSS('IdFront');
    $('.upload').click(function(){
        uploadType.uploadIdFront(uploadIdFront);
    })

    var step = $("#myStep").step();
    var mobile = 13566223632;
    var initRegister = $.Callbacks();

    var initTem=$.Callbacks();
    initRegister.add(function () {
        //获取草稿箱信息
        api.getDraftBox(mobile)
            .then(function (data) {
                //初始化模板
                console.log(data);
            });
    })

    api.userStatus(mobile)
        .then(function () {
            until.setItem('mobile', mobile);
            //检测账号已经注册  handle
        }, function (data) {
            until.setItem('mobile', mobile);
            initRegister.fire();
        });


    // $("#preBtn").click(function (event) {
    //     var yes = step.preStep(); //上一步
    // });
    // $("#nextBtn").click(function (event) {
    //     var yes = step.nextStep();
    // });
    // $("#goBtn").click(function (event) {
    //     var yes = step.goStep(3); //到指定步
    // });








})