var RESTWARS = RESTWARS || (function ($) {
        this.baseUrl = null;

        var ajaxSetup = function () {
            $.ajaxSetup({
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
                ajaxSetup();
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
                    var data = JSON.stringify({type: type});
                    return $.post(that.baseUrl + 'v1/planet/' + location + '/construction-site', data);
                },
                researches: function (location) {
                    return $.get(that.baseUrl + 'v1/planet/' + location + '/research');
                },
                createResearch: function (location, type) {
                    var data = JSON.stringify({type: type});
                    return $.post(that.baseUrl + 'v1/planet/' + location + '/research', data);
                },
                shipsInConstruction: function (location) {
                    return $.get(that.baseUrl + 'v1/planet/' + location + '/ship-in-construction');
                },
                createShipInConstruction: function (location, type) {
                    var data = JSON.stringify({type: type});
                    return $.post(that.baseUrl + 'v1/planet/' + location + '/ship-in-construction', data);
                },
                planets: function () {
                    return $.get(that.baseUrl + 'v1/planet');
                },
                createFlight: function (start, destination, type, ships, cargoCrystals, cargoGas) {
                    cargoCrystals = (typeof cargoCrystals === "undefined") ? 0 : cargoCrystals;
                    cargoGas = (typeof cargoGas === "undefined") ? 0 : cargoGas;

                    var data = JSON.stringify({
                        type: type,
                        ships: ships,
                        cargoCrystals: cargoCrystals,
                        cargoGas: cargoGas,
                    });

                    return $.post(that.baseUrl + 'v1/planet/' + start + '/flight/to/' + destination, data);
                },
                ownFlights: function (location) {
                    return $.get(that.baseUrl + 'v1/planet/' + location + '/flight/own');
                },
                telescopeScan: function (location) {
                    return $.get(that.baseUrl + 'v1/planet/' + location + '/telescope/scan');
                }
            },
            player: {
                me: function () {
                    return $.get(that.baseUrl + 'v1/player');
                }
            },
            event: {
                events: function (since, max) {
                    since = (typeof since === "undefined") ? 1 : since;

                    if (typeof max === "undefined") {
                        return $.get(that.baseUrl + 'v1/event?since=' + since);
                    } else {
                        return $.get(that.baseUrl + 'v1/event?since=' + since + '&max=' + max);
                    }
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
                },
                technologies: function () {
                    return $.get(that.baseUrl + 'v1/metadata/technology');
                },
                ships: function () {
                    return $.get(that.baseUrl + 'v1/metadata/ship');
                },
                flightTypes: function () {
                    return $.get(that.baseUrl + 'v1/metadata/flight/type');
                }
            },
            fight: {
                withId: function (id) {
                    return $.get(that.baseUrl + 'v1/fight/' + id);
                },
                fights: function (since) {
                    since = (typeof since === "undefined") ? 1 : since;

                    return $.get(that.baseUrl + 'v1/fight/own?since=' + since);
                }
            },
            flight: {
                own: function () {
                    return $.get(that.baseUrl + 'v1/flight/own');
                }
            }
        };
    }(jQuery));