require(['jQuery', 'step', 'model/uploadOssAll', 'model/until', 'plupload'], function ($, step, uploadOssAll, until, plupload) {
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







    var tokenUrl = 'http://m.qren163.cn:8080/v1/api/auth/upload/token';

    var idFront = '_id_card_front',
        idBack = '_id_card_back',
        carLicenseFront = '_car_license_front',
        carLicenseBack = '_car_license_back',
        baoDanPage1 = '_bao_dan_page_01',
        baoDanPage2 = '_bao_dan_page_02',
        baoDanPage3 = '_bao_dan_page_03';


    console.log(until.getItem('mibble'));

    function getInputFileName(fileinputDOM, cname) {
        /**获取文件名 */
        var dtd = $.Deferred();

        var postfix = /.+\.(jpg|png|gif)$/.exec(fileinputDOM);
        if (postfix == undefined || postfix == null) {
            postfix = ".jpg";
        }
        console.log(postfix)
        var fileSuffix = postfix[1].toString().toLowerCase();

        dtd.resolve(until.getItem('mibble') + cname +'.'+ fileSuffix);
        return dtd;
    }

    function uploadImagesToAliOSS(fileInputName) {
        var uploader = new plupload.Uploader({ //实例化一个plupload上传对象
            browse_button: fileInputName,
            url: 'http://oss.aliyuncs.com',
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
            }
        });
        uploader.init(); //初始化
        console.log(uploader);
        //绑定文件添加进队列事件
        uploader.bind('FilesAdded', function (uploader, files) {
            // for (var i = 0, len = files.length; i < len; i++) {
            //     var file_name = files[i].name; //文件名
            //     //构造html来更新UI
            //     var html = '<li id="file-' + files[i].id + '"><p class="file-name">' + file_name + '</p><p class="progress"></p></li>';
            //     $(html).appendTo('#file-list');
            // }
            console.log(files);
        });

        //绑定文件上传进度事件
        uploader.bind('UploadProgress', function (uploader, file) {
            // $('#file-' + file.id + ' .progress').css('width', file.percent + '%'); //控制进度条
            console.log('UploadProgress')
        });
        uploader.bind('FileUploaded', function (uploader, file, response) {
            console.log('FileUploaded', uploader, file);
        });
        uploader.bind('PostInit', function () {
            console.log('PostInit')
        })

        //上传按钮
        return uploader;
    }


    var uploader = uploadImagesToAliOSS('file');
    $('.upload').click(function () {
        $.post(tokenUrl)
            .then(function (result) {
                var tokenData = result.data;
                getInputFileName(uploader.files[0].name, idFront)
                    .then(function (file_name) {
                        var ossObjKey=tokenData.dir+file_name;
                        console.log(ossObjKey);
                        var uploadParams = {
                            'key': ossObjKey,
                            'policy': tokenData["policy"],
                            'OSSAccessKeyId': tokenData["accessId"],
                            'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                            'callback': "",
                            'signature': tokenData["signature"],
                        };
                        uploader.setOption({
                            url: tokenData.formUrl,
                            'multipart_params': uploadParams
                        })
                        uploader.start(); //开始上传
                    })


            });

    });






})