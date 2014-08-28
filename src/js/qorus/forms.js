define(function (require) {
  var Qorus  = require('qorus/qorus'),
      _      = require('underscore'),
      FormView, ControlsView, LabelView, FieldView;
  
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
    onInit: function () {
      var field = new this.options.field(_.omit(this.options, 'field'));
      this.insertView(new LabelView({ 
        name: field.name, 
        attributes: { 
          name: field.name,
          'for': field.id(),
          'class': 'control-label'
        }
      }), 'self');
      this.insertView(new ControlsView({ content_view: field }), 'self');
    }
  });
  
  FormView = Qorus.View.extend({
    _fields: {},
    data: null,
    errors: [],
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
      this.data = this.options.data || this.data;
      _.each(this.fields, function (item) {
        var field = this.insertView(new FieldView({ 
          model: this.model,
          field: item
        }), 'self');
        
        console.log(field, item);
      }, this);
    },
    save: function () {},
    is_valid: function () {
      this.clean();
      return (this.errors.length < 1);
    },
    clean: function () {
      this.cleaned_data = {};
      _.each(this._fields, function (field) {
        var value;
        if (field.validator) {
          value = field.validate(this.data[field.name]);
        } else {
          value = this.data[field.name];
        }
        if (value) this.cleaned_data[field.name] = value;
      }, this);
    }
  });
  
  return FormView;
});
