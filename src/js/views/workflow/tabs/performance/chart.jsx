import React, { Component, PropTypes } from 'react';
import { Control as Button } from 'components/controls';

import Loader from 'components/loader';
import Chart from 'components/chart';

import { DATASETS, DOUGH_LABELS } from 'constants/orders';
import { groupOrders } from 'helpers/chart';

import classNames from 'classnames';
import { fetchJson } from 'store/api/utils';
import { range, values } from 'lodash';
import { pureRender } from 'components/utils';
import moment from 'moment';
import qs from 'qs';

@pureRender
export default class extends Component {
  static propTypes = {
    days: PropTypes.number,
    workflow: PropTypes.object,
  };

  componentWillMount() {
    this.fetchData(this.props.days);

    this.setState({
      days: this.props.days,
      editing: false,
      value: null,
      lineLabels: [],
      lineDatasets: [],
      doughLabels: [],
      doughDatasets: [],
    });
  }

  handleHeaderClick = () => {
    this.setState({
      editing: true,
    });
  };

  handleCancelClick = () => {
    this.setState({
      editing: false,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (!/^-?\d+$/.test(this.state.value)) {
      this.setState({
        error: true,
      });
    } else {
      this.setState({
        days: this.state.value,
        editing: false,
      });

      this.fetchData(this.state.value);
    }
  };

  handleInputChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  fetchData = async (days) => {
    const query = {
      grouping: days > 1 ? 'daily' : 'hourly',
      minDate: moment().add(-days, 'days').format('YYYY-MM-DD HH:mm:ss'),
      wfids: this.props.workflow.workflowid,
      id: this.props.workflow.workflowid,
      global: false,
      seconds: true,
      step: days,
    };
    const queryString = qs.stringify(query);
    const lineData = await fetchJson(
      'GET',
      `/api/orders?action=processingSummary&${queryString}`
    );
    const doughData = await fetchJson(
      'GET',
      `/api/workflows/${this.props.workflow.workflowid}?date=${encodeURIComponent(query.minDate)}`
    );

    const line = this.createLineDatasets(lineData, days);
    const dough = this.createDoughDatasets(doughData, days);

    this.setState({
      lineLabels: line.labels,
      lineDatasets: line.data,
      doughLabels: dough.labels,
      doughDatasets: dough.data,
    });
  };

  createLineDatasets(data, days) {
    const rng = days > 1 ? range(days) : range(24);
    const type = days > 1 ? 'days' : 'hours';
    const format = days > 1 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH';

    let labels = rng.map(r => moment().add(-r, type).format(format));
    const dt = [];

    labels.forEach(l => {
      const m = data.find(d => d.grouping === l);

      Object.keys(DATASETS).forEach(ds => {
        dt[ds] = dt[ds] || {
          data: [],
          label: ds,
          backgroundColor: DATASETS[ds],
          borderColor: DATASETS[ds],
          fill: false,
        };

        if (m) {
          dt[ds].data.push(m[ds]);
        } else {
          dt[ds].data.push(0);
        }
      });
    });

    labels = labels.map(lb => lb.slice(-2)).reverse();

    return {
      labels,
      data: values(dt),
    };
  }

  createDoughDatasets(data) {
    const labels = Object.keys(DOUGH_LABELS);
    const dt = [{
      data: groupOrders(data),
      backgroundColor: values(DOUGH_LABELS),
    }];

    return {
      labels,
      data: dt,
    };
  }

  renderHeader() {
    if (this.state.editing) {
      const css = classNames('form-control', this.state.error ? 'form-error' : '');

      return (
        <form onSubmit={this.handleSubmit}>
          <div className="input-group col-sm-2">
            <input
              type="number"
              min="1"
              max="90"
              className={css}
              defaultValue={this.state.days}
              onChange={this.handleInputChange}
            />
            <div className="input-group-btn">
              <Button
                type="submit"
                big
                btnStyle="success"
                icon="save"
              />
              <Button
                type="button"
                big
                btnStyle="default"
                icon="times"
                action={this.handleCancelClick}
              />
            </div>
          </div>
        </form>
      );
    }

    return (
      <h3 onClick={this.handleHeaderClick}> Last { this.state.days } days </h3>
    );
  }

  render() {
    if (!this.state.lineLabels.length || !this.state.doughLabels.length) {
      return <Loader />;
    }

    return (
      <div className="chart-view">
        { this.renderHeader() }
        <Chart
          type="line"
          id="test"
          width={600}
          height={200}
          yAxisLabel="Time in 1 sec"
          xAxisLabel="Hour/Day [orders processed]"
          labels={this.state.lineLabels}
          datasets={this.state.lineDatasets}
        />
        <Chart
          type="doughnut"
          id="test2"
          width={200}
          height={200}
          labels={this.state.doughLabels}
          datasets={this.state.doughDatasets}
        />
      </div>
    );
  }
}
