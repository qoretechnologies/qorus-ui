import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Log from './log';
import Loader from 'components/loader';

import actions from 'store/api/actions';

const orderSelector = (state, props) => (
  state.api.orders.data.find(w => (
    parseInt(props.params.id, 10) === parseInt(w.workflow_instanceid, 10)
  ))
);

const workflowSelector = (state, props) => {
  const { workflowid } = state.api.orders.data.find(w => (
    parseInt(props.params.id, 10) === parseInt(w.workflow_instanceid, 10)
  ));

  return state.api.workflows.data.find(w => (
    parseInt(workflowid, 10) === parseInt(w.id, 10)
  ));
};

const selector = createSelector(
  [
    orderSelector,
    workflowSelector,
  ], (order, workflow) => ({
    order,
    workflow,
  })
);

@connect(selector)
export default class LogView extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    order: PropTypes.object,
    workflow: PropTypes.object,
    location: PropTypes.object,
  };

  componentDidMount() {
    const { id } = this.props.params;

    this.props.dispatch(
      actions.orders.fetch({}, id)
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.order !== nextProps.order) {
      this.props.dispatch(
        actions.workflows.fetch({}, nextProps.order.workflowid)
      );
    }
  }

  render() {
    if (!this.props.workflow) return <Loader />;

    return (
      <Log
        resource={`workflows/${this.props.workflow.id}`}
        location={this.props.location}
      />
    );
  }
}
