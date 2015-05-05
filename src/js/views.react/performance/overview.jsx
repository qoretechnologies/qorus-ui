define(function (require, exports, module) {
  var React     = require('react'),
      Charts    = require('chartjs'),
      LineChart = require('react-chartjs').Line,
      Menu      = require('views/system/menu/menu'),
      Backbone  = require('backbone'),
      settings  = require('settings'),
      helpers   = require('qorus/helpers'),
      moment    = require('moment');
  
  Menu.addMenuItem(new Backbone.Model({ 
      name: 'Graphs',
      url: '/performance',
      icon: 'signal'
  }), 'main');
  
  Menu.render();
  
  var datasetLength = 300;
  var emptyArray = _.map(_.range(datasetLength), function () { return null; });
  
  var ColorScheme = {
    clr1: "rgba(250,225,107,1)",
    clr2: "rgba(169,204,143,1)",
    clr3: "rgba(178,200,217,1)",
    clr4: "rgba(190,163,122,1)",
    clr5: "rgba(243,170,121,1)",
    clr6: "rgba(181,181,169,1)",
    clr7: "rgba(230,165,164,1)"
  };
  
  var Config = {
    datasetFill: false,
    animation: false,
    pointDot: false
  };
  
  var ChartLegend = React.createClass({
    propTypes: {
      datasets: React.PropTypes.array.isRequired
    },
  
    render: function () {
      var datasets = _.map(this.props.datasets, function (ds) { 
      return <li><span className="legend-color-box" style={{ backgroundColor: ds.strokeColor }}></span> { ds.label }</li>;
      });
    
      return (
        <ul className={ this.props.title + "-legend" }>
          { datasets }
        </ul>
      );
    }
  });
  
  var DataSets =  {
    AVG: {
      dataset: [{
                  label: "Avg 1s",
                  fillColor : "rgba(250,225,107,0.5)",
                  strokeColor : ColorScheme.clr1,
                  pointColor : ColorScheme.clr1,
                  pointStrokeColor : "#fff"
              },
              {
                  label: "Avg 10s",
                  fillColor : "rgba(169,204,143,0.5)",
                  strokeColor : ColorScheme.clr2,
                  pointColor : ColorScheme.clr2,
                  pointStrokeColor : "#fff"
              }
      ],
      keys: ['avg_1s', 'avg_10s']
    },
    TP: {
      dataset: [
              {
                  label: "TP 1s",
                  fillColor : "rgba(190,163,122,0.5)",
                  strokeColor : ColorScheme.clr3,
                  pointColor : ColorScheme.clr3,
                  pointStrokeColor : "#fff"
              },
              {
                  label: "TP 10s",
                  fillColor : "rgba(243,170,121,0.5)",
                  strokeColor : ColorScheme.clr4,
                  pointColor : ColorScheme.clr4,
                  pointStrokeColor : "#fff",
              }
                   
      ],
      keys: ['tp_1s', 'tp_10s']
    }
  
  };
  
  function getDataset(DS) {
    return _.cloneDeep(DataSets[DS].dataset);
  }
  
  var Chart = React.createClass({
    counter: 0,
    componentWillMount: function () {
      var url = settings.WS_HOST + this.props.url;
      this.socket = new WebSocket(url);
      this.socket.onmessage = this.onMessage;
    },
    
    componentWillUnmount: function () {
      this.socket.close();
    },
    
    onMessage: function (data) {
      var d = JSON.parse(data.data);
      var keys = _.map(this.props.keys, function (k) { return d[k]; });
      this.updateData([moment()].concat(keys));
    },
  
    getInitialState: function () {
      var dataset = this.props.dataset;
      
      _.each(dataset, function (ds) {
        ds.data = emptyArray.slice();
      });
    
      return {
        data: {
          labels: _.map(_.range(datasetLength), function () { return ''; }),
          datasets: dataset
        }
      };
    },
    
    updateData: function (ds) {
      var data = _.extend({}, this.state.data),
          [date, ...values] = ds,
          label = (this.counter === 0) ? date.format('hh:mm:ss') : '';
      
      data.labels.shift();
      data.labels.push(label);
      _.each(data.datasets, function (dataset, idx) { 
        dataset.data.shift(); 
        dataset.data.push(values[idx]);
      });
      
      this.setState({
        data: data
      });
      
      this.counter = (this.counter < 29) ? this.counter + 1 : 0;
    },
  
    render: function () {
      var title = this.props.title ? <h3>{ this.props.title }</h3> : null;
    
      return (
        <div className="row">
          { title }
          <div className="chart-box">
            <LineChart data={ this.state.data } width={ this.props.width } height={ this.props.height } options={ Config } redraw />
          </div>
          <div className="legend span2">  
            <ChartLegend datasets={ this.state.data.datasets } />
          </div>
        </div>
      );
    }
  }); 

  var Overview = React.createClass({
    render: function () {
      return (
        <div className="container-fluid">
          <Chart url="/perfcache/allwfs" title="All workflows" width="1000" height="200" dataset={ getDataset('AVG') } keys={ DataSets.AVG.keys } />
          <Chart url="/perfcache/allwfs" width="1000" height="200" dataset={ getDataset('TP') } keys={ DataSets.TP.keys } />
          <Chart url="/perfcache/allsvcs" title="All services" width="1000" height="200" dataset={  getDataset('AVG') } keys={ DataSets.AVG.keys } />
          <Chart url="/perfcache/allsvcs" width="1000" height="200" dataset={ getDataset('TP') } keys={ DataSets.TP.keys } />

          <Chart url="/perfcache/alljobs" title="All jobs" width="1000" height="200" dataset={  getDataset('AVG') } keys={ DataSets.AVG.keys } />
          <Chart url="/perfcache/alljobs" width="1000" height="200" dataset={ getDataset('TP') } keys={ DataSets.TP.keys } />

        </div>
      );
    }
  });

  return Overview;
});