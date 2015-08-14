module.exports = {
  actions: ['showDetail', 'getValues'],

  init: function () {
    this.state = _.extend({}, this.state, { showDetail: null, detailValues: false });
  },

  getInitialState: function () {
    return this.state;
  },

  onShowDetail: function (model) {
    var self = this;

    if (!model) {
      this.setState({ showDetail: null, detailValues: false });
    } else if (this.state.showDetail && this.state.showDetail.id === model.id) {
      this.setState({ showDetail: null, detailValues: false });
    } else {
      var values = model.has('values');

      this.setState({ showDetail: model, detailValues: values });

      if (!values) {
        model.getProperty('values', null, null, function () {
          self.setState({ showDetail: model, detailValues: true });
        });
      }
    }
  }
};
