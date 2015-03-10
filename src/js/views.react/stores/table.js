define(function (require) {
  var _               = require('underscore'),
      Reflux          = require('reflux'),
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
       * @returns: hash this.state
       */
      getInitialState: function () {
        return {
          model: null,
          checkedIds: []
        };
      },

      /**
       * Listens on rowClick event
       * @param {number} id
       * @listens actions:table:rowClick
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
       * @returns {Boolean}
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
       * @returns {Boolean}
       */          
      isRowClicked: function (id) {
        return this.state.model && (this.state.model === id);
      }
    });      
  };
});
