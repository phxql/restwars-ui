window.App = Ember.Application.create();

App.Router.map(function () {
    this.route('login');
    this.resource('planet', {path: '/planet/:location'}, function () {
        this.route('new-construction-site');
    });
});

App.ApplicationController = Ember.Controller.extend({
    /**
     * The current logged in user.
     */
    loggedIn: false
});

/**
 * A route which ensures the user is logged in. If the user isn't logged in, a transition to the login page will take place.
 */
App.NeedsLoginRoute = Ember.Route.extend({
    activate: function () {
        this._super();
        //var controller = this.controllerFor('application');
        //if (!controller.get('loggedIn')) {
        //    this.transitionTo('login');
        //}

        RESTWARS.init('http://localhost:8080/');
    }
});

App.LoginRoute = Ember.Route.extend({
    activate: function () {
        this._super();
        // Redirect to index page if the user is already logged in.
        var controller = this.controllerFor('application');
        if (controller.get('loggedIn')) {
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
                that.set('controllers.application.loggedIn', true);
                that.transitionToRoute('index');
            });
        }
    }
});

App.IndexRoute = App.NeedsLoginRoute.extend({
    setupController: function (controller, model) {
        controller.setup(model);
    }
});
App.IndexController = Ember.Controller.extend({
    planets: [],
    events: [],
    technologies: [],

    setup: function (model) {
        var self = this;

        RESTWARS.planet.planets().done(function (data) {
            self.set('planets', data)
        });
        RESTWARS.event.events().done(function (data) {
            self.set('events', data)
        });
        RESTWARS.technology.technologies().done(function (data) {
            self.set('technologies', data)
        });
    }
});

App.PlanetIndexRoute = App.NeedsLoginRoute.extend({
    model: function () {
        return this.modelFor('planet');
    },
    setupController: function (controller, model) {
        controller.setup(model);
    }
});

App.PlanetIndexController = Ember.Controller.extend({
    planet: null,
    buildings: [],
    ships: [],
    constructionSites: [],
    researches: [],
    shipsInConstruction: [],

    setup: function (model) {
        var self = this;
        var location = model.location;

        RESTWARS.planet.planet(location).done(function (data) {
            self.set('planet', data)
        });
        RESTWARS.planet.buildings(location).done(function (data) {
            self.set('buildings', data)
        });
        RESTWARS.planet.ships(location).done(function (data) {
            self.set('ships', data)
        });
        RESTWARS.planet.constructionSites(location).done(function (data) {
            self.set('constructionSites', data)
        });
        RESTWARS.planet.researches(location).done(function (data) {
            self.set('researches', data)
        });
        RESTWARS.planet.shipsInConstruction(location).done(function (data) {
            self.set('shipsInConstruction', data)
        });
    }
});

App.PlanetNewConstructionSiteRoute = App.NeedsLoginRoute.extend({
    model: function () {
        return this.modelFor('planet');
    },
    setupController: function (controller, model) {
        controller.setup(model);
    }
});

App.PlanetNewConstructionSiteController = Ember.Controller.extend({
    location: null,
    types: [],
    selectedType: null,

    setup: function (model) {
        this.set('location', model.location);

        var self = this;
        RESTWARS.metadata.buildings().done(function (data) {
            self.set('types', data);
        });
    },
    actions: {
        create: function () {
            var location = this.get('location');

            var self = this;
            RESTWARS.planet.createConstructionSite(location, this.get('selectedType')).done(function () {
                self.transitionToRoute('planet', location);
            });
        }
    }
});