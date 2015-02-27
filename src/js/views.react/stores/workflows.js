define(function (require) {
  var Reflux      = require('reflux'),
      _           = require('underscore'),
      Actions     = require('views.react/actions/workflows');
  
  return Reflux.createStore({
    listenables: Actions,
    state: {},
    
    init: function () {
      this.state = {
        filters: {
          date: null,
          text: '',
          deprecated: false
        },
        collection: null,
        collection_fetched: false,
        checked_ids: [],
        model: null
      };
    },
    
    getInitialState: function () {
      return this.state;
    },
    
    onSetCollection: function (collection) {
      this.data.collection = collection;
    },
    
    onFetch: function () {
      var date = this.state.filters.date;
      var collection = this.getCollection();
      
      collection.setDate(date);

      collection.fetch({ 
        success: function () {
          this.setState({ fetch_error: null, collection_fetched: true });
          this.trigger(this.state);
        }.bind(this),
        error: function (col, resp) {
          this.setState({ fetch_error: resp });
          this.trigger(this.state);
        }.bind(this)
      });
    },
    
    onToggleDetail: function (id) {
      var model = this.state.model;
      model = (model && model.id == id) ? null : this.getCollection().get(id);
      this.setState({ model: model });
      this.trigger(this.state);
    },
    
    onFilterChange: function (filter) {
      this.setState({
        filters: _.extend({}, this.state.filters, filter)
      });
//      console.log(filter);  
      this.trigger(this.state);
//      console.log('filter change', filter, this.state.filters);
    },
    
    getModel: function () {
      return this.state.model;
    },
    
    getCollection: function () {
      return this.state.collection;
    },
    
    setState: function (state) {
      this.state = _.extend(this.state, state);
//      this.trigger('state');
    }
  });
});