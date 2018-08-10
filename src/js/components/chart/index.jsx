/* @flow */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';
import pure from 'recompose/onlyUpdateForKeys';

import { CenterWrapper } from '../layout';

import {
  getMaxValue,
  getStepSize,
  scaleData,
  getUnit,
  getFormattedValue,
} from '../../helpers/chart';
import { NonIdealState } from '../../../../node_modules/@blueprintjs/core';

@pure([
  'width',
  'height',
  'labels',
  'datasets',
  'xAxisLabel',
  'yAxisLabel',
  'unit',
  'stepSize',
  'yMax',
  'yMin',
  'empty',
])
export default class ChartComponent extends Component {
  static defaultProps = {
    width: 400,
    height: 200,
    type: 'line',
    beginAtZero: true,
    isTime: true,
  };

  props: {
    id: string,
    width: number | string,
    height: number,
    type: string,
    labels: Array<any>,
    datasets: Array<Object>,
    yAxisLabel: string,
    xAxisLabel: string,
    beginAtZero: boolean,
    unit?: string,
    isNotTime?: boolean,
    empty?: boolean,
    title?: string,
    stepSize?: number,
    yMax?: number,
    yMin?: number,
    legendHandlers?: Array<Function>,
    onClick?: Function,
  };

  state: {
    chart: Object,
  };

  state = {
    chart: {},
  };

  componentDidMount() {
    if (!this.props.empty) {
      this.renderChart(this.props);
    }
  }

  componentWillReceiveProps(nextProps: Object) {
    if (!this.props.empty) {
      if (this.props.labels !== nextProps.labels) {
        const chart = this.state.chart;
        const { stepSize, unit } = this.getOptionsData(nextProps.datasets);
        const datasets =
          nextProps.type === 'line'
            ? scaleData(nextProps.datasets, nextProps.isNotTime)
            : nextProps.datasets;

        chart.data.labels = nextProps.labels;
        chart.data.datasets = datasets;

        if (nextProps.type === 'line') {
          chart.options.scales.yAxes[0].ticks.callback = val =>
            getFormattedValue(val, datasets) + unit;
          chart.options.scales.yAxes[0].ticks.stepSize = stepSize;
          chart.options.scales.xAxes[0].scaleLabel.labelString =
            nextProps.xAxisLabel;
          chart.options.tooltips.callbacks.label = item =>
            getFormattedValue(item.yLabel, nextProps.datasets) + unit;
        }

        chart.update();
      }
    }
  }

  getOptionsData(data: Array<Object>): Object {
    const unit: string = this.props.unit || getUnit(getMaxValue(data));
    const stepSize: number =
      this.props.stepSize || getStepSize(data, this.props.isNotTime);

    return {
      unit,
      stepSize,
    };
  }

  getOptions(data: Array<Object>) {
    const { stepSize, unit } = this.getOptionsData(data);
    const { yMin, yMax } = this.props;
    const min = yMin ? yMin - yMin / 10 : 0;
    const max = yMax ? yMax + yMax / 10 : null;

    // stepSize: number, unit: string
    const options: Object = {
      legend: {
        display: false,
      },
      animation: false,
      maintainAspectRatio: false,
    };

    switch (this.props.type) {
      case 'line':
      default:
        return Object.assign({}, options, {
          tooltips: {
            mode: 'label',
            callbacks: {
              label(item) {
                return getFormattedValue(item.yLabel, data) + unit;
              },
            },
          },
          scales: {
            yAxes: [
              {
                ticks: max
                  ? {
                      min,
                      max,
                      stepSize,
                      callback: val => getFormattedValue(val, data) + unit,
                      fontSize: 10,
                    }
                  : {
                      min,
                      stepSize,
                      callback: val => getFormattedValue(val, data) + unit,
                      fontSize: 10,
                    },
                scaleLabel: {
                  display: !!this.props.yAxisLabel,
                  labelString: this.props.yAxisLabel,
                },
              },
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: !!this.props.xAxisLabel,
                  labelString: this.props.xAxisLabel,
                },
                ticks: {
                  fontSize: 10,
                },
              },
            ],
          },
        });
      case 'doughnut':
        return {
          ...options,
          ...{
            cutoutPercentage: 0,
          },
        };
    }
  }

  renderChart: Function = (props: Object): void => {
    const el: Object = ReactDOM.findDOMNode(this.refs.chart);
    const options: Object = this.getOptions(props.datasets);
    const datasets: Array<Object> = scaleData(
      props.datasets,
      this.props.isNotTime
    );
    const chart: Object = new Chart(el, {
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

  renderLegend: Function = (): Array<React.Element<any>> => {
    switch (this.props.type) {
      case 'line':
      default:
        return this.props.datasets.map((d, key) => (
          <li
            className="chart-legend"
            key={key}
            onClick={
              this.props.datasets[0].data[key] !== 0 &&
              this.props.legendHandlers &&
              this.props.legendHandlers[key]
            }
          >
            <span
              className="color-box"
              style={{ backgroundColor: d.backgroundColor || '#d7d7d7' }}
            />
            {d.label}
          </li>
        ));
      case 'doughnut':
        return this.props.labels.map((d, key) => (
          <li
            className="chart-legend"
            key={key}
            onClick={
              this.props.datasets[0].data[key] !== 0 &&
              this.props.legendHandlers &&
              this.props.legendHandlers[key]
            }
          >
            <span
              className="color-box"
              style={{
                backgroundColor: this.props.empty
                  ? '#eeeeee'
                  : this.props.datasets[0].backgroundColor[key] || '#d7d7d7',
              }}
            />
            {`${d} (${this.props.datasets[0].data[key]}${
              this.props.unit ? this.props.unit : ''
            })`}
          </li>
        ));
    }
  };

  render(): React.Element<any> {
    return (
      <div
        className={`chart-wrapper ${
          this.props.type === 'doughnut' ? 'pie' : ''
        }`}
      >
        {this.props.title && <h5>{this.props.title}</h5>}
        <div
          className="chart-box"
          style={{ width: this.props.width, height: this.props.height }}
          onClick={!this.props.empty && this.props.onClick}
        >
          {this.props.empty && this.props.type === 'doughnut' ? (
            <div className="pie-chart-placeholder">
              <NonIdealState title="No data" visual="warning-sign" />
            </div>
          ) : (
            <canvas
              ref="chart"
              id={this.props.id}
              width={this.props.width}
              height={this.props.height}
            />
          )}
        </div>
        <CenterWrapper>
          <ul className="chart-legend">{this.renderLegend()}</ul>
        </CenterWrapper>
      </div>
    );
  }
}
