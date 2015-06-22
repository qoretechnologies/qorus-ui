define(function (require, exports, module) {
  var React           = require('react'),
      Charts          = require('chartjs'),
      LineChart       = require('react-chartjs').Line,
      Menu            = require('views/system/menu/menu'),
      Backbone        = require('backbone'),
      settings        = require('settings'),
      helpers         = require('qorus/helpers'),
      WebSocketMixin  = require('views.react/mixins/websocket'),
      utils           = require('utils'),
      moment          = require('moment');

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
    pointDot: false,
    // responsive: true,
    maintainAspectRatio: false,
    showSingleTooltip: true,
    pointHitDetectionRadius: 0,
    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
/*
    customTooltips: function (tooltip) {
      if (!tooltip) {
        return;
      }

      console.log(_.keys(tooltip), arguments);
    }
*/
  };

  var ChartLegend = React.createClass({
    propTypes: {
      datasets: React.PropTypes.array.isRequired
    },

    render: function () {
      var datasets = {};

      _.each(this.props.datasets, function (ds) {
        datasets[ds.label] = <li key={ ds.label }><span className="legend-color-box" style={{ backgroundColor: ds.strokeColor }}></span> { ds.label }</li>;
      });

      return (
        <ul className={ this.props.title + "-legend" }>
          { React.addons.createFragment(datasets) }
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
                  strokeColor: ColorScheme.clr3,
                  pointColor: ColorScheme.clr3,
                  pointStrokeColor : "#fff"
              }

      ],
      keys: ['tp_1s', 'tp_10s']
    }

  };

  function getDataset(DS, clr) {
    var dataset = _.cloneDeep(DataSets[DS].dataset);

    if (clr) {
      dataset[0].strokeColor = dataset[0].pointColor = ColorScheme[clr];
    }

    return dataset;
  }

  var Chart = React.createClass({
    counter: 0,

    getInitialState: function () {
      return this.emptyDatasets();
    },

    componentDidUpdate: function (nextProps) {
      if (_.pick(this.props, ['width', 'height']) != _.pick(nextProps, ['width', 'height'])) {
        var chart = this.refs.chart.getChart();
        var cnvs = this.refs.chart.getCanvass();

        chart.scale.height = this.props.height;
        cnvs.width = this.props.width;
        cnvs.height = this.props.height;
        chart.update();
      }
    },

    onMessage: function (data) {
      var d = data;
      var keys = _.map(this.props.keys, function (k) { return d[k]; });
      this.updateData([moment()].concat(keys));
    },

    updateData: function (ds) {
      var data = _.extend({}, this.state.data),
          [date, ...values] = ds,
          label = (this.counter === 0) ? date.format('hh:mm:ss') : '';

      if (date - this.state.date > 2000) {
        data = this.emptyDatasets().data;
      }

      data.labels.shift();
      data.labels.push(label);
      _.each(data.datasets, function (dataset, idx) {
        dataset.data.shift();
        dataset.data.push(values[idx]);
      });

      this.setState({
        data: data,
        date: date
      });

      this.counter = (this.counter < 29) ? this.counter + 1 : 0;
    },

    onMouseOver: function (evt) {
      console.log(this.refs.chart.getChart().getPointsAtEvent(evt));
    },

    emptyDatasets: function () {
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

    render: function () {
      var conf = _.extend({}, Config);

      return (
        <div className="row-fluid">
          <div className="chart-box">
            <LineChart ref="chart" data={ this.state.data } width={ this.props.width } height={ this.props.height } options={ conf } style={{ width: this.props.width }} />
          </div>
          <div className="legend">
            <ChartLegend datasets={ this.state.data.datasets } />
          </div>
        </div>
      );
    }
  });

  var ChartGroup = React.createClass({
    render: function () {
    var title = this.props.title ? <div className="span12"><h3>{ this.props.title }</h3></div> : null;

      return (
        <div>
          { title }
          { this.props.children }
        </div>
      );
    }
  });

  var ChartsMap = {
    allwfs:  ['wfs_tp'],
    allsvcs: ['svcs_tp'],
    alljobs: ['jobs_tp']
  };

  var Overview = React.createClass({
    websocketUrl: settings.WS_HOST + '/perfcache/' + _.keys(ChartsMap).join(','),
    mixins: [WebSocketMixin],

    getInitialState: function () {
      return {
        maxWidth: 0
      };
    },

    onMessage: function (data) {
      var ref = ChartsMap[data.name];

      if (ref) {
        _.each(ref, function (ref) {
          this.refs[ref].onMessage(data);
        }, this);
      }
    },

    componentDidMount: function () {
      this.setWidth();
      $(window).on('resize.graphing', this.setWidth);
    },

    componentWillUnmount: function () {
      $(window).on('resize.graphing');
    },

    setWidth: function () {
      if (this.isMounted()) {
        var node  = this.getDOMNode(),
            state = { maxWidth: node.clientWidth };

        this.setState(state);
      }
    },

    render: function () {
      var width = this.state.maxWidth - 300;

      if (this.state.maxWidth === 0) {
        return (<div><div className="row"><div className="span2">{ width }</div></div></div>);
      } else {
        return (
          <div>
            <ChartGroup title="All workflows">
              <Chart ref="wfs_tp" width={ width } height={ 300 } dataset={ getDataset('TP', 'clr1') } keys={ DataSets.TP.keys } />
            </ChartGroup>
            <ChartGroup title="All services">
              <Chart ref="svcs_tp" width={ width } height={ 300 } dataset={ getDataset('TP', 'clr2') } keys={ DataSets.TP.keys } />
            </ChartGroup>
            <ChartGroup title="All jobs">
              <Chart ref="jobs_tp" width={ width } height={ 300 } dataset={ getDataset('TP', 'clr3') } keys={ DataSets.TP.keys } />
            </ChartGroup>
          </div>
        );
      }
    }
  });

  return Overview;
});
