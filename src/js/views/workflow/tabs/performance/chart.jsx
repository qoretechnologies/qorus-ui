import React, { Component, PropTypes } from 'react';

import Loader from 'components/loader';
import Chart from 'components/chart';
import Editable from 'components/editable';

import { createLineDatasets, createDoughDatasets } from 'helpers/chart';

import { fetchJson } from 'store/api/utils';
import { pureRender } from 'components/utils';
import moment from 'moment';
import qs from 'qs';

@pureRender
export default class ChartView extends Component {
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

  handleEditableSubmit = (value) => {
    this.setState({
      days: value,
    });

    this.fetchData(value);
  };

  fetchData = async (days) => {
    const query = {
      grouping: days > 1 ? 'daily' : 'hourly',
      mindate: moment().add(-days, 'days').format('YYYY-MM-DD HH:mm:ss'),
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

    const line = createLineDatasets(lineData, days);
    const dough = createDoughDatasets(doughData, days);

    this.setState({
      lineLabels: line.labels,
      lineDatasets: line.data,
      doughLabels: dough.labels,
      doughDatasets: dough.data,
    });
  };

  errorChecker = (value) => !(!/^-?\d+$/.test(value) || value > 90 || value < 1);

  render() {
    if (!this.state.lineLabels.length || !this.state.doughLabels.length) {
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
