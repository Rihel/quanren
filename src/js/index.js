require(['jQuery', 'model/title', 'model/api'], function ($, title, api) {
    title({
        title: '首页',
    }).then(function (title) {
        $('.index-box').before(title);
    });
    api.userGet()
        .then(function (data) {
            console.log(data);
        })
    api.orderPage()
        .then(function (data) {
            console.log(data);
        })
})