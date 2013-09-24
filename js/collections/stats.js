define([
  'settings',
  'jquery',
  'underscore',
  'qorus/qorus',
  'utils'
], function(settings, $, _, Qorus, utils){
  var Collection = Qorus.Collection.extend({
    step: 1,
    params: { 
      action: 'processingSummary',
      seconds: true
    },
    // sort_key: 'status',
    // sort_order: 'des',
    // sort_history: ['name'],
    
    initialize: function (opts) {
      this.opts = opts || {};
      this.step = this.opts.step || this.step;
      this.params.mindate = this.getMinDate();
      this.params.wfids = this.opts.id;
      this.params.global = (this.opts.id) ? false : true;
      this.params.grouping = (this.step > 1) ? 'daily' : 'hourly';  
      
      console.log(this.params.global);
    },
    
    url: function () {
      var url = settings.REST_API_PREFIX + '/orders';
      url += '?' + $.param(this.params);
      return url;
    },
    
    getMinDate: function () {
      return utils.formatDate(moment().add('d', this.step*-1));
    },
    
    createDataset: function () {
      var data = [];
      var _this = this;
      _.each(this.getLabels(), function (d) {
        var m = _this.findWhere({ grouping: d});
        if (m) {
          console.log(d, m.toJSON());
          data.push(m.get('count'));
        } else {
          data.push(0);
        }
      });
      return [ { data: data }];
    },
    
    getDataset: function () {
      var data = {
        labels: _.map(this.getLabels(), function (l) { return l.slice(-2); }),
        datasets: this.createDataset()
      };
      
      console.log(data);
      return data;
    },
    
    getLabels: function () {
      if (!this.labels) {
        var range = (this.step > 1) ? _.range(this.step) : _.range(24),
          labels = [],
          u = (this.step > 1) ? 'd' : 'h',
          format = (this.step > 1) ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH';
      
        _.each(range, function (d) {
          labels.push(moment().add(u, -d).format(format));
        });
        
        labels.reverse();
        this.labels = labels;
      }
      
      return this.labels;
    }
  });

  return Collection;
});
