import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { indexOf, sortBy } from 'lodash';

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
    const step_groups = [];
    const errors = this.props.errors.slice();

    this.props.steps.forEach(step => {
      const name = step.stepname;
      const group = step_groups[name] = step_groups[name] || { steps: [], name, status: null };

      group.steps.push(step);

      const max = Math.max(
        indexOf(STATUS_PRIORITY, group.status), indexOf(STATUS_PRIORITY, step.stepstatus)
      );

      group.status = STATUS_PRIORITY[max];

      errors.filter(error => (
        error.stepid === step.stepid && error.ind === step.ind
      )).map(err => {
        const e = err;
        e.stepname = name;

        if (step.stepstatus === 'COMPLETE') {
          e.completed = true;
        }

        return e;
      });
    });

    const steps = sortBy(this.props.steps, 'started');
  }

  renderTableBody() {
    this.groupInstances();
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
              <th className="narrow">Error Type</th>
              <th className="narrow">Custom Status</th>
              <th className="narrow">Ind</th>
              <th className="narrow">Retries</th>
              <th className="narrow">Skip</th>
              <th className="narrow">Started</th>
              <th className="narrow">Completed</th>
            </tr>
          </thead>
          <tbody>
            { this.renderTableBody() }
          </tbody>
        </table>
      </div>
    );
  }
}
