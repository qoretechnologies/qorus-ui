define(function (require) {
  var FormView = require('qorus/forms'),
      Fields   = require('qorus/fields'),
      Error    = require('models/error'),
      Forms    = {};
  
  Forms.Error = FormView.extend({
    model: Error,
    className: 'form-horizontal',
    name: 'error-edit-form',
    
    fields: [
      Fields.InputView.extend({
        name: 'Error',
        attrName: 'error',
        required: true,
        readonly: true
      }),
      Fields.InputView.extend({
        name: 'Severity',
        attrName: 'severity',
        required: true
      }),
      Fields.BooleanView.extend({
        name: 'Retry',
        attrName: 'retry_flag',
      }),
      Fields.InputView.extend({
        name: 'Retry delay secs',
        attrName: 'retry_delay_secs',
      }),
      Fields.BooleanView.extend({
        name: 'Business',
        attrName: 'business_flag',
      }),
      Fields.BooleanView.extend({
        name: 'Manually updated',
        attrName: 'manually_updated',
      }),
      Fields.TextareaView.extend({
        name: 'Description',
        attrName: 'description',
        required: true
      }),
    ],
    
    save: function () {
      if (this.model) {
        this.model.set(this.cleaned_data);
        
        if (!this.model.collection)
          this.model.is_new = true;

        this.listenToOnce(this.model, 'sync', this.onSave);
        this.listenToOnce(this.model, 'error', this.onError);
        this.model.save(null);
      }
    },
    
    onError: function (m, res) {
      if (res && res.responseJSON)
        this.showError(res.responseJSON.err + ': ' + res.responseJSON.desc);
      this.stopListening(this.model, 'sync');
    },
    
    onSave: function (model) {
      var opts = { merge: true };
      if (this.model.is_new) {
        delete this.model.is_new;
        opts = {};
      }
      
      this.collection.add(model, opts);
      
      this.trigger('close');
      this.stopListening(this.model, 'error');
      this.model = model;
    }
  });

  return Forms;
});
