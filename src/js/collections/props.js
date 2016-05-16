define(function (require) {
  var Qorus    = require('qorus/qorus'),
      settings = require('settings');

  var Collection = Qorus.Collection.extend({
    url: settings.REST_API_PREFIX + '/system/props',
    model: Qorus.Model,
    parse: function (resp) {
      var propList = [];

      _.forEach(resp, function (properties, domain) {
        _.forEach(properties, function (value, key) {
          propList.push(_.extend({ domain: domain }, { prop: { key: key, value: value} }));
        });
      });

      return propList;
    }
  });

  return Collection;
});
