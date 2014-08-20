define(function (require) {
  var settings = require('settings'),
      $        = require('jquery'),
      _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      utils    = require('utils'),
      moment   = require('moment'),
      datasets, Collection;
  
  datasets = [
    'avgduration',
    'avgprocessing',
    'maxduration',
    'maxprocessing',
    'minduration',
    'minprocessing'
    // 'count',
  ];
  
  Collection = Qorus.Collection.extend({
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
      this.setStep(this.step);
      
      debug.log(this.params.global);
    },
    
    url: function () {
      var url = settings.REST_API_PREFIX + '/orders';
      url += '?' + $.param(this.params);
      return url;
    },
    
    setStep: function (step) {
      this.labels = null;
      this.step = step;
      this.params.mindate = this.getMinDate();
      this.params.wfids = this.opts.id;
      this.params.global = (this.opts.id) ? false : true;
      this.params.grouping = (this.step > 1) ? 'daily' : 'hourly';
      this.fetch();
    },
    
    getMinDate: function () {
      return utils.formatDate(moment().add('d', this.step*-1));
    },
    
    createDataset: function () {
      var data = [],
         	self = this;

      _.each(this.getLabels(), function (d) {
        var m = self.findWhere({ grouping: d});
        
        _.each(datasets, function (d) {
          data[d] = data[d] || { data: [], desc: d };
					data[d].label = d;

          if (m) {
            data[d].data.push(m.get(d));
          } else {
            data[d].data.push(0);
          }
        });
        
      });
      return _.values(data);
    },
    
    getDataset: function () {
      var data = {
        labels: _.map(this.getLabels(), function (l) { return l.slice(-2); }),
        datasets: this.createDataset()
      };
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
