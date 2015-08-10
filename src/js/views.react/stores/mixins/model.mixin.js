var _ = require('underscore');
var FETCH = require('cjs!constants/fetch');

var ModelMixin = {
  actions: ['initCollection', 'fetch'],
  init: function () {
    this.state = _.extend({}, this.state, {
      model: null,
      fetchStatus: FETCH.INIT,
      fetchError: null
    });
  },

  onInitModel: function (model) {
    this.setState({ model: model });
  },

  onFetch: function () {
    var self = this;

    if (this.state.model) {
      this.state.model.fetch()
        .done(function () {
          self.setState({ fetchStatus: FETCH.DONE, collection: self.state.model });
        })
        .fail(function (resp) {
          var r = resp.responseJSON;
          self.setState({ fetchStatus: FETCH.ERROR, fetchError: sprintf("%s: %s", r.err, r.desc) });
        });
    }
  },
};


module.exports = ModelMixin;
