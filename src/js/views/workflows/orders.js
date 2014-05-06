define(function (require) {
  var $             = require('jquery'),
      _             = require('underscore'),
      settings      = require('settings'),
      Qorus         = require('qorus/qorus'),
      Dispatcher    = require('qorus/dispatcher'),
      Collection    = require('collections/orders'),
      OrdersToolbar = require('views/toolbars/orders_toolbar'),
      Template      = require('text!templates/workflow/orders.html'),
      TableTpl      = require('text!templates/workflow/orders/table.html'),
      RowTpl        = require('text!templates/workflow/orders/row.html'),
      moment        = require('moment'),
      qorus_helpers = require('qorus/helpers'),
      utils         = require('utils'),
      ModalView     = require('views/common/modal'),
      LockTemplate  = require('tpl!templates/workflow/orders/lock.html'),
      User          = require('models/system').User,
      helpers, ListView, RowView, OrderUnlockView, OrderLockView;
  
  helpers = {
    action_css: {
      'block': 'btn-inverse',
      'cancel': 'btn-danger',
      'retry': 'btn-success'
    }
  };
  
  OrderLockView = Qorus.ModelView.extend({
    template: LockTemplate,
    additionalEvents: {
      "submit": "lockOrder",
      "click button[type=submit]": "lockOrder"
    },
        
    lockOrder: function (e) {
      var note = this.$('textarea[name=note]').val();
      this.model.doAction(this.options.action, { note: note });
      this.trigger('close');
    }
  });
  
  
  RowView = Qorus.RowView.extend({
    context: {
      user: User
    },
    template: RowTpl,
    additionalEvents: {
      "click .order-lock": 'lockOrder',
      "click .order-unlock": 'unlockOrder',
      "click .order-breaklock": 'breakLockOrder'
    },
        
    lockOrder: function (e) {
      this.applyLock('lock', e);
    },
    
    unlockOrder: function (e) {
      this.applyLock('unlock', e);
    },
    
    breakLockOrder: function (e) {
      this.applyLock('breakLock', e);
    },
    
    applyLock: function (action) {
      var view = this.setView(new ModalView({
        content_view: new OrderLockView({ action: action, model: this.model})
      }), '.order-lock-modal');
    }
    
  });
  
  ListView = Qorus.ListView.extend({
    __name__: 'OrdersListView',
    url: function () {
      return "/" + ['orders', this.opts.statuses, utils.encodeDate(this.opts.date)].join('/');
    },
    template: Template,

    additionalEvents: {
      // 'click button[data-action]': 'runAction',
      'click button[data-pagination]': 'nextPage',
      'click th[data-sort]': 'fetchSorted'
    },
    
    initialize: function (opts) {
      this.options = {};
      opts = opts || {};
      
      // set DATE format and init date
      var date = opts.date;
      if (date === undefined || date === null || date === '24h') {
        this.date = moment().add('days', -1).format(settings.DATE_DISPLAY);
      } else if (date == 'all') {
        this.date = moment(settings.DATE_FROM).format(settings.DATE_DISPLAY);
      } else if (date.match(/^[0-9]+$/)) {
        this.date = moment(date, 'YYYYMMDDHHmmss').format(settings.DATE_DISPLAY);
      } else {
        this.date = date;
      }
      opts.date = this.date;
      
      ListView.__super__.initialize.call(this, Collection, opts.date, opts);
      
      // if (opts.url) {
      //   this.url = [opts.url, this.name].join('/');
      //   opts.url = this.url;
      //   // delete opts.url;
      // }
      
      this.opts = opts;
      _.extend(this.options, opts);
    },
    
    preRender: function () {
      var opts = this.opts;
            
      this.setView(new OrdersToolbar(this.opts), '#toolbar');
      
      this.setView(new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: helpers,
          context: { url: this.url },
          row_view: RowView,
      }), '#order-list');
    },
    
    onRender: function () {
      var toolbar = this.getView('#toolbar');
      toolbar.updateUrl(this.url, this.options.statuses);
      
      // init popover on info text
      $('td.info').each(function () {
        var text = '<textarea>' + $(this).text() + '</textarea>';
        $(this).popover({ content: text, title: "Info", placement: "left", container: "body", html: true});
      });
      
    },
    
    runAction: function (e) {      
      var data = e.currentTarget.dataset;
      if (data.id && data.action) {
        e.stopPropagation();
        var inst = this.collection.get(data.id);
        inst.doAction(data.action); 
      }
    },
    
    // fetches the collection from server presorted by key
    fetchSorted: function (e) {
      // TODO
      e.stopPropagation();
    }
  });
  
  return ListView;
});
