/* @flow */
import { NonIdealState } from '@blueprintjs/core';
import Chart from 'chart.js';
import round from 'lodash/round';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { injectIntl } from 'react-intl';
import { getMaxValue, getStepSize, getUnit, scaleData } from '../../helpers/chart';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/la... Remove this comment to see the full error message
import { CenterWrapper } from '../layout';

@injectIntl
export default class ChartComponent extends Component {
  static defaultProps = {
    width: 400,
    height: 200,
    type: 'line',
    beginAtZero: true,
    isTime: true,
  };

  props: {
    id: string;
    width: number | string;
    height: number;
    type: string;
    labels: Array<any>;
    datasets: Array<Object>;
    yAxisLabel: string;
    xAxisLabel: string;
    beginAtZero: boolean;
    unit?: string;
    isNotTime?: boolean;
    empty?: boolean;
    title?: string;
    stepSize?: number;
    yMax?: number;
    yMin?: number;
    legendHandlers?: Array<Function>;
    onClick?: Function;
  } = this.props;

  state: {
    chart: any;
  };

  // @ts-ignore ts-migrate(2300) FIXME: Duplicate identifier 'state'.
  state = {
    chart: {},
  };

  componentDidMount() {
    this.renderChart(this.props);
  }

  componentWillReceiveProps(nextProps: any) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
    if (this.props.id !== nextProps.id) {
      this.renderChart(nextProps);
    } else if (
      // @ts-ignore ts-migrate(2339) FIXME: Property 'stepSize' does not exist on type 'Object... Remove this comment to see the full error message
      (this.props.stepSize !== nextProps.stepSize ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'labels' does not exist on type 'Object'.
        this.props.labels !== nextProps.labels) &&
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      this.state.chart.data
    ) {
      const chart = this.state.chart;
      // @ts-ignore ts-migrate(2339) FIXME: Property 'stepSize' does not exist on type 'Object... Remove this comment to see the full error message
      const { stepSize, unit } = this.getOptionsData(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'datasets' does not exist on type 'Object... Remove this comment to see the full error message
        nextProps.datasets,
        // @ts-ignore ts-migrate(2345) FIXME: Argument of type 'Object' is not assignable to par... Remove this comment to see the full error message
        nextProps
      );
      const datasets =
        // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
        nextProps.type === 'line' || nextProps.type === 'bar'
          ? // @ts-ignore ts-migrate(2339) FIXME: Property 'datasets' does not exist on type 'Object... Remove this comment to see the full error message
            scaleData(nextProps.datasets, nextProps.isNotTime)
          : // @ts-ignore ts-migrate(2339) FIXME: Property 'datasets' does not exist on type 'Object... Remove this comment to see the full error message
            nextProps.datasets;

      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      chart.data.labels = nextProps.labels;
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      chart.data.datasets = datasets;

      // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
      if (nextProps.type === 'line' || nextProps.type === 'bar') {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'options' does not exist on type 'Object'... Remove this comment to see the full error message
        chart.options.scales.yAxes[0].ticks.callback = (val) => round(val, 2) + unit;
        // @ts-ignore ts-migrate(2339) FIXME: Property 'options' does not exist on type 'Object'... Remove this comment to see the full error message
        chart.options.scales.yAxes[0].ticks.stepSize = stepSize;
        // @ts-ignore ts-migrate(2339) FIXME: Property 'options' does not exist on type 'Object'... Remove this comment to see the full error message
        chart.options.scales.xAxes[0].scaleLabel.labelString =
          // @ts-ignore ts-migrate(2339) FIXME: Property 'xAxisLabel' does not exist on type 'Obje... Remove this comment to see the full error message
          nextProps.xAxisLabel;
        // @ts-ignore ts-migrate(2339) FIXME: Property 'options' does not exist on type 'Object'... Remove this comment to see the full error message
        chart.options.tooltips.callbacks.label = (item) => round(item.yLabel, 2) + unit;
      }

      // @ts-ignore ts-migrate(2339) FIXME: Property 'update' does not exist on type 'Object'.
      chart.update();
    }
  }

  getOptionsData(data: Array<Object>, props = this.props): any {
    const unit: string = props.unit || getUnit(getMaxValue(data));
    const stepSize: number = props.stepSize || getStepSize(data, props.isNotTime);

    return {
      unit,
      stepSize,
    };
  }

  getOptions(props) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'stepSize' does not exist on type 'Object... Remove this comment to see the full error message
    const { stepSize, unit } = this.getOptionsData(props.datasets);
    const { yMin, yMax } = props;
    const min = yMin ? yMin - yMin / 10 : 0;
    const max = yMax ? yMax + yMax / 10 : null;

    // stepSize: number, unit: string
    const options: any = {
      legend: {
        display: false,
      },
      animation: false,
      maintainAspectRatio: false,
    };

    switch (props.type) {
      case 'line':
      case 'bar':
      default:
        return Object.assign({}, options, {
          tooltips: {
            mode: 'label',
            callbacks: {
              label(item) {
                return item.yLabel + unit;
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
                      callback: (val) => round(val, 2) + unit,
                      fontSize: 10,
                    }
                  : {
                      min,
                      stepSize,
                      callback: (val) => round(val, 2) + unit,
                      fontSize: 10,
                    },
                scaleLabel: {
                  display: !!props.yAxisLabel,
                  labelString: props.yAxisLabel,
                },
              },
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: !!props.xAxisLabel,
                  labelString: props.xAxisLabel,
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

  renderChart: Function = (props: any): void => {
    const el: any = ReactDOM.findDOMNode(this.refs.chart);
    const options: any = this.getOptions(props);
    // @ts-ignore ts-migrate(2339) FIXME: Property 'datasets' does not exist on type 'Object... Remove this comment to see the full error message
    const datasets: Array<Object> = scaleData(props.datasets, props.isNotTime);
    const chart: any = new Chart(el, {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
      type: props.type,
      data: {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'labels' does not exist on type 'Object'.
        labels: props.labels,
        datasets,
      },
      options,
    });

    this.setState({
      chart,
    });
  };

  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  renderLegend: Function = (): Array<React.Element<any>> => {
    switch (this.props.type) {
      case 'bar':
      case 'line':
      default:
        return this.props.datasets.map((d, key) => (
          <li
            className="chart-legend"
            key={key}
            // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
            onClick={
              // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
              this.props.datasets[0].data[key] !== 0 &&
              this.props.legendHandlers &&
              this.props.legendHandlers[key]
            }
          >
            <span
              className="color-box"
              // @ts-ignore ts-migrate(2339) FIXME: Property 'backgroundColor' does not exist on type ... Remove this comment to see the full error message
              style={{ backgroundColor: d.backgroundColor || '#d7d7d7' }}
            />
            {/* @ts-ignore ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Object'. */}
            {d.label}
          </li>
        ));
      case 'doughnut':
        return this.props.labels.map((d, key) => (
          <li
            className="chart-legend"
            key={key}
            // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
            onClick={
              // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
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
                  : // @ts-ignore ts-migrate(2339) FIXME: Property 'backgroundColor' does not exist on type ... Remove this comment to see the full error message
                    this.props.datasets[0].backgroundColor[key] || '#d7d7d7',
              }}
            />
            {/* @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'. */}
            {`${d} (${this.props.datasets[0].data[key]}${this.props.unit ? this.props.unit : ''})`}
          </li>
        ));
    }
  };

  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  render() {
    return (
      <div className={`chart-wrapper ${this.props.type === 'doughnut' ? 'pie' : ''}`}>
        {this.props.title && <p>{this.props.title}</p>}
        <div
          className="chart-box"
          style={{ width: this.props.width, height: this.props.height }}
          // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
          onClick={!this.props.empty && this.props.onClick}
        >
          {this.props.empty && this.props.type === 'doughnut' && (
            <div className="pie-chart-placeholder">
              <NonIdealState
                // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ id: stri... Remove this comment to see the full error message
                title={this.props.intl.formatMessage({
                  id: 'component.no-data',
                })}
                // @ts-ignore ts-migrate(2322) FIXME: Type '{ title: any; visual: string; }' is not assi... Remove this comment to see the full error message
                visual="warning-sign"
              />
            </div>
          )}
          <canvas
            style={{
              display: this.props.empty && this.props.type === 'doughnut' ? 'none' : 'initial',
            }}
            ref="chart"
            id={this.props.id}
            width={this.props.width}
            height={this.props.height}
          />
        </div>
        {this.props.type !== 'bar' && (
          <CenterWrapper>
            <ul className="chart-legend">{this.renderLegend()}</ul>
          </CenterWrapper>
        )}
      </div>
    );
  }
}
