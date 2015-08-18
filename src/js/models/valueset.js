var Qorus    = require('qorus/qorus'),
    settings = require('settings'),
    _        = require('underscore');

var Model = Qorus.Model.extend({
  urlRoot: settings.REST_API_PREFIX + '/valuesets/',
  dateAttributes: ['created', 'modified', 'values.created', 'values.modified'],
  parse: function (resp, options) {
    resp = Model.__super__.parse.call(this, resp, options);
    if (resp.values) {
      var values = _.map(resp.values, function (val) {
        return val;
      });

      resp.values = values;
    }

    return resp;
  },

  /**
   * Executes explicit REST call for defined action
   * @param {Object} opts
   * @return {Object} - jqXHR promise
   */
  doAction: function (opts) {
    var self = this;

    var deferred = $.put(_.result(this, 'url'), opts)
      .done(function (resp) {

        var values = self.get('values');
        if (resp) {
          var pos = _.indexOf(values, _.find(values, { key: resp.key }));
          if (pos !== -1) {
            values.splice(pos, 1, resp);
          } else {
            values.push(resp);
          }
        } else {
          values = _.filter(values, function (v) { return v.key !== opts.key; });
        }

        self.set({
          values: values
        });
      }).then();

    return deferred;
  },

  /**
   * Get Valueset dump from REST
   */
  getDump: function () {
    var deferred = $.get(_.result(this, 'url'), { action: 'dump'});

    return deferred;
  }

});

module.exports = Model;
