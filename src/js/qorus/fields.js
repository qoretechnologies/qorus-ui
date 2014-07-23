define(function (require) {
  var Backbone = require('backbone'),
      Qorus    = require('qorus/qorus'),
      _        = require('underscore'),
      Fields   = {},
      BaseView, OptionView;
  
  BaseView = Qorus.ModelView.extend({
    attrName: '',
    initialize: function () {
      BaseView.__super__.initialize.apply(this, arguments);
      this.attrName = this.options.attrName || this.attrName;
      if (this.model instanceof Backbone.Model) this.listenTo(this.model);
    },
    getValue: function () {
      if (this.model) 
        return this.model.get(this.attrName);
      
      return undefined;
    },
    setValue: function (value) {
      if (this.model)
        this.model.set(this.attrName, value);
    }
  });
  
  Fields.InputView = BaseView.extend({
    tagName: 'input',
    attributes: function () {
      return {
        'type': 'text',
        'name': this.attrName,
        'value': this.getValue(),
        'placeholder': this.name
      };
    }
  });

  Fields.TextareaView = BaseView.extend({
    tagName: 'textarea',
    attributes: function () {
      return {
        placeholder: this.name 
      }
    },
    onRender: function () {
      this.$el.val(this.getValue());
    }
  });

  OptionView = Qorus.View.extend({
    tagName: 'option',
    render: function () {
      OptionView.__super__.render.apply(this, arguments);
      this.$el.html(this.options.value);
      return this;
    }
  });

  Fields.SelectView = BaseView.extend({
    // collection: [],
    tagName: 'select',
    attributes: function () {
      return {
        'name': this.attrName
      };
    },
    initialize: function () {
      Fields.SelectView.__super__.initialize.apply(this, arguments);
      _.each(this.collection.models, function (item) {
        this.insertView(new OptionView({ 
          value: item.get('name'), 
          attributes: { 
            value: item.get('name') 
          } 
        }), 'self');
      });
    }
  });
  
  Fields.MultiSelectView = BaseView.extend({
    // collection: [],
    optionView: OptionView,
    tagName: 'select',
    attributes: function () {
      return {
        'name': this.attrName,
        'multiple': true
      };
    },
    initialize: function () {
      Fields.SelectView.__super__.initialize.apply(this, arguments);
      _.each(this.collection.models, function (item) {
        this.insertView(new this.optionView({ 
          value: item.get('name'), 
          attributes: { 
            value: item.get('name') 
          } 
        }), 'self');
      }, this);
    }
  });

  return Fields;
});
