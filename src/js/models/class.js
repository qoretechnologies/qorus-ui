define(function (require) {
  var settings = require('settings'),
      Qorus = require('qorus/qorus'),
      Model;

  Model = Qorus.Model.extend({
    idAttribute: "classid",
    urlRoot: settings.REST_API_PREFIX + '/classes/',
    dateAttributes: ['created', 'modified'],

    defaults: {
      type: 'class'
    },

    initialize: function (opts) {
      if (opts.id) {
        this.id = opts.id;
        delete opts.id;
      }

      Model.__super__.initialize.call(this, opts);
    },

    parse: function (response, options) {
      response = Model.__super__.parse.call(this, response, options);

      if (response.body){
        response.body = $.trim(response.body);
        response.body = response.body.replace(/\\n/g, '\n');
        response.body = response.body.replace(/\\t/g, '    ');
      }

      return response;
    }
  });

  return Model;
});