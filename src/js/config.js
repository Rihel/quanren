requirejs.config({
    paths: {
        'jQuery': 'lib/jQuery',
        'plupload': 'lib/plupload.full.min',
        'boot': 'https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min',
        'mock': 'lib/mock',
        'tmpl': 'lib/template-web',
        'step': 'model/jquery.step'
    },
    shim: {
        'jQuery': {
            exports: '$'
        },
        plupload: {
            exports: 'plupload'
        },
        'boot': ['jQuery']
    }
});

