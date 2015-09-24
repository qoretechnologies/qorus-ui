define(function (require) {
  var $             = require('jquery'),
      _             = require('underscore'),
      settings      = require('settings'),
      Qorus         = require('qorus/qorus'),
      Collection    = require('collections/orders'),
      OrdersToolbar = require('views/toolbars/orders_toolbar'),
      Template      = require('text!templates/workflow/orders.html'),
      TableTpl      = require('text!templates/workflow/orders/table.html'),
      RowTpl        = require('text!templates/workflow/orders/row.html'),
      moment        = require('moment'),
      utils         = require('utils'),
      ModalView     = require('views/common/modal'),
      LockTemplate  = require('tpl!templates/workflow/orders/lock.html'),
      User          = require('models/system').User,
      helpers, ListView, RowView, OrderLockView;
  
  helpers = {
    action_css: {
      'block': {
        'style': 'label-inverse',
        'icon': 'icon-minus-sign'
      },
      'unblock': {
        'style': '',
        'icon': 'icon-ok-sign'
      },
      'cancel': {
        'style': 'label-danger',
        'icon': 'icon-remove-sign'
      },
      'uncancel': {
        'style': 'label-warning',
        'icon': 'icon-remove-sign'
      },
      'retry': {
        'style': 'label-success',
        'icon': 'icon-refresh'
      },
      'reschedule': {
        'style': 'label-warning',
        'icon': 'icon-calendar'
      }
    }
  };
  
  OrderLockView = Qorus.ModelView.extend({
    template: LockTemplate,
    additionalEvents: {
      "submit": "lockOrder",
      "click button[type=submit]": "lockOrder"
    },
        
    lockOrder: function () {
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
      "click .order-breaklock": 'breakLockOrder',
      "click [data-action]": "runAction"
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
      this.setView(new ModalView({
        content_view: new OrderLockView({ action: action, model: this.model})
      }), '.order-lock-modal');
    },
    
    runAction: function (e) { 
      var data = e.currentTarget.dataset;
      if (data.action) {
        this.model.doAction(data.action);
        e.preventDefault(); 
      }
    },
    
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
      'click th[data-sort]': 'fetchSorted',
      'click .select-hidden': 'selectHidden',
      'click .unselect-hidden': 'showAllSummary',
    },
    
    initialize: function (opts, workflow) {
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
      this.opts.workflow = workflow;
      this.on('highlight:all', this.showAllSummary);
    },
    
    preRender: function () {
      this.setView(new OrdersToolbar(this.opts), '#toolbar');
      
      this.setView(new Qorus.TableView({ 
          collection: this.collection, 
          template: TableTpl,
          row_template: RowTpl,
          helpers: helpers,
          context: { url: this.url },
          row_view: RowView
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
      if (e.isDefaultPrevented()) return;

      var data = e.currentTarget.dataset,
          selected_ids = this.getCheckedIds();
          
      if (data.id !== 'selected') return;
          
      if (selected_ids && data.action) {
        this.collection.doAction({ action: data.action, ids: selected_ids });
        e.preventDefault();
        this.trigger('highlight:none');
      }
    },
    
    // fetches the collection from server presorted by key
    fetchSorted: function (e) {
      // TODO
      e.stopPropagation();
    },
    
    showAllSummary: function () {
      var states  = this.opts.statuses ? this.opts.statuses.toUpperCase().replace(',', ', ') : 'All',
          count   = this.opts.statuses ? _.reduce(this.opts.workflow.pick(this.opts.statuses.toUpperCase().split(',')), function (sum, num) { return sum + num; }) : this.opts.workflow.get('TOTAL'),
          msg     = sprintf('Select all orders (total: %d) with the following states %s', count, states);
      
      // reset the info 
      this.collection.select_limit = 0;
      this.$el.find('.selection').remove();
      
      this.$el.prepend('<p class="selection text-center"><a class="select-hidden">'+msg+'</a></p>');
      this.on('highlight:none highlight:row', this.hideAllSummary);
    },
    
    hideAllSummary: function () {
      this.collection.select_limit = 0;
      this.$el.find('.selection').remove();
    },
    
    selectHidden: function () {
      var states  = this.opts.statuses ? this.opts.statuses.toUpperCase().replace(',', ', ') : 'All',
          count   = this.opts.statuses ? _.reduce(this.opts.workflow.pick(this.opts.statuses.toUpperCase().split(',')), function (sum, num) { return sum + num; }) : this.opts.workflow.get('TOTAL'),
          msg     = sprintf('Selected all orders (total: %d) with the following states %s', count, states);
      this.collection.select_limit = count;
      this.$('.selection').html(msg + " <a class='unselect-hidden'>Cancel selection</a>");
      this.on('highlight', this.showAllSummary);
    }
  });
  
  return ListView;
});