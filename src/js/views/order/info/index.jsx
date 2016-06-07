import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Info from 'components/info_table';

import actions from 'store/api/actions';

const orderSelector = (state, props) => (
  state.api.orders.data.find(w => (
    parseInt(props.params.id, 10) === parseInt(w.workflow_instanceid, 10)
  ))
);

const selector = createSelector(
  [
    orderSelector,
  ], (order) => ({
    order,
  })
);

@connect(selector)
export default class InfoView extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    order: PropTypes.object,
  };

  componentDidMount() {
    const { id } = this.props.params;

    this.props.dispatch(
      actions.orders.fetch({}, id)
    );
  }

  render() {
    return (
      <Info
        object={this.props.order}
        pick={[
          'name',
          'workflowid',
          'workflow_instanceid',
          'workflowstatus',
          'status_sessionid',
          'started',
          'completed',
          'modified',
          'parent_workflow_instanceid',
          'synchronous',
          'warning_count',
          'error_count',
          'custom_status',
          'custom_status_desc',
          'priority',
          'scheduled',
        ]}
      />
    );
  }
}
