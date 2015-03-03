define(function (require) {
  var _         = require('underscore'),
      Qorus     = require('qorus/qorus'),
      Funcs     = require('collections/functions'),
      Constants = require('collections/constants'),
      Classes   = require('collections/classes'),
      Collection;
      
  Collection = Qorus.Collection.extend({
    url: '/',
    initialize: function (models, options) {
      _.bindAll(this, 'synced');
      this.collections = {
        'classes': Classes,
        'constants': Constants,
        'functions': Funcs
      };
      
      var done = _.after(_.size(this.collections), this.synced);
      
      _.each(this.collections, function (col) {
        col.fetch({success : done });
      }, this);
      
      Collection.__super__.initialize.apply(this, arguments);
    },
    
    synced: function () {
      _.each(this.collections, function (col) {
        this.add(col.models);
      }, this);
      
      this.trigger('sync', this.models);
    },
    
    groupByType: function () {
      return this.groupBy(function (item) { return item.get('type'); });
    }
  });
  
  return Collection;
});
