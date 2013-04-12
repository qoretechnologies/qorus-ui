// Qorus core objects definition
define(['jquery', 'underscore', 'libs/backbone.rpc', 'settings'], function($, _, Backbone, settings) {
  $.extend($.expr[':'], {
    'icontains': function(elem, i, match) //, array)
    {
      return (elem.textContent || elem.innerText || '').toLowerCase()
      .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
  });
  
  function prep(val, des){
    if (_.isNumber(val)){
      val = String('00000000000000' + val).slice(-14);
    } else  if (_.isString(val)){
      val = val.toLowerCase();
    }
    if(des===true){
      return '-'+val;
    }
    return val;
  }
  
  var Qorus = {};
  
  Qorus.Model = Backbone.Model.extend({
    dateAttributes: {},
    initialize: function(opts){
      Qorus.Model.__super__.initialize.call(this, opts);
      // this.parseDates();
    },
    parse: function(response, options){
      _.each(this.dateAttributes, function(date){
        if (response[date]){
          response[date] = moment(response[date], settings.DATE_FORMAT).format(settings.DATE_DISPLAY); 
        }
      });
      return response;
    }
  });

  Qorus.Collection = Backbone.Collection.extend({
    date: null,
    limit: 100,
    offset: 1,
    page: 1,
    
    initialize: function(date) {
      // _.bindAll(this);
      if (date) {
        this.date = date;
      }
    },
    search: function(query) {
      if (query === "") return this;

      var pattern = new RegExp(query, "gi");
      return _(this.filter(function(data) {
        return pattern.test(data.get("name"));
      }));
    },
    hasNextPage: function(){
      console.log("Has next page", (this.offset + this.limit - 2 < this.models.length));
      return (this.offset + this.limit - 2 < this.models.length); 
    },
    loadNextPage: function(){
      if(!this.loading){
        this.loading = true;
        if (this.hasNextPage()) {

          this.offset = this.page * this.limit + this.offset;
          this.page++;
          console.log('loading page', this.page);

          var _this = this;
          this.fetch({ 
            add: true, 
            remove: false, 
            update: true,
            success: function(){
              console.log(_this.length);
              _this.trigger('reset');
              _this.loading = false;
            }
          });
        }        
      }
    },
    fetch: function(options){
      this.opts.limit = this.limit;
      this.opts.offset = this.offset;

      var data = this.opts;      

      if (!options) {
        options = {};
      }

      if (options.data){
        _.extend(data, options.data);
      }
      
      _.extend(options, { data: data });

      Qorus.Collection.__super__.fetch.call(this, options);
    }
    
  });
  
  Qorus.SortedCollection = Qorus.Collection.extend({
    initialize: function(opts) {
      this.sort_key = 'name';
      this.sort_order = 'asc';
      this.sort_history = [''];
      this.opts = opts;
      if (opts) {
        this.date = opts.date;
      }
    },
    comparator: function(c1, c2) {
      // needs fix
      var r = (this.sort_order == 'des') ? -1 : 1;
      var k1 = [prep(c1.get(this.sort_key)), prep(c1.get(this.sort_history[0]))];
      var k2 = [prep(c2.get(this.sort_key)), prep(c2.get(this.sort_history[0]))];
      
      if (k1[0] < k2[0]) return -1 * r;
      if (k1[0] > k2[0]) return 1 * r;
      if (k1[1] > k2[1]) return -1 * r;
      if (k1[1] < k2[1]) return 1 * r;
      return 0;
    },
    sortByKey: function(key, ord, cb) {
      if (key) {
        var old_key = this.sort_key;
        if (old_key!=key){
          this.sort_history.unshift(old_key); 
        }
        this.sort_order = ord;
        this.sort_key = key;
        this.sort({
          silent: true
        });

        this.trigger('reset', this, {});
      }
    }
  });
  
  Qorus.WSCollection = Backbone.Collection.extend({
    initialize: function (models, options) {
      _.bindAll(this);
      this.socket = new WebSocket("ws://localhost:8001");
      this.socket.onmessage = this.wsAdd;
    },
    wsAdd: function(e){
      var _this = this;
      var models = JSON.parse(e.data);
      _.each(models, function(model){
        var mdl = new _this.model(model);
        console.log("Adding -> ", mdl);
        _this.add(mdl);
      });
    },
    sync: function() {
    },
    fetch: function() {
    }
  });
  
  Qorus.Loader = Backbone.View.extend({
    template: '<div class="loader"><p><img src="/imgs/loader.gif" /> Loading...</p></div>',
    initialize: function(opts){
      this.el = opts.el;
      _.bindAll(this);
      this.render();
    },
    render: function(){
      $(this.el).before(this.template);
    },
    destroy: function(){
      $(this.el).parent().find('.loader').remove();
    }
  });
  
  Qorus.View = Backbone.View.extend({
    url: '#',
    additionalEvents: {},
    defaultEvents: {},
    context: {},
    subviews: {},
    events : function(){
       return _.extend({},this.defaultEvents,this.additionalEvents);
    },
    initialize: function(options){
      Qorus.View.__super__.initialize.call(this, [options]);
      // set DATE format and init date
      this.date_format = settings.DATE_DISPLAY;
      if (_.isObject(options)){
        if(options.date===undefined){
          options.date = moment().add('days',-1).format(this.date_format);
        } else if(options.date=='all') {
          options.date = moment(settings.DATE_FROM).format(this.date_format);
        }        
      }
      
      _.extend(this.context, options);
    },
    off: function(){
      if(_.isFunction(this.clean)){
        this.clean();
      }
      _.each(this.subviews, function(view){
        if(_.isFunction(view.clean)){
          view.clean();
        }
        view.undelegateEvents();
        view.remove();
      });
    },
    // manages subviews
    assign : function (selector, view) {
      var selectors;
      if (_.isObject(selector)) {
          selectors = selector;
      }
      else {
          selectors = {};
          selectors[selector] = view;
      }
      if (!selectors) return;
      _.each(selectors, function (view, selector) {
          view.setElement(this.$(selector)).render();
      }, this);
    },
    render: function(ctx) {
      if (this.template){
        if (ctx){
          _.extend(this.context, ctx); 
        }

        var tpl = _.template(this.template, this.context);
        this.$el.html(tpl);
        this.trigger('render', this, {});
      }
      return this;
    }
  });

  Qorus.ListView = Qorus.View.extend({
    defaultEvents: {
      'click .check': 'highlight',
      'click .check-all': 'checkall',
      'click .uncheck-all': 'checkall',
      'click th': 'sortView',
      'submit .form-search': 'search',
      'keyup .search-query': 'search'
    },
    events : function(){
       return _.extend({},this.defaultEvents,this.additionalEvents);
    },
    initialize: function(collection, date) {
      _.bindAll(this);
      Qorus.ListView.__super__.initialize.call(this);
      // add element loader
      this.loader = new Qorus.Loader({ el: this.el });

      // set DATE format and init date
      this.date_format = settings.DATE_DISPLAY;      
      if(date===undefined){
          this.date = moment().add('days',-1).format(this.date_format);
      } else if(date=='all') {
          this.date = moment(settings.DATE_FROM).format(this.date_format);
      } else {
          this.date = date;
      }
      
      if (collection) {
        this.collection = new collection({date: this.date});
        this.collection.on('all', function(e, ee){ console.log(e, ee); });
        this.collection.on('reset', this.render);
        this.collection.on('change', function(){ console.log('changed listview'); });
        this.collection.fetch();
        
        var _c = this.collection;
      
        this.context.page = {
          current_page: _c.page,
          has_next: _c.hasNextPage,
          has_prev: null
        };        
      }
    },
    render: function() {
      // console.log('Starts rendering with context ->', this.context.page.has_next);
      if (this.template){
        var ctx = {
          date: this.date,
          items: this.collection.models
        };
        _.extend(this.context, ctx);
        
        var tpl = _.template(this.template, this.context);
        this.$el.html(tpl);
        this.sortIcon();  
        if(this.loader)
          this.loader.destroy();
        this.trigger('render', this, {});
      }

      if(_.isFunction(this.afterRender)){
        // Run afterRender when attached to DOM
        var _this = this;
        _.defer(function(){ _this.afterRender(); });
      }
      console.log('Finished rendering');
      return this;
    },
    // toggle select row
    highlight: function(e) {
      var el = e.currentTarget;
      $(el)
        .toggleClass('icon-box')
        .toggleClass('icon-check');
      $(el)
        .parents('.workflow-row')
        .toggleClass('warning');
      e.stopPropagation();
    },
    fixHeader: function(){
      $(this.el).find('table').fixedHeaderTable();
    },
    // toggle select on all rows
    checkall: function(e) {
      var el = e.currentTarget;

      // behaviour switcher
      if ($(el)
        .hasClass('check-all')) {
        $(el)
          .toggleClass('icon-box')
          .toggleClass('icon-check')
          .toggleClass('check-all')
          .toggleClass('uncheck-all');
        $('.workflow-row')
          .addClass('warning')
          .addClass('checked');
        $('.workflow-row .check')
          .removeClass('icon-box')
          .addClass('icon-check');
      } else {
        $(el)
          .toggleClass('icon-box')
          .toggleClass('icon-check')
          .toggleClass('check-all')
          .toggleClass('uncheck-all');
        $('.workflow-row')
          .removeClass('warning')
          .removeClass('checked');
        $('.workflow-row .check')
          .removeClass('icon-check')
          .addClass('icon-box');
      }
      e.stopPropagation();
    },
    // sort view
    sortView: function(e) {
      var el = $(e.currentTarget);
      if (el.data('sort')) {
        this.collection.sortByKey(el.data('sort'), el.data('order'));
      }
    },
    sortIcon: function() {
        var c = this;
        var key = c.collection.sort_key;
        var order = c.collection.sort_order;
        var el = c.$el.find('th[data-sort="' + key + '"]');
        c.$el.find('th i.sort')
          .remove();

        if (order == 'des') {
          el.attr('data-order', 'asc');
          el.append('<i class="sort icon-chevron-down"></i>');
        } else {
          el.attr('data-order', 'des');
          el.append('<i class="sort icon-chevron-up"></i>');
        }
    },
    search: function(e){
      var el = this.el;
      var query = $(this.el).find('.search-query').val();
      if (query.length<1){
        $(this.el).find('tbody tr').show();
      } else {
        $(this.el).find('tbody tr').hide();
        $(this.el).find("tbody td:icontains('" + query + "')").parent().show();
      }
      
      // prevent reload if submited by form
      if (e.type=="submit"){
        e.preventDefault();
      }
    }
  });

  return Qorus;
});
