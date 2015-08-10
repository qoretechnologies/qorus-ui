var Reflux  = require('reflux'),
    Actions = require('cjs!views.react/actions/url'),
    _       = require('underscore'),
    sprintf = require('sprintf');

var Store = Reflux.createStore({
  listenables: Actions,

  getCurrentUrl: function () {
    return sprintf('/%(route)s/%(path)/');
  },

  onRegister: function (route, params) {
    if (!_.has(this.routes, 'router')) {

    } else {
      console.warn(sprintf('Route %s already defined!', router));
    }
  },

  onUpdate: function (params) {

  },

  onNavigate: function (route, params, trigger) {

  }
});

module.exports = Store;
