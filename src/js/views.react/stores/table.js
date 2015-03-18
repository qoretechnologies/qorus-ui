define(function (require) {
  var _               = require('underscore'),
      Reflux          = require('reflux'),
      Filtered        = require('backbone.filtered.collection'),
      Backbone        = require('backbone'),
      stateStoreMixin = require('views.react/stores/mixins/statestore');
  
  return function (actions) {
    return Reflux.createStore({
      mixins: [stateStoreMixin],
      listenables: [actions],
      
      /** Init function */
      init: function () {
        this.state = this.getInitialState();
      },
      
      /** 
       * Sets initial state hash
       * @returns {Object} this.state
       */
      getInitialState: function () {
        return {
          model: null,
          checkedIds: [],
          collection: null,
          order: 'asc',
          orderKey: ''
        };
      },
      
      onSetCollection: function (collection) {
        this.setState({ collection: collection }, { silent: true });
      },
      
      getCollection: function () {
        return this.state.collection;
      },
      
      /**
       * Listens on rowClick event
       * @param {number} id
       * @listens actions:table:
       */
      onRowClick: function (id) {
        this.state.model = (this.state.model == id) ? null : id;
        this.trigger(this.state);
      },
      
      /**
       * Listens on rowCheck event
       * @param {number|Array} id
       * @listens actions:table:rowCheck
       */
      onRowCheck: function (id) {
        var ids;
        
        if (typeof id === Array) {
          ids = id;
        } else {
          if (this.isRowChecked(id)) {
            ids = _.without(this.state.checkedIds, id);
          } else {
            ids = this.state.checkedIds;
            ids.push(id);
          }  
        }
        
        this.setState({ checkedIds: ids });
      },
      
      /**
       * Checks if id is in checkedIds
       * @param {number} id
       * @returns {boolean}
       */
      isRowChecked: function (id) {
        if (this.state.checkedIds.length === 0) {
          return false;
        }
        
        return _.indexOf(this.state.checkedIds, id) !== -1;
      },
      
      /**
       * Returns list of checked IDs
       * @returns {Array}
       */
      getCheckedIds: function () {
        return this.state.checkedIds;
      },
      
      /**
       * Checks if id is clicked
       * @param {number} id
       * @returns {boolean}
       */          
      isRowClicked: function (id) {
        return this.state.model && (this.state.model === id);
      },
      
      /**
       * Selects/unselects rows based on action
       * @param {string|function} action
       */
      onCheck: function (action) {
        var ids = this.state.checkedIds;
        
        switch (action) {
            case 'all':
              ids = _.pluck(this.getCollection().models, 'id');
              break;
            case 'none':
              ids = [];
              break;
            case 'invert':
              ids = _.difference(_.pluck(this.getCollection().models, 'id'), this.state.checkedIds);
              break;
            default:
              if (typeof action == 'function') {
                ids = this.getCollection().map(action);  
              }
        }
        
        this.setState({ checkedIds: ids });
      },

      /**
       * Runs action with selected rows
       * @param {string|function} action
       */
      onRun: function (action, args, e) {
        var ids = this.state.checkedIds;
        action(ids, args);
        
        e.preventDefault();
        document.activeElement.blur();
      },
      
      onSort: function (key, order) {
        var collection = this.getCollection();
        order = (typeof order == 'string') ? order : this.state.order;
        
        if (key === this.state.orderKey) {
          order = (order == 'asc') ? 'des' : 'asc';
        }
        
        if (collection instanceof Filtered) {
          collection = collection.superset();
        }
        
        if (collection && collection.sortByKey) {
          collection.sortByKey(key, order);
          this.setState({ order: order, orderKey: key });          
        }
      }
    });      
  };
});