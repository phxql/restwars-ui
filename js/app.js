window.App = Ember.Application.create();

App.Router.map(function () {
    this.route('login');
    this.resource('planet', {path: '/planet/:location'}, function () {
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
    model: function () {
        var controller = this.controllerFor('application');
        if (!controller.get('loggedIn')) {
            this.transitionTo('login');
            return false;
        }

        // RESTWARS.init('http://localhost:8080/');

        return true;
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
App.IndexRoute = App.NeedsLoginRoute.extend({
    model: function () {
        if (this._super()) {
            return Ember.RSVP.hash({
                planets: RESTWARS.planet.planets(),
                events: RESTWARS.event.events(),
                technologies: RESTWARS.technology.technologies()
            });
        }
    }
});
App.PlanetRoute = App.NeedsLoginRoute.extend({
    model: function (params) {
        if (this._super()) {
            var location = params.location;

            return Ember.RSVP.hash({
                planet: RESTWARS.planet.planet(location),
                buildings: RESTWARS.planet.buildings(location),
                ships: RESTWARS.planet.ships(location),
                constructionSites: RESTWARS.planet.constructionSites(location),
                researches: RESTWARS.planet.researches(location),
                shipsInConstruction: RESTWARS.planet.shipsInConstruction(location)
            });
        }
    },
    setupController: function (controller, location) {
        controller.set('location', location);
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

App.PlanetController = Ember.Controller.extend({});