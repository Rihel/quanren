define(function (require) {
    var $ = require('jQuery'),
        plupload = require('plupload');

    var postTemplate = '--{boundary}\r\n' +
        'Content-Disposition: form-data; name="name"\r\n\r\n' +
        "{filename}\r\n" +
        '--{boundary}\r\n' +
        'Content-Disposition: form-data; name="key"\r\n\r\n' +
        "{filefullname}\r\n" +
        '--{boundary}\r\n' +
        'Content-Disposition: form-data; name="policy"\r\n\r\n' +
        "{policy}\r\n" +
        '--{boundary}\r\n' +
        'Content-Disposition: form-data; name="OSSAccessKeyId"\r\n\r\n' +
        "{accessID}\r\n" +
        '--{boundary}\r\n' +
        'Content-Disposition: form-data; name="success_action_status"\r\n\r\n' +
        '200\r\n' +
        '--{boundary}\r\n' +
        'Content-Disposition: form-data; name="signature"\r\n\r\n' +
        '{signature}\r\n' +
        '--{boundary}\r\n' +
        'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n' +
        'Content-Type: {filetype}\r\n\r\n' +
        '{filecontent}' +
        '\r\n--{boundary}--';


    //var tokenURL = 'http://112.74.47.209:8080/v1/api/auth/upload/token';
    var tokenURL = 'http://m.qren163.cn:8080/v1/api/auth/upload/token';

    function CreateUploader(browseBtn, browseContainer, onInit, onUploadingFunc, onSuccessFunc, onErrorFunc) {
        var uploader = new plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',
            //resize : {width : 1024, height : 768, quality : 90, crop: true},
            browse_button: browseBtn,
            //multi_selection: false,
            container: browseContainer,
            flash_swf_url: '../js/lib/plupload-2.1.2/js/Moxie.swf',
            silverlight_xap_url: '../js/lib/plupload-2.1.2/js/Moxie.xap',
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
            },

            init: {
                PostInit: function () {
                    //console.log('on uploader post init();');
                    if (onInit != null && onInit != undefined) {
                        onInit();
                    }
                },

                FilesAdded: function (up, files) {

                },

                BeforeUpload: function (up, file) {

                },

                UploadProgress: function (up, file) {
                    if (onUploadingFunc != null && onUploadingFunc != undefined) {
                        onUploadingFunc(up, file);
                    }
                    //console.log("UploadProgress:" + file.percent);
                },

                FileUploaded: function (uploader, file, response) {
                    var ossName = uploader.getOption('multipart_params')['key'];
                    console.log("FileUploaded :" + file.name + " oss name:" + ossName);
                    if (onSuccessFunc != null && onSuccessFunc != undefined) {
                        onSuccessFunc(ossName);
                    }
                    //dispose after file uploaded:
                    uploader.destroy();
                },

                Error: function (up, err) {
                    if (onErrorFunc != null && onErrorFunc != undefined) {
                        onErrorFunc(up, err);
                    }
                    console.error("\nError xml:");
                    console.error(err)
                }
            }
        });

        uploader.init();
        // console.log('create uploader:');
        // console.log(uploader);
        return uploader;
    }

    function QueryOSSToken(SuccessFunc, ErrorFunc) {
        var url = tokenURL;
        $.ajax({
            url: url,
            context: document.body,
            dataType: "json",
            success: function (response, textStatus, jqXHR) {
                var success = response["success"];
                if (success == false) {
                    ErrorFunc();
                    return;
                }
                var tokenData = response["data"];
                SuccessFunc(tokenData);
            }
        });
    }



    function MakeBoundary(len) {
        var text = "";
        var possible = "0123456789";

        for (var i = 0; i < len; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }



    /* 
    把fileinput控件中的file对象上传到阿里OSS.
    fileinput : fileinput 控件 (DOM element);
    customName - 自定义file name
    onUploadingFunc - uploading的回调
    successFunc - 完成时候的回调
    errorFunc - 出错的回调
    onSetFinalOSSName - 回调设置最终上传的 OSS 对象的完整的相对路径字串。
    */
    function UploadImagesToAliOSS(fileinput, customName, onUploadingFunc, onSuccessFunc, onErrorFunc, onSetFinalOSSName) {

        String.prototype.postfix = function () {
            var d = /\.[^\.]+$/.exec(this);
            return d;
        };

        function GetInputFileName(fileinputDOM) {
            /*console.log("for samsung1:");
            console.log(fileinputDOM.files);
            console.log("for samsung2:");
            console.log(fileinputDOM.files[0]);
            console.log("for samsung3:");
            console.log(fileinputDOM.files[0].name);*/

            var postfix = fileinputDOM.files[0].name.postfix();
            //bug for samsung :
            console.log(postfix);
            if (postfix == undefined || postfix == null) {
                postfix = ".jpg";
            }
            //使用 customName 指定上传文件的名字,后缀保留
            //var fileSuffix = fileinputDOM.files[0].name.postfix().toString().toLowerCase();
            var fileSuffix = postfix.toString().toLowerCase();
            return customName + fileSuffix;
        }

        //pluploader ready之后，加载 input 中的文件
        var onUploaderInit = function () {
            plUploader.addFile(fileinput.files[0]);
            //console.log("has files:" + plUploader.files.length);
            //读取 提交OSS必须的 token :
            QueryOSSToken(onOSSTokenSuccess, onOSSTokenError);
        };

        //创建 uploader
        var plUploader = CreateUploader('plupload_browse', 'plupload_container',
            onUploaderInit,
            onUploadingFunc,
            onSuccessFunc,
            onErrorFunc);

        //获取 OSS Token 成功: 
        var onOSSTokenSuccess = function (tokenData) {
            console.log(tokenData);
            var ossObjKey = tokenData["dir"] + GetInputFileName(fileinput);
            console.log("提交到OSS对象路径:" + ossObjKey);
            if (onSetFinalOSSName) {
                onSetFinalOSSName(ossObjKey);
            }
            var uploadParams = {
                'key': ossObjKey,
                'policy': tokenData["policy"],
                'OSSAccessKeyId': tokenData["accessId"],
                'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                'callback': "",
                'signature': tokenData["signature"],
            };
            plUploader.setOption({
                'url': tokenData["formUrl"],
                'multipart_params': uploadParams
            });

            //开始上传
            plUploader.start();
        };

        var onOSSTokenError = function () {};
        //console.log(uploader);
    }
    return UploadImagesToAliOSS;

})