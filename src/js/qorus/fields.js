define(function (require) {
  var Qorus  = require('qorus/qorus'),
      _      = require('underscore'),
      Fields = {},
      BaseView, OptionView;
  
  BaseView = Qorus.ModelView.extend({
    attrName: false,
    intitialze: function () {
      BaseView.__super__.initialize.apply(this, arguments);
      this.attrName = this.options.attrName || this.attrName;
      this.listenTo(this.model);
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
        'value': this.getValue()
      };
    }
  });

  Fields.TextareaView = BaseView.extend({
    tagName: 'textarea',
    onRender: function () {
      this.$el.val(this.getValue());
    }
  });

  OptionView = Qorus.View.extend({
    tagName: 'option',
    attributes: function () {
      return {
        'value': this.options.name 
      };
    }
  });

  Fields.SelectView = BaseView.extend({
    collection: [],
    tagName: 'select',
    attributes: function () {
      return {
        'name': this.attrName
      };
    },
    initialize: function () {
      Fields.SelectView.__super__.initialize.apply(this, arguments);
      _.each(this.collection, function (item) {
        this.insertView(new OptionView({ name: item }));
      });
    }
  });

  return Fields;
});
