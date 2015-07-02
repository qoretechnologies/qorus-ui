define(function(require) {
  var settings = require('settings'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      Model;

  function makeDict(s) {
    var cl = s.replace(/(^\()|(\)$)/g, ''),
        idx = cl.indexOf(":"),
        key = cl.slice(0,idx).trim().replace(/(^\")|(\"$)/g, ''),
        val = cl.slice(idx+1).trim().replace(/(^\")|(\"$)/g, '');

    return { type: key, value: val };
  }

  Model = Qorus.Model.extend({
    urlRoot: settings.REST_API_PREFIX + '/mappers',
    idAttribute: 'mapperid',
    parse: function (resp) {
      var field_source =_.map(resp.field_source, function (fs, key) {
        return _.extend({ key: key }, makeDict(fs));
      });

      resp.field_source = field_source;

      return resp;
    }
  });

  return Model;
});
