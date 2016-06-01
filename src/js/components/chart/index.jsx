import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';

import { pureRender } from 'components/utils';
import { getMaxValue, getStepSize } from '../../helpers/chart';

@pureRender
export default class ChartComponent extends Component {
  static propTypes = {
    id: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    type: PropTypes.string,
    labels: PropTypes.array,
    datasets: PropTypes.arrayOf(PropTypes.object),
    yAxisLabel: PropTypes.string,
    xAxisLabel: PropTypes.string,
    beginAtZero: PropTypes.bool,
  };

  static defaultProps = {
    width: 400,
    height: 200,
    type: 'line',
    beginAtZero: true,
  };

  componentWillMount() {
    this.setState({
      chart: null,
    });
  }

  componentDidMount() {
    this.renderChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.labels !== nextProps.labels) {
      const chart = this.state.chart;
      const optionsData = this.getOptionsData(nextProps.datasets);
      const datasets = nextProps.type === 'line' ?
        this.scaleData(nextProps.datasets) : nextProps.datasets;

      chart.data.labels = nextProps.labels;
      chart.data.datasets = datasets;

      if (nextProps.type === 'line') {
        chart.options.scales.yAxes[0].ticks.callback = (val) => val + optionsData.scale;
        chart.options.scales.yAxes[0].ticks.stepSize = optionsData.stepSize;
      }

      chart.update();
    }
  }

  getOptionsData(data) {
    const scale = getMaxValue(data) > 60 ? 'm' : 's';
    const stepSize = getStepSize(data);

    return {
      scale,
      stepSize,
    };
  }

  getOptions(data) {
    const optionsData = this.getOptionsData(data);
    const options = {
      legend: {
        display: false,
      },
      animation: false,
    };

    switch (this.props.type) {
      case 'line':
      default:
        return Object.assign(options, {
          tooltips: {
            mode: 'label',
            callbacks: {
              label(item) {
                return item.yLabel;
              },
            },
          },
          scales: {
            yAxes: [{
              ticks: {
                min: 0,
                stepSize: optionsData.stepSize,
                callback: (val) => val + optionsData.scale,
              },
              scaleLabel: {
                display: true,
                labelString: this.props.yAxisLabel,
              },
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: this.props.xAxisLabel,
              },
            }],
          },
        });
      case 'doughnut':
        return options;
    }
  }

  scaleData(data) {
    const mx = getMaxValue(data);
    return data.map(ds => {
      const set = ds;
      set.data = set.data.map(sd => {
        let d = sd;
        d = mx > 60 ? d / 60 : d;
        return d;
      });
      return set;
    });
  }

  renderChart = (props) => {
    const el = ReactDOM.findDOMNode(this.refs.chart);
    const options = this.getOptions(props.datasets);
    const datasets = this.scaleData(props.datasets);
    const chart = new Chart(el, {
      type: props.type,
      data: {
        labels: props.labels,
        datasets,
      },
      options,
    });

    this.setState({
      chart,
    });
  };

  renderLegend = () => {
    switch (this.props.type) {
      case 'line':
      default:
        return this.props.datasets.map((d, key) => (
          <li className="chart-legend" key={key}>
            <span
              className="color-box"
              style={{ backgroundColor: d.backgroundColor || '#d7d7d7' }}
            />
            { d.label }
          </li>
        ));
      case 'doughnut':
        return this.props.labels.map((d, key) => (
          <li className="chart-legend" key={key}>
            <span
              className="color-box"
              style={{ backgroundColor: this.props.datasets[0].backgroundColor[key] || '#d7d7d7' }}
            />
            { `${d} (${this.props.datasets[0].data[key]})` }
          </li>
        ));
    }
  };

  render() {
    return (
      <div
        className="chart-wrapper"
      >
        <div
          className="chart-box pull-left"
          style={{ width: this.props.width, height: this.props.height }}
        >
          <canvas
            ref="chart"
            id={this.props.id}
            width={this.props.width}
            height={this.props.height}
          />
        </div>
        <ul className="chart-legend pull-right">
          { this.renderLegend() }
        </ul>
      </div>
    );
  }
}
