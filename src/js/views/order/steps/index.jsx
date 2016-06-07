import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { indexOf } from 'lodash';

import Row from './row';

import actions from 'store/api/actions';
import { STATUS_PRIORITY } from 'constants/orders';

const orderSelector = (state, props) => (
  state.api.orders.data.find(w => (
    parseInt(props.params.id, 10) === parseInt(w.workflow_instanceid, 10)
  ))
);

const selector = createSelector(
  [
    orderSelector,
  ], (order) => ({
    steps: order.StepInstances,
    errors: order.ErrorInstances,
    order,
  })
);

@connect(selector)
export default class StepsView extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    steps: PropTypes.array,
    errors: PropTypes.array,
    order: PropTypes.object,
  };

  componentDidMount() {
    const { id } = this.props.params;

    this.props.dispatch(
      actions.orders.fetch({}, id)
    );
  }

  groupInstances() {
    const stepGroups = [];

    this.props.steps.forEach(step => {
      const name = step.stepname;
      const group = stepGroups[name] = stepGroups[name] || { steps: [], name, status: null };
      const max = Math.max(
        indexOf(STATUS_PRIORITY, group.status), indexOf(STATUS_PRIORITY, step.stepstatus)
      );

      group.status = STATUS_PRIORITY[max];

      if (group.status !== 'COMPLETE' ||
        (group.status === 'COMPLETE' && step.stepstatus !== 'ERROR')) {
        group.steps.push(step);
      }
    });

    return stepGroups;
  }

  renderTableBody() {
    const data = this.groupInstances();

    return Object.keys(data).map((d, index) => (
        <Row stepdata={data[d]} key={index} />
      )
    );
  }

  render() {
    return (
      <div>
        <table
          className="table table-striped table-condensed table-hover table-fixed table--data"
        >
          <thead>
            <tr>
              <th className="narrow"></th>
              <th className="narrow">Status</th>
              <th className="narrow">Name</th>
              <th>Error Type</th>
              <th>Custom Status</th>
              <th className="narrow">Ind</th>
              <th className="narrow">Retries</th>
              <th className="narrow">Skip</th>
              <th>Started</th>
              <th>Completed</th>
              <th>SubWFL IID</th>
            </tr>
          </thead>
          { this.renderTableBody() }
        </table>
      </div>
    );
  }
}
