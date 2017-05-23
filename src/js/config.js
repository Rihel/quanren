/**
 * @description 所有模块的配置文件
 * 
 */
requirejs.config({
    paths: {
        'jQuery': 'lib/jQuery',
        'plupload': 'lib/plupload.full.min',
        cxselect: 'lib/jquery.cxselect.js', //API 文档 http://code.ciaoca.com/jquery/cxSelect/
        'boot': 'https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min',
        'mock': 'lib/mock',
        'tmpl': 'lib/template-web',
        'step': 'model/jquery.step',
    
    },
    map: {
        '*': {
            'css': 'lib/css'
        }
    },
    shim: {
        'jQuery': {
            exports: '$'
        },

        plupload: {
            exports: 'plupload'
        },
        'boot': ['jQuery'],
        'step': ['css!../css/jquery.step']
    }
});