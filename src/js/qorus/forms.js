define(function (require) {
  var Qorus    = require('qorus/qorus'),
      _        = require('underscore'),
      $        = require('jquery'),
      ErrorTpl = require('tpl!templates/forms/error.html'),
      FormView, ControlsView, LabelView, FieldView;
  
  require('sprintf');
  
  LabelView = Qorus.View.extend({
    tagName: 'label',
    onRender: function () {
      this.$el.html(this.options.name);
    },
    onError: function () {
      this.$el.addClass('text-error');
    },
    onValid: function () {
      this.$el.removeClass('text-error');
    }
  });
  
  ControlsView = Qorus.View.extend({
    className: 'controls',
    postInit: function () {
      this.insertView(this.options.content_view, 'self');
    },
    onError: function () {
      this.$el.addClass('text-error');
    },
    onValid: function () {
      this.$el.removeClass('text-error');
    }
  });

  FieldView = Qorus.View.extend({
    className: 'control-group',
    postInit: function () {
      var label, control;
      this.field = new this.options.field(_.omit(this.options, 'field'));
      label = this.insertView(new LabelView({ 
        name: this.field.name, 
        attributes: { 
          name: this.field.name,
          'for': this.field.id(),
          'class': 'control-label'
        }
      }), 'self');
      control = this.insertView(new ControlsView({ content_view: this.field }), 'self');
      
      this.listenTo(this.field, 'error', $.proxy(label.onError, label));
      this.listenTo(this.field, 'error', $.proxy(control.onError, control));
      this.listenTo(this.field, 'error', this.onError);
      this.listenTo(this.field, 'valid', $.proxy(label.onValid, label));
      this.listenTo(this.field, 'valid', $.proxy(control.onValid, control));
      this.listenTo(this.field, 'valid', this.onValid);
    },
    onError: function (msg) {
      var $err = $('<div class="error-list" />').html(ErrorTpl({ error: msg }));
      this.$el.find('.error-list').remove();
      this.$el.append($err);
    },
    onValid: function () {
      this.$el.find('.error-list').remove();
    }
  });
  
  FormView = Qorus.View.extend({
    _fields: {},
    data: null,
    cleaned_data: null,
    errors: {},
    name: 'qorus-form-view',
    tagName: 'form',
    attributes: {
      name: this.name,
      method: 'get'
    },
    fields: false,
    additionalEvents: {
      "submit": 'processData'
    },
    initialize: function () {
      FormView.__super__.initialize.apply(this, arguments);
      this.fields = this.options.fields || this.fields;
      this.data = this.options.data || this.data;
      
      _.each(this.fields, function (item) {
        var field = this.insertView(new FieldView({ 
          model: this.model,
          field: item
        }), 'self');
        this._fields[field.field.attrName] = field.field;
      }, this);
    },
    save: function () {
      if (this.model) {
        this.model.set(this.cleaned_data);
        this.model.save({ save: this.onSave, error: this.onError });
      }
    },
    onError: function () {
    },
    onSave: function () {
      this.collection.add(this.model);
    },
    is_valid: function () {
      this.clean_data();
      return (_.size(this.errors) < 1);
    },
    clean_data: function () {
      this.cleaned_data = {};
      this.errors = {};
      _.each(this._fields, function (field) {
        var value = '';
        var name = field.attrName;

        if (field.validate(field.getElValue())) {
          value = field.getElValue();
        } else {
          this.errors[name] = field.error;
        }

        field.value = value;

        if (value) this.cleaned_data[name] = value;
      }, this);
    },
    setData: function (data) {
      this.data = data;
    },
    processData: function (e) {
      if (this.is_valid()) {
        this.trigger('valid', this.cleaned_data);
        if (this.model) this.save();
      } else {
        this.trigger('error', this.errors);
        this.render();
      }
      e.preventDefault();
    }
  });
  
  return FormView;
});