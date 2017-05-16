require([
        'jQuery',

        'model/tem',
        'model/api',
        'model/until',
       
    ],
    function ($, tem, api, until) {

        var loginBox = $('.login-box');
        var username = loginBox.find('#username');
        var password = loginBox.find('#password');
        username.val(until.getItem('username') || '');
        password.val(until.getItem('password') || '');

        username.trigger('change');
        username.on('change', function () {
            var name = username.val();
            if (!until.isPhone(name)) {
                $(this).parent().addClass('has-error');
                $(this).next().addClass('fa-close');
                $(this).nextAll('.message').html('请输入正确的手机号码').css('color', '#a94442');
            } else {
                $(this).parent().removeClass('has-error').addClass('has-success');
                $(this).next().removeClass('fa-close').addClass('fa-check');
                $(this).nextAll('.message').html('');
                password.removeAttr('disabled');
                $('.login-btn').removeAttr('disabled');
            }
        })
        $('.login-btn').on('click', function () {
            var name = username.val();
            var pwd = password.val();
         
            api.login(name, pwd)
                .then(function (data) {
                    if (data.success) {
                        until.setItem('username', name);
                        until.setItem('password', pwd);
                        until.jumpPage('index');
                    }
                })

        })


    })