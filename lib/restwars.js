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
            planet: {
                planet: function (location) {
                    return $.get(that.baseUrl + 'v1/planet/' + location);
                },
                buildings: function (location) {
                    return $.get(that.baseUrl + 'v1/planet/' + location + '/building');
                },
                ships: function (location) {
                    return $.get(that.baseUrl + 'v1/planet/' + location + '/ship');
                },
                constructionSites: function (location) {
                    return $.get(that.baseUrl + 'v1/planet/' + location + '/construction-site');
                },
                createConstructionSite: function (location, type) {
                    return $.post(that.baseUrl + 'v1/planet/' + location + '/construction-site', {
                        'type': type
                    });
                },
                researches: function (location) {
                    return $.get(that.baseUrl + 'v1/planet/' + location + '/research');
                },
                shipsInConstruction: function (location) {
                    return $.get(that.baseUrl + 'v1/planet/' + location + '/ship-in-construction');
                },
                planets: function () {
                    return $.get(that.baseUrl + 'v1/planet');
                }
            },
            player: {
                me: function () {
                    return $.get(that.baseUrl + 'v1/player');
                }
            },
            event: {
                events: function (since) {
                    since = (typeof since === "undefined") ? 1 : since;

                    return $.get(that.baseUrl + 'v1/event?since=' + since);
                }
            },
            technology: {
                technologies: function () {
                    return $.get(that.baseUrl + 'v1/technology');
                }
            },
            metadata: {
                buildings: function () {
                    return $.get(that.baseUrl + 'v1/metadata/building');
                }
            }
        };
    }(jQuery));