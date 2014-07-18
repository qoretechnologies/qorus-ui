define(function (require) {
  var Qorus  = require('qorus/qorus'),
      _      = require('underscore'),
      Fields = require('qorus/fields'),
      LabelView, FormView;
  
  
  LabelView = Qorus.View.extend({
    tagName: 'label',
    initialize: function (options) {
      this.options = options;

      LabelView.__super__.initialize.apply(this, arguments);
    }
  });
  
  FormView = Qorus.View.extend({
    tagName: 'form',
    attributes: {
      name: 'qorus-form-view',
      method: 'get'
    },
    fields: false,
    initialize: function () {
      FormView.__super__.initialize.apply(this, arguments);
      this.fields = this.options.fields || this.fields;
      _.each(this.fields, function (item) {
        var View = Fields[item.type];
        var field = new View({ model: this.model });
        this.insertView(new LabelView({ attributes: { name: item.name, for: field.id } }), '');
        this.insertView(field, '');
      }, this);
    }
  });
  
  return FormView;
});
