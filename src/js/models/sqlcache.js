define(function (require) {
  var Backbone = require('backbone'),
      _        = require('underscore'),
      settings = require('settings'),
      Model;

  Model = Backbone.Model.extend({
    url: settings.REST_API_PREFIX + '/system/sqlcache',
    actions: ['deleteCache'],

    parse: function (response) {
      var datasources = _.map(response, function (ds, key) {
        var tables = _.map(ds.tables, function (table, name) {
          return _.extend({}, table, { name: name, datasource: key });
        });

        return {
          name: key,
          tables: tables
        };
      });

      return { datasources: datasources };
    },

    doAction: function (opts) {
      opts = opts || {};

      if (!opts.datasource || !opts.name) {
        console.warn('Missing opts keys datasource or name');
        return null;
      }

      return $.put(this.url, _.pick(opts, ['action', 'datasource', 'name']));
    }
  });

  return Model;
});
