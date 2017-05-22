define(function (require) {
    var $ = require('jQuery'),
        plupload = require('plupload'),
        until=require('model/until');

    var tokenUrl = 'http://m.qren163.cn:8080/v1/api/auth/upload/token';

    var imgTypes={
        IdFront : '_id_card_front',
        IdBack : '_id_card_back',
        CarLicenseFront : '_car_license_front',
        CarLicenseBack : '_car_license_back',
        BaoDanPage1 : '_bao_dan_page_01',
        BaoDanPage2 : '_bao_dan_page_02',
        BaoDanPage3 : '_bao_dan_page_03'
    }
    function getInputFileName(fileinputDOM, cname) {
        /**获取文件名 */
        var dtd = $.Deferred();

        var postfix = /.+\.(jpg|png|gif)$/.exec(fileinputDOM);
        if (postfix == undefined || postfix == null) {
            postfix = ".jpg";
        }
        console.log(postfix)
        var fileSuffix = postfix[1].toString().toLowerCase();

        dtd.resolve(until.getItem('mobile') + cname + '.' + fileSuffix);
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

    function upload(uploader,imgType) {
      
        $.post(tokenUrl)
            .then(function (result) {
                var tokenData = result.data;
                getInputFileName(uploader.files[0].name, imgType)
                    .then(function (file_name) {
                        var ossObjKey = tokenData.dir + file_name;

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
    }
    
     var uploadType={};
    for(var key in imgTypes){
        uploadType['upload'+key]=function(uploader){
            upload(uploader,imgTypes[key]);               
        }
    }

   
    return {
        uploadImagesToAliOSS:uploadImagesToAliOSS,
        uploadType:uploadType
    };

})