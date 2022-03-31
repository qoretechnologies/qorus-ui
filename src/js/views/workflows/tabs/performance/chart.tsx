// @flow
import moment from 'moment';
import qs from 'qs';
import React, { Component } from 'react';
import Chart from '../../../../components/chart';
import Editable from '../../../../components/editable';
import Loader from '../../../../components/loader';
import { createDoughDatasets, createLineDatasets } from '../../../../helpers/chart';
import settings from '../../../../settings';
import { fetchJson } from '../../../../store/api/utils';

export default class ChartView extends Component {
  props: {
    days: number;
    workflow: any;
    global: boolean;
  } = this.props;

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
    // @ts-ignore ts-migrate(2339) FIXME: Property 'workflowid' does not exist on type 'Obje... Remove this comment to see the full error message
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
    // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
    const lineData = await fetchJson(
      'GET',
      `${settings.REST_BASE_URL}/orders?action=processingSummary&${queryString}`
    );

    const line = createLineDatasets(lineData, days);

    let state = {
      lineLabels: line.labels,
      lineDatasets: line.data,
    };

    if (this.props.workflow) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'workflowid' does not exist on type 'Obje... Remove this comment to see the full error message
      const { workflowid } = this.props.workflow;
      // @ts-ignore ts-migrate(2551) FIXME: Property 'minDate' does not exist on type '{ group... Remove this comment to see the full error message
      const minDate = encodeURIComponent(query.minDate);
      // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
      const doughData = await fetchJson(
        'GET',
        `${settings.REST_BASE_URL}/workflows/${workflowid}?date=${minDate}`
      );

      // @ts-ignore ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
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
    if (
      // @ts-ignore ts-migrate(2339) FIXME: Property 'lineLabels' does not exist on type 'Read... Remove this comment to see the full error message
      !this.state.lineLabels.length ||
      // @ts-ignore ts-migrate(2339) FIXME: Property 'doughLabels' does not exist on type 'Rea... Remove this comment to see the full error message
      (this.props.workflow && !this.state.doughLabels.length)
    ) {
      return <Loader />;
    }

    return (
      <div className="chart-view">
        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
        <Editable
          text={
            // @ts-ignore ts-migrate(2339) FIXME: Property 'days' does not exist on type 'Readonly<{... Remove this comment to see the full error message
            this.state.days > 1
              ? // @ts-ignore ts-migrate(2339) FIXME: Property 'days' does not exist on type 'Readonly<{... Remove this comment to see the full error message
                `Last ${this.state.days} days`
              : 'Last 24 hours'
          }
          // @ts-ignore ts-migrate(2339) FIXME: Property 'days' does not exist on type 'Readonly<{... Remove this comment to see the full error message
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
          // @ts-ignore ts-migrate(2339) FIXME: Property 'lineLabels' does not exist on type 'Read... Remove this comment to see the full error message
          labels={this.state.lineLabels}
          // @ts-ignore ts-migrate(2339) FIXME: Property 'lineDatasets' does not exist on type 'Re... Remove this comment to see the full error message
          datasets={this.state.lineDatasets}
        />
        {this.props.workflow && (
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          <Chart
            type="doughnut"
            id="test2"
            width={200}
            height={200}
            // @ts-ignore ts-migrate(2339) FIXME: Property 'doughLabels' does not exist on type 'Rea... Remove this comment to see the full error message
            labels={this.state.doughLabels}
            // @ts-ignore ts-migrate(2339) FIXME: Property 'doughDatasets' does not exist on type 'R... Remove this comment to see the full error message
            datasets={this.state.doughDatasets}
          />
        )}
      </div>
    );
  }
}
