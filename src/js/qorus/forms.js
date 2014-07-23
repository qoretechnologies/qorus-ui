define(function (require) {
  var Qorus  = require('qorus/qorus'),
      _      = require('underscore'),
      Fields = require('qorus/fields'),
      FormView, ControlsView, LabelView;
  
  LabelView = Qorus.View.extend({
    tagName: 'label',
    onRender: function () {
      this.$el.html(this.options.name);
    }
  });
  
  ControlsView = Qorus.View.extend({
    className: 'controls',
    preRender: function () {
      this.insertView(this.options.content_view, 'self');
    }
  });

  FieldView = Qorus.View.extend({
    className: 'control-group',
    preRender: function () {
      var field = new this.options.field(this.options);
      this.insertView(new LabelView({ 
        name: field.name, 
        attributes: { 
          name: field.name, 
          for: field.id(), 
          'class': 'control-label' 
        }
      }), 'self');
      this.insertView(new ControlsView({ content_view: field }), 'self');
    }
  });
  
  FormView = Qorus.View.extend({
    name: 'qorus-form-view',
    tagName: 'form',
    attributes: {
      name: this.name,
      method: 'get'
    },
    fields: false,
    initialize: function () {
      FormView.__super__.initialize.apply(this, arguments);
      this.fields = this.options.fields || this.fields;
      _.each(this.fields, function (item) {
        this.insertView(new FieldView({ 
          model: this.model,
          field: item
        }), 'self');
      }, this);
    }
  });
  
  return FormView;
});
