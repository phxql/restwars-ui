var RESTWARS = RESTWARS || (function ($) {
        this.baseUrl = null;

        var ajaxSetup = function (username, password) {
            $.ajaxSetup({
                username: username,
                password: password,
                xhrFields: {
                    withCredentials: true
                },
                contentType: 'application/json'
            });
        };

        var that = this;
        return {
            init: function (baseUrl) {
                if (baseUrl.endsWith('/')) {
                    that.baseUrl = baseUrl;
                } else {
                    that.baseUrl = baseUrl + '/';
                }
                ajaxSetup(null, null);
            },
            setCredentials: function (username, password) {
                ajaxSetup(username, password);
            },
            system: {
                ping: function () {
                    return $.get(that.baseUrl + 'v1/system/ping');
                }
            },
            player: {
                me: function () {
                    return $.get(that.baseUrl + 'v1/player');
                }
            }
        };
    }(jQuery));