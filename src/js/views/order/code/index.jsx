import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Code from 'components/code';
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
export default class LibraryView extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    order: PropTypes.object,
    workflow: PropTypes.object,
  };

  componentDidMount() {
    const { id } = this.props.params;

    this.props.dispatch(
      actions.orders.fetch({}, id)
    );

    this.props.dispatch(
      actions.workflows.fetch({ lib_source: true }, this.props.order.workflowid)
    );
  }

  getHeight: Function = (): number => {
    const navbar = document.querySelector('.navbar').clientHeight;
    const header = document.querySelector('.order-header').clientHeight;
    const tabs = document.querySelector('#content-wrapper .nav-tabs').clientHeight;
    const footer = document.querySelector('footer').clientHeight;
    const top = navbar + header + tabs + footer + 40;

    return window.innerHeight - top;
  };

  render() {
    if (!this.props.workflow) return <Loader />;

    return (
      <div className="workflow-detail-tabs">
        <Code
          data={this.props.workflow.lib}
          heightUpdater={this.getHeight}
        />
      </div>
    );
  }
}
