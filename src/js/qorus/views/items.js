define(function (require) {
  var Qorus          = require('qorus/qorus'),
      _              = require('underscore'),
      Fields         = require('qorus/fields'),
      ListingViewTpl = require('tpl!templates/common/listing.html'),
      ItemTpl        = require('tpl!templates/common/item.html'),
      AddItemTpl     = require('tpl!templates/common/item_add.html'),
      ItemView, AddItemView, ListingView;

  ItemView = Qorus.View.extend({
    tagName: 'li',
    className: 'label label-info',
    additionalEvents: {
      'click .remove': 'removeItem'
    },
    template: ItemTpl,
    removeItem: function () {
      this.trigger('item:remove', this.options.item, this.cid);
      this.off();
    }
  });
  
  AddItemView = Qorus.View.extend({
    additionalEvents: {
      'click .add': 'addItem'
    },
    template: AddItemTpl,
    preRender: function () {
      var view = new Fields.SelectView({
        name: 'Add item',
        attrName: this.options.name,
        collection: this.collection
      });
      this.insertView(view, '.listing');
    },
    addItem: function (e) {
      e.preventDefault();
      var view = this.getView('.listing')[0];
      
      var items = this.model.get(this.options.name);
      items.push(view.getElValue());
      this.model.set(this.options.name, items);
      this.model.save();
      this.model.trigger('item:'+this.options.name+':add', view.getElValue());
      this.off();
    }
  });
  
  // Role detail attribute listing
  ListingView = Qorus.View.extend({
    additionalEvents: {
      'click .add-item': 'addItemView'
    },
    template: ListingViewTpl,
    postInit: function () {
      var name = this.options.name.toLowerCase();
      this.listenTo(this.model, 'item:'+name+':add', this.addItem);
    },
    onRender: function () {
      var items = this.model.get(this.name);
      if (_.size(items) > 0) {
        this.addItems(items.sort());
      }
    },
    addItem: function (item) {
      if (!this.getView('.items-listing')) {
            this.$('.items-listing').empty();
      }
      
      var view = this.insertView(new ItemView({ item: item }), '.items-listing', true);
      this.listenTo(view, 'item:remove', this.delItem);
    },
    addItems: function (items) {
      _.each(items, this.addItem, this);
    },
    delItem: function (item, cid) {
      var items = this.model.get(this.name);
      
      this.model.set(this.name, _.without(items, item));
      this.model.save();
      this.views['.items-listing'] = _.reject(this.getView('.items-listing'), { cid: cid });
    },
    addItemView: function () {
      var listed     = this.model.get(this.name),
          collection = this.collection.reject(function (item) { 
            return listed.indexOf(item.getName()) > -1; 
            }),
          $btn       = this.$('.add-item');

      $btn.hide();
      var view = this.insertView(new AddItemView({ 
        name: this.name,
        model: this.model,
        collection: collection
      }), '.add-item-form', true);

      this.listenToOnce(view, 'destroy', $.proxy(function () { 
          this.show(); 
        }, $btn)
      );
    }
  });
  
  return {
    AddItemView: AddItemView,
    ListingView: ListingView,
    ItemView: ItemView
  };
});