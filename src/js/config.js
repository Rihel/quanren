requirejs.config({
    paths: {
        'jQuery': 'lib/jQuery',
        'boot': 'https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min',
        'mock': 'lib/mock',
        'tmpl': 'lib/template-web',
    },
    shim: {
        'jQuery': {
            exports: '$'
        },
        'boot': ['jQuery']
    }
});

require(['jQuery'], function($) {
    $.get('include/header.html')
        .then(function(data) {
            $('.main').before(data);
            return $.get('include/footer-nav.html')
        }).then(function(footer) {

            if (window.location.href.indexOf('login') < 0) {
                $('.main').after(footer);
            }

        })
})