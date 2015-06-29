var _ = require('underscore');
var FETCH = require('cjs!constants/fetch');

var CollectionMixin = {
  actions: ['initCollection', 'fetch'],
  init: function () {
    this.state = _.extend({}, this.state, {
      collection: null,
      fetchStatus: FETCH.INIT,
      fetchError: null
    });
  },

  onInitCollection: function (collection) {
    this.setState({ collection: collection });
  },

  onFetch: function () {
    var self = this;

    if (this.state.collection) {
      this.state.collection.fetch()
        .done(function () {
          self.setState({ fetchStatus: FETCH.DONE, collection: self.state.collection });
        })
        .fail(function (resp) {
          var r = resp.responseJSON;
          self.setState({ fetchStatus: FETCH.ERROR, fetchError: sprintf("%s: %s", r.err, r.desc) });
        });
    }
  },
};


module.exports = CollectionMixin;
