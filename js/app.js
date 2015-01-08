window.App = Ember.Application.create();

App.Router.map(function () {
    this.route('login')
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
        var controller = this.controllerFor('application');
        if (!controller.get('loggedIn')) {
            this.transitionTo('login');
        }
    }
});

App.IndexRoute = App.NeedsLoginRoute.extend();
App.LoginRoute = Ember.Route.extend({
    activate: function () {
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
    username: '',
    password: '',

    actions: {
        login: function () {
            RESTWARS.init(this.get('serverAddress'));
            RESTWARS.setCredentials(this.get('username'), this.get('password'));
            var that = this;
            RESTWARS.player.me().done(function (data) {
                that.set('controllers.application.loggedIn', true);
                that.transitionToRoute('index');
            });
        }
    }
});

App.IndexController = Ember.Controller.extend({
    planets: [],
    init: function () {
        this._super();

        var that = this;
        RESTWARS.player.me().done(function (data) {
            that.set('planets', data.planets);
        });
    }
});