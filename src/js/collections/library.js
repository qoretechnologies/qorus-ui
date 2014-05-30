define(function (require) {
  var Qorus     = require('qorus/qorus'),
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
        'functions': Funcs,
        'constants': Constants
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
    }
  });
  
  return Collection;
});
