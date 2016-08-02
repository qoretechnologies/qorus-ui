import React, { Component, PropTypes } from 'react';

import Loader from 'components/loader';
import Chart from 'components/chart';
import Editable from 'components/editable';

import { createLineDatasets, createDoughDatasets } from 'helpers/chart';

import { fetchJson } from 'store/api/utils';
import moment from 'moment';
import qs from 'qs';

export default class ChartView extends Component {
  static propTypes = {
    days: PropTypes.number,
    workflow: PropTypes.object,
    global: PropTypes.boolean,
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

  handleEditableSubmit = (value) => {
    this.setState({
      days: value,
    });

    this.fetchData(value);
  };

  fetchData = async (days) => {
    const id = this.props.workflow ? this.props.workflow.workflowid : '';
    const query = {
      grouping: days > 1 ? 'daily' : 'hourly',
      mindate: moment().add(-days, 'days').format('YYYY-MM-DD HH:mm:ss'),
      wfids: id,
      id,
      global: this.props.global || false,
      seconds: true,
      step: days,
    };
    const queryString = qs.stringify(query);
    const lineData = await fetchJson(
      'GET',
      `/api/orders?action=processingSummary&${queryString}`
    );

    const line = createLineDatasets(lineData, days);

    let state = {
      lineLabels: line.labels,
      lineDatasets: line.data,
    };

    if (this.props.workflow) {
      const doughData = await fetchJson(
        'GET',
        `/api/workflows/${this.props.workflow.workflowid}?date=${encodeURIComponent(query.minDate)}`
      );

      const dough = createDoughDatasets(doughData, days);

      state = Object.assign({}, state, {
        doughLabels: dough.labels,
        doughDatasets: dough.data,
      });
    }

    this.setState(state);
  };

  errorChecker = (value) => !(!/^-?\d+$/.test(value) || value > 90 || value < 1);

  render() {
    if (!this.state.lineLabels.length || (this.props.workflow && !this.state.doughLabels.length)) {
      return <Loader />;
    }

    return (
      <div className="chart-view">
        <Editable
          text={`Last ${this.state.days} days`}
          value={this.state.days}
          onSubmit={this.handleEditableSubmit}
          errorChecker={this.errorChecker}
          type="number"
        />
        <Chart
          type="line"
          id="test"
          width={600}
          height={200}
          yAxisLabel="Time"
          xAxisLabel="Hour/Day [orders processed]"
          labels={this.state.lineLabels}
          datasets={this.state.lineDatasets}
        />
        {this.props.workflow && (
          <Chart
            type="doughnut"
            id="test2"
            width={200}
            height={200}
            labels={this.state.doughLabels}
            datasets={this.state.doughDatasets}
          />
        )}
      </div>
    );
  }
}
