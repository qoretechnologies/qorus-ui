define(function (require) {
  var Reflux      = require('reflux'),
      _           = require('underscore'),
      Actions     = require('views.react/actions/workflows'),
      DateActions = require('views.react/actions/date');

  return Reflux.createStore({
    listenables: [Actions, DateActions],
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
        checkedIds: [],
//        model: null
      };
    },

    getInitialState: function () {
      return this.state;
    },

    onSetCollection: function (collection) {
      this.state.collection = collection;
    },

    onFetch: function () {
      var date        = this.state.filters.date,
          deprecated  = this.state.filters.deprecated,
          collection  = this.getCollection();


      collection.setOptions({ date: date, deprecated: deprecated });

      collection.fetch({
        success: function (col, models) {
          // add timestamp for states
          col.each(function (m) { m.set('timestamp', this.state.filters.date); }, this);
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
      console.log('model', model);
    },

    onFilterChange: function (filter) {
      this.setState({
        filters: _.extend({}, this.state.filters, filter)
      });

     if (!filter.text) {
       Actions.fetch();
     }

      this.trigger(this.state);
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
    },

    onSetDate: function (date) {
      this.setState({
        filters: _.extend({}, this.state.filters, { date: date })
      });

      Actions.fetch();
    }
  });
});
