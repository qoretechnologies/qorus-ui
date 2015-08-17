module.exports = {
  actions: ['showDetail', 'getValues'],

  init: function () {
    this.state = _.extend({}, this.state, { showDetail: null });
  },

  getInitialState: function () {
    return this.state;
  },

  onShowDetail: function (model) {
    var self = this;

    if (!model) {
      this.setState({ showDetail: null });
    } else if (this.state.showDetail && this.state.showDetail.id === model.id) {
      this.setState({ showDetail: null });
    } else {
      this.setState({ showDetail: model });
    }
  }
};
