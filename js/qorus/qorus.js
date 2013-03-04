// Qorus core objects definition
define(['jquery', 'underscore', 'libs/backbone.rpc', 'settings'], function($, _, Backbone, settings) {
  $.extend($.expr[':'], {
    'icontains': function(elem, i, match, array)
    {
      return (elem.textContent || elem.innerText || '').toLowerCase()
      .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
  });
  
  function prep(val){
    if (_.isNumber(val)){
      return String('00000000000000' + val).slice(-14);
    } else  if (_.isString(val)){
      return val.toLowerCase();
    }
    return val;
  }
  
  var Qorus = {};

  Qorus.Model = Backbone.Model.extend({
    url: '/JSON',
    rpc: new Backbone.Rpc({
      namespaceDelimiter: ''
    }),
  });

  Qorus.Collection = Backbone.Collection.extend({
    url: '/JSON',
    rpc: new Backbone.Rpc({
      namespaceDelimiter: ''
    }),
    date: null,
    initialize: function(date) {
      if (date) {
        this.date = date;
      }
    },
    search: function(query) {
      if (query == "") return this;

      var pattern = new RegExp(query, "gi");
      return _(this.filter(function(data) {
        return pattern.test(data.get("name"));
      }));
    }
  });

  Qorus.SortedCollection = Qorus.Collection.extend({
    initialize: function(opts) {
      this.sort_by = 'name';
      this.sort_order = 'asc';
      this.sort_history = ['', ];
      if (opts) {
        this.date = opts.date;
      }
    },
    comparator: function(collection) {
      var key_1 = collection.get(this.sort_by);
      var key_2 = collection.get(this.sort_history[0]);
      
      return [prep(key_1), prep(key_2)];
    },
    sortByKey: function(key, cb) {
      if (key) {
        var old_key = this.sort_by;
        this.sort_history.unshift(old_key);
        this.sort_by = key;
        this.sort({
          silent: true
        });

        if (old_key == key) {
          this.sort_order = (this.sort_order == 'asc') ? 'des' : 'asc';
          if (this.sort_order == 'des') {
            this.models = this.models.reverse();
          }
        } else {
          this.sort_order = 'asc';
        }

        this.trigger('reset', this, {});
      }
    }
  });
  
  Qorus.Loader = Backbone.View.extend({
    template: '<div class="loader"><p><img src="/imgs/loader.gif" /> Loading...</p></div>',
    initialize: function(opts){
      this.el = opts.el;
      _.bindAll(this, 'render');
      _.bindAll(this, 'destroy');
      this.render();
    },
    render: function(){
      $(this.el).before(this.template);
    },
    destroy: function(){
      $(this.el).parent().find('.loader').remove();
    }
  });

  Qorus.ListView = Backbone.View.extend({
    defaultEvents: {
      'click .check': 'highlight',
      'click .check-all': 'checkall',
      'click .uncheck-all': 'checkall',
      'click th': 'sortView',
      'submit .form-search': 'search',
      'keyup .search-query': 'search'
    },
    additionalEvents: {  
    },
    events : function() {
       return _.extend({},this.defaultEvents,this.additionalEvents);
    },
    initialize: function(collection, date) {
      // add element loader
      this.loader = new Qorus.Loader({ el: this.el });

      // set DATE format and init date
      this.date_format = settings.DATE_DISPLAY;      
      if(date===undefined){
          this.date = moment().days(0).format(this.date_format);
      } else if(date=='all') {
          this.date = moment(settings.DATE_FROM).format(this.date_format);
      } else {
          this.date = date;
      }
      
      _.bindAll(this, 'render');
      this.collection = new collection({date: this.date});
      this.collection.on('reset', this.render );
      this.collection.fetch();
      
      // this.on('render', this.fixHeader );
    },
    render: function() {
      if (this.template){
        var tpl = _.template(this.template,{
          date: this.date,
          items: this.collection.models
        });
        this.$el.html(tpl);
        this.sortIcon();  
        this.loader.destroy();
        this.trigger('render', this, {});
      }
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
    },
    // sort view
    sortView: function(e) {
      var el = $(e.currentTarget);
      if (el.data('sort')) {
        this.collection.sortByKey(el.data('sort'));
      }
    },
    sortIcon: function() {
        var c = this;
        var key = c.collection.sort_by;
        var order = c.collection.sort_order;
        var el = c.$el.find('th[data-sort="' + key + '"]');
        c.$el.find('th i.sort')
          .remove();

        if (order == 'des') {
          el.append('<i class="sort icon-chevron-up"></i>');
        } else {
          el.append('<i class="sort icon-chevron-down"></i>');
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
