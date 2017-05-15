define(function(require) {
    var $ = require('jQuery');


    function until() {
        this.baseName = 'QUANREN_';
    }
    until.prototype = {
        constructor: until,
        getItem: function(key) {
            return JSON.parse(window.localStorage.getItem(this.baseName + key));
        },
        setItem: function(key, value) {
            window.localStorage.setItem(this.baseName + key, JSON.stringify(value));
        },
        removeItem: function(key) {
            window.localStorage.removeItem(this.baseName + key);
        },
        isEmpty: function(value) {
            return (value === null || value === undefined || value === '') ? true : false;
        },
        isPhone: function(value) {
            if (this.isEmpty(value)) {
                return;
            }
            console.log(1);
            if (value.length === 11) {
                return /^1[358]\d{9}/g.test(value) ? true : false;
            } else {
                return false;
            }
        },
        jumpPage: function(name) {
            window.location.href = name.concat('.html');
        }
    }

    return new until();
})