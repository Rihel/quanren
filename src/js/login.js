require([
        'jQuery',
        'model/tem',
        'model/api',
        'model/until'
    ],
    function($, tem, api, until) {

        var loginBox = $('.login-box');
        var username = loginBox.find('#username');
        var password = loginBox.find('#password');
        username.val(until.getItem('username') || '');
        password.val(until.getItem('password') || '');
        $('.login-btn').on('click', function() {
            var name = username.val(),
                pwd = password.val();
            if (until.isEmpty(name) || until.isEmpty(pwd)) {
                console.log('请输入用户名或密码');
                return false;
            }
            if (!until.isPhone(name)) {
                console.log('请输入正确的用户名');
                return false;
            }
            api.login(name, pwd)
                .then(function(data) {
                    if (data.success) {
                        until.setItem('username', name);
                        until.setItem('password', pwd);
                        until.jumpPage('index');
                    }
                })

        })


    })