var _ = require('underscore');

var FilterMixin = {
  actions: ['filter'],
  init: function () {
    this.state = _.extend({}, this.state, {
      filters: {}
    });
  },

  onFilter: function (filter) {
    var filters = _.extend({}, this.state.filters, filter);

    this.setState({
      filters: filters
    });
  }
};

module.exports = FilterMixin;
