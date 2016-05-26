import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';

export default class extends Component {
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

      chart.data.labels = nextProps.labels;
      chart.data.datasets = nextProps.datasets;

      chart.update();
    }
  }

  renderChart = (props) => {
    const el = ReactDOM.findDOMNode(this.refs.chart);
    const chart = new Chart(el, {
      type: props.type,
      data: {
        labels: props.labels,
        datasets: props.datasets,
      },
      options: {
        legend: {
          display: false,
        },
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
              stepSize: 1,
            },
          }],
        },
      },
    });

    this.setState({
      chart,
    });
  };

  renderLegend = () => this.props.datasets.map((d, key) => (
      <li className="chart-legend" key={key}>
        <span className="color-box" style={{ backgroundColor: d.backgroundColor }} />
        { d.label }
      </li>
    )
  );

  render() {
    return (
      <div
        className="chart-wrapper pull-left"
      >
        <p className="chart-axis-label y-axis">
          {this.props.yAxisLabel}
        </p>
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
          <p className="chart-axis-label x-axis">
            {this.props.xAxisLabel}
          </p>
        </div>
        <ul className="chart-legend pull-right">
          { this.renderLegend() }
        </ul>
      </div>
    );
  }
}
