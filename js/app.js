window.App = Ember.Application.create();

App.Router.map(function () {
    this.route('login');
    this.resource('planet', {path: '/planet/:location'}, function () {
        this.route('new-construction-site');
        this.route('new-research');
        this.route('new-ship-in-construction');
        this.route('new-flight');
        this.route('telescope-scan');
    });
    this.route('fight', {path: '/fight/:fight_id'});
});

App.ApplicationRoute = Ember.Route.extend({
    model: function () {
        return {
            loggedIn: false
        }
    }
});
App.ApplicationController = Ember.Controller.extend({
});

/**
 * A route which ensures the user is logged in. If the user isn't logged in, a transition to the login page will take place.
 */
App.NeedsLoginRoute = Ember.Route.extend({
    beforeModel: function () {
        this._super();
        //var model = this.modelFor('application');
        //if (!model.loggedIn) {
        //    this.transitionTo('login');
        //}

        RESTWARS.init('http://localhost:8080/');
    }
});

App.LoginRoute = Ember.Route.extend({
    beforeModel: function () {
        this._super();
        // Redirect to index page if the user is already logged in.
        var model = this.modelFor('application');
        if (model.loggedIn) {
            this.transitionTo('index');
        }
    }
});
App.LoginController = Ember.Controller.extend({
    needs: ['application'],
    serverAddress: 'http://localhost:8080/',

    actions: {
        login: function () {
            RESTWARS.init(this.get('serverAddress'));
            var self = this;
            RESTWARS.player.me().done(function () {
                self.set('controllers.application.model.loggedIn', true);
                self.transitionToRoute('index');
            });
        }
    }
});

App.IndexRoute = App.NeedsLoginRoute.extend({
    model: function () {
        return Ember.RSVP.hash({
            planets: RESTWARS.planet.planets(),
            events: RESTWARS.event.events(1, 20).then(function (events) {
                return events.data.sort(function (e1, e2) {
                    return e2.round - e1.round;
                });
            }),
            technologies: RESTWARS.technology.technologies(),
            fights: RESTWARS.fight.fights(),
            flights: RESTWARS.flight.own()
        });
    }
});
App.IndexController = Ember.Controller.extend({});

App.PlanetRoute = App.NeedsLoginRoute.extend({
    model: function (params) {
        return {
            location: params.location
        }
    }
});

App.PlanetIndexRoute = App.NeedsLoginRoute.extend({
    model: function () {
        var parent = this.modelFor('planet');
        var location = parent.location;

        return Ember.RSVP.hash({
            location: location,
            planet: RESTWARS.planet.planet(location),
            buildings: RESTWARS.planet.buildings(location),
            ships: RESTWARS.planet.ships(location),
            constructionSites: RESTWARS.planet.constructionSites(location),
            researches: RESTWARS.planet.researches(location),
            shipsInConstruction: RESTWARS.planet.shipsInConstruction(location),
            flights: RESTWARS.planet.ownFlights(location)
        });
    }
});
App.PlanetIndexController = Ember.Controller.extend({});

App.PlanetNewConstructionSiteRoute = App.NeedsLoginRoute.extend({
    model: function () {
        var parent = this.modelFor('planet');

        return Ember.RSVP.hash({
            location: parent.location,
            buildingTypes: RESTWARS.metadata.buildings()
        });
    }
});
App.PlanetNewConstructionSiteController = Ember.Controller.extend({
    selectedType: null,
    error: null,

    actions: {
        create: function () {
            var location = this.get('model.location');

            var self = this;
            RESTWARS.planet.createConstructionSite(location, this.get('selectedType')).done(function () {
                self.transitionToRoute('planet', location);
            }).fail(function (jqXHR) {
                self.set('error', jqXHR.responseText);
            });
        }
    }
});

App.PlanetNewResearchRoute = App.NeedsLoginRoute.extend({
    model: function () {
        var parent = this.modelFor('planet');

        return Ember.RSVP.hash({
            location: parent.location,
            technologyTypes: RESTWARS.metadata.technologies()
        });
    }
});
App.PlanetNewResearchController = Ember.Controller.extend({
    selectedType: null,
    error: null,

    actions: {
        create: function () {
            var location = this.get('model.location');

            var self = this;
            RESTWARS.planet.createResearch(location, this.get('selectedType')).done(function () {
                self.transitionToRoute('planet', location);
            }).fail(function (jqXHR) {
                self.set('error', jqXHR.responseText);
            });
        }
    }
});

App.PlanetNewShipInConstructionRoute = App.NeedsLoginRoute.extend({
    model: function () {
        var parent = this.modelFor('planet');

        return Ember.RSVP.hash({
            location: parent.location,
            shipTypes: RESTWARS.metadata.ships()
        });
    }
});
App.PlanetNewShipInConstructionController = Ember.Controller.extend({
    selectedType: null,
    error: null,

    actions: {
        create: function () {
            var location = this.get('model.location');

            var self = this;
            RESTWARS.planet.createShipInConstruction(location, this.get('selectedType')).done(function () {
                self.transitionToRoute('planet', location);
            }).fail(function (jqXHR) {
                self.set('error', jqXHR.responseText);
            });
        }
    }
});

App.PlanetNewFlightRoute = App.NeedsLoginRoute.extend({
    model: function () {
        var parent = this.modelFor('planet');
        var location = parent.location;

        return Ember.RSVP.hash({
            location: location,
            ships: RESTWARS.planet.ships(location),
            flightTypes: RESTWARS.metadata.flightTypes()
        });
    }
});

App.PlanetNewFlightController = Ember.Controller.extend({
    destination: null,
    selectedType: null,
    crystals: 0,
    gas: 0,
    error: null,

    actions: {
        create: function () {
            var location = this.get('model.location');

            var self = this;
            var ships = this.get('model.ships');

            RESTWARS.planet.createFlight(location, this.get('destination'), this.get('selectedType'), ships.data, this.get('crystals'), this.get('gas')).done(function () {
                self.transitionToRoute('planet', location);
            }).fail(function (jqXHR) {
                self.set('error', jqXHR.responseText);
            });
        }
    }
});

App.PlanetTelescopeScanRoute = App.NeedsLoginRoute.extend({
    model: function () {
        var parent = this.modelFor('planet');
        var location = parent.location;

        return Ember.RSVP.hash({
            location: location,
            result: RESTWARS.planet.telescopeScan(location)
        });
    }
});

App.FightRoute = App.NeedsLoginRoute.extend({
    model: function (params) {
        return RESTWARS.fight.withId(params.fight_id);
    }
});
