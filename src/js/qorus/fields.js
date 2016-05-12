define(function (require) {
  var Backbone = require('backbone'),
      Qorus    = require('qorus/qorus'),
      _        = require('underscore'),
      Fields   = {},
      BaseView, OptionView;

  require('bootstrap.multiselect');

  BaseView = Qorus.ModelView.extend({
    validator: null,
    error: null,
    attrName: '',
    value: null,
    error_msg: '\'%s\' is not valid input',
    empty_msg: 'This field is required!',
    initialize: function () {
      BaseView.__super__.initialize.apply(this, arguments);
      this.attrName = this.options.attrName || this.attrName;
      this.error_msg = this.options.error_msg || this.error_msg;
      this.required = this.options.required || this.required || false;
      if (this.model instanceof Backbone.Model) this.listenTo(this.model);
    },
    clean: function () {
      if (this.model instanceof Backbone.Model) this.stopListening(this.model);
    },
    getValue: function () {
      if (this.value)
        return this.value;

      if (this.model)
        return this.model.get(this.attrName);

      return undefined;
    },
    setValue: function (value) {
      if (this.model)
        this.model.set(this.attrName, value);
    },
    validate: function (value) {
      if (this.required && _.size(value) === 0) {
        this.error = this.empty_msg || 'Field is required!';
        this.onError();
        return false;
      }

      if (this.validator) {
        var v = new RegExp(this.validator);
        if (!v.test(value)) {
          this.error = sprintf(this.error_msg, value);
          this.onError();
          return false;
        }
      }
      this.onValid();
      return true;
    },
    onError: function () {
      this.trigger('error', this.error);
    },
    onValid: function () {
      this.trigger('valid');
    },
    getElValue: function () {
      return this.$el.val();
    }
  });

  Fields.InputView = BaseView.extend({
    tagName: 'input',
    attributes: function () {
      return {
        'type': 'text',
        'name': this.attrName,
        'value': this.getValue(),
        'placeholder': this.name,
        'readonly': this.readonly || false
      };
    }
  });

  Fields.PasswordView = BaseView.extend({
    tagName: 'input',
    attributes: function () {
      return {
        type: 'password',
        name: this.attrName,
        value: this.getValue(),
        readonly: this.readonly || false
      };
    }
  });

  Fields.TextareaView = BaseView.extend({
    tagName: 'textarea',
    attributes: function () {
      return {
        name: this.attrName,
        placeholder: this.name,
        readonly: this.readonly || false
      };
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
        'name': this.attrName,
        'readonly': this.readonly || false
      };
    },
    initialize: function () {
      var selected = [], models;
      Fields.SelectView.__super__.initialize.apply(this, arguments);
      if (this.model) {
        selected = this.model.get(this.attrName);
      }
      if (!selected) selected = [];


      if (this.collection instanceof Backbone.Collection) {
        models = this.collection.models;
      } else {
        models = this.collection;
      }

      _.each(models, function (item) {
        this.insertView(new OptionView({
          value: item.getName() || item,
          attributes: {
            value: item.getName() || item,
            selected: selected.indexOf(item.getName() || item) > -1
          }
        }), 'self');
        }, this);
    },
    validate: function (value) {
      var values = _.map(this.collection.models, function (m) { return m.getName(); });
      return (_.indexOf(values, value) > -1);
    }
  });

  Fields.MultiSelectView = BaseView.extend({
    // collection: [],
    tagName: 'select',
    _rndrCnt: 0,
    attributes: function () {
      return {
        'name': this.attrName,
        'multiple': true,
        'readonly': this.readonly || false
      };
    },
    initialize: function () {
      var self = this;
      Fields.SelectView.__super__.initialize.apply(this, arguments);
      // this.listenToOnce(this.collection, 'sync', function () { self.render(); });
      this.listenToOnce(this.collection, 'sync', this.render);
      this.collection.fetch();
    },
    preRender: function () {
      var selected;
      this.removeViews();
      if (this.model) {
        selected = this.model.get(this.attrName);
      }
      if (!selected) selected = [];
      _.each(this.collection.models, function (item) {
        this.insertView(new OptionView({
          value: item.getName(),
          attributes: {
            value: item.getName(),
            selected: selected.indexOf(item.getName()) > -1
          }
        }), 'self');
      }, this);
    },
    onRender: function() {
      if (this.collection.size() > 0) {
        _.defer(this.addMultiselect, this);
      }
    },
    addMultiselect: function (self) {
      self.$el.multiselect({
        enableCaseInsensitiveFiltering : true,
        maxHeight: 200,
        onChange: function (option, checked, select) {
          if (option.val() == 'DEFAULT') {
            if (checked) {
              $(option).parent().find('option').not('[value=DEFAULT]').prop('disabled', true);
              this.refresh();
            } else {
              $(option).parent().find('option').not('[value=DEFAULT]').prop('disabled', false);
              this.refresh();
            }
          }
        }
      });
    },
    rebuildMultiselect: function (self) {
      self.$el.multiselect('rebuild');
    }
  });

  Fields.BooleanView = BaseView.extend({
    tagName: 'input',
    attributes: function () {
      return {
        name: this.attrName,
        type: 'checkbox',
        value: this.getValue(),
        readonly: this.readonly || false,
        checked: this.getValue()
      };
    }
  });

  Fields.PillboxView = Fields.MultiSelectView.extend({

  });

  return Fields;
});
