define(function (require) {
  var Qorus             = require('qorus/qorus'),
      ErrorsTpl         = require('tpl!templates/errors/list.html'),
      ErrorsTableTpl    = require('text!templates/errors/table.html'),
      ErrorsRowTpl      = require('text!templates/errors/row.html'),
      ErrorsCollection  = require('collections/errors'),
      ErrorsView;

  ErrorsView = Qorus.TableView.extend({
    initialize: function (opts) {
      opts = opts || {};
      opts.collection = new ErrorsCollection([], { type: 'global' });
      opts.collection.fetch();
      ErrorsView.__super__.initialize.call(this, opts);
    },
    template: ErrorsTableTpl,
    row_template: ErrorsRowTpl
  });

  return ErrorsView;
});
