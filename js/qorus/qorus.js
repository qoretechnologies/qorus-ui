// Qorus core objects definition
define(['underscore', 'libs/backbone.rpc', ], function(_, Backbone) {
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
      return (collection.get(this.sort_by), collection.get(this.sort_history[0]));
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

  Qorus.ListView = Backbone.View.extend({
    defaultEvents: {
      'click .check': 'highlight',
      'click .check-all': 'checkall',
      'click .uncheck-all': 'checkall',
      'click th': 'sortView',
    },
    additionalEvents: {  
    },
    events : function() {
       return _.extend({},this.defaultEvents,this.additionalEvents);
    },
    initialize: function(collection, date) {
      this.date_format = 'DD-MM-YYYY HH:mm:ss';
      if(date===undefined){
          this.date = moment().format(this.date_format);
      } else {
          this.date = date;
      }
      _.bindAll(this, 'render');
      this.collection = new collection({date: this.date});
      this.collection.on('reset add', this.render);
      this.collection.fetch();
    },
    render: function() {
      var compiledTemplate = _.template(this.template, {
        date: this.date,
        items: this.collection.models
      });
      this.$el.html(compiledTemplate);
      this.trigger('render', this, {});
      this.sortIcon();
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
        c.$el.find('th i')
          .remove();

        if (order == 'des') {
          el.append('<i class="icon-chevron-up"></i>');
        } else {
          el.append('<i class="icon-chevron-down"></i>');
        }
    }
  })
  
  Qorus.Loader = Backbone.View.extend({
    template: '<div class="loader">Loading</div>',
    initialize: function(el){
      this.el = el;
      this.render();
    },
    render: function(){
      this.$el.append(this.template);
    },
    destroy: function(){
      this.$el.find('.loader').remove();
    }
  })

  return Qorus;
});
