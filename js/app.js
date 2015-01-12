window.App = Ember.Application.create();

App.Router.map(function () {
    this.route('login');
    this.resource('planet', {path: '/planet/:location'}, function () {
        this.route('new-construction-site');
        this.route('new-research');
    });
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
            var that = this;
            RESTWARS.player.me().done(function () {
                var controller = that.controllerFor('application');
                //var model = that.modelFor('application');
                controller.model.loggedIn = true;
                that.transitionToRoute('index');
            });
        }
    }
});

App.IndexRoute = App.NeedsLoginRoute.extend({
    model: function () {
        return Ember.RSVP.hash({
            planets: RESTWARS.planet.planets(),
            events: RESTWARS.event.events(),
            technologies: RESTWARS.technology.technologies()
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
            shipsInConstruction: RESTWARS.planet.shipsInConstruction(location)
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

    actions: {
        create: function () {
            var location = this.get('model.location');

            var self = this;
            RESTWARS.planet.createConstructionSite(location, this.get('selectedType')).done(function () {
                self.transitionToRoute('planet', location);
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

    actions: {
        create: function () {
            var location = this.get('model.location');

            var self = this;
            RESTWARS.planet.createResearch(location, this.get('selectedType')).done(function () {
                self.transitionToRoute('planet', location);
            });
        }
    }
});
