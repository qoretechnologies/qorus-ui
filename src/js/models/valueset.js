var Qorus    = require('qorus/qorus'),
    settings = require('settings'),
    _        = require('underscore');

var Model = Qorus.Model.extend({
  urlRoot: settings.REST_API_PREFIX + '/valuesets/',
  dateAttributes: ['created', 'modified', 'values.created', 'values.modified'],
  parse: function (resp) {
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
      .done(function () {
        var values = self.get('values');
        var value = _.find(values, { key: opts.key });

        _.extend(value, opts);

        self.set({
          values: _.extend({}, values, _.omit(opts, 'action'))
        });
      }).then();

    return deferred;
  }

});

module.exports = Model;
