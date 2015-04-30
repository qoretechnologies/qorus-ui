define(function (require, exports, module) {
  var React     = require('react'),
      Charts    = require('chartjs'),
      LineChart = require('react-chartjs').Line,
      Menu      = require('views/system/menu/menu'),
      Backbone  = require('backbone'),
      settings  = require('settings'),
      moment    = require('moment');
  
  Menu.addMenuItem(new Backbone.Model({ 
      name: 'Graphs',
      url: '/performance',
      icon: 'signal'
  }), 'main');
  
  Menu.render();
  
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
      this.updateData([moment(), d.avg_1s, d.avg_10s, d.tp_1s, d.tp_10s]);
    },
  
    getInitialState: function () {
      return {
        data: {
          labels: _.map(_.range(120), function () { return ''; }),
          datasets: [
              {
                  label: "My First dataset",
/*                  fillColor: "rgba(220,220,220,0.2)",*/
                  strokeColor: "rgba(220,220,220,1)",
                  pointColor: "rgba(220,220,220,1)",
                  pointStrokeColor: "#fff",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgba(220,220,220,1)",
                  data: _.map(_.range(120), function () { return null; })
              },
              {
                  label: "My Second dataset",
/*                  fillColor: "rgba(151,187,205,0.2)",*/
                  strokeColor: "rgba(151,187,205,1)",
                  pointColor: "rgba(151,187,205,1)",
                  pointStrokeColor: "#fff",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgba(151,187,205,1)",
                  data: _.map(_.range(120), function () { return null; })
              }
          ]
        }
      };
    },
    
    updateData: function (ds) {
      var data = _.extend({}, this.state.data),
          [date, s10, m1] = ds,
          label = (this.counter == 0) ? date.format('hh:mm:ss') : '';
      
      data.labels.shift();
      data.datasets[0].data.shift();
      data.datasets[1].data.shift();
      
      data.labels.push(label);
      data.datasets[0].data.push(s10);
      data.datasets[1].data.push(m1);
      
      this.setState({
        data: data
      });
      
      this.counter = (this.counter < 9) ? this.counter + 1 : 0;
    },
  
    render: function () {
      return (
        <LineChart data={ this.state.data } width={ this.props.width } height={ this.props.height } options={ { animation: false } } redraw />
      );
    }
  }); 

  var Overview = React.createClass({
    render: function () {
      return (
      <Chart url="/perfcache/allwfs" width="1000" height="500" />
      );
    }
  });

  return Overview;
});