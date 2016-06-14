import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import actions from 'store/api/actions';

import Loader from 'components/loader';
import Info from './info';
import Keys from './keys';
import Graph from './graph';
import StepDetails from './step_details';

const orderSelector = (state, props) => (
  state.api.orders.data.find(w => (
    parseInt(props.params.id, 10) === parseInt(w.workflow_instanceid, 10)
  ))
);

const workflowSelector = (state, props) => {
  const workflow = state.api.orders.data.find(w => (
      parseInt(props.params.id, 10) === parseInt(w.workflow_instanceid, 10)
    )) || null;

  return workflow ? state.api.workflows.data.find(w => (
    parseInt(workflow.workflowid, 10) === parseInt(w.id, 10)
  )) : null;
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
export default class DiagramView extends Component {
  static propTypes = {
    order: PropTypes.object,
    workflow: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentWillMount() {
    const { id } = this.props.params;

    this.props.dispatch(
      actions.orders.fetch({}, id)
    );

    this.setState({
      step: null,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.order !== nextProps.order) {
      this.props.dispatch(
        actions.workflows.fetch({}, nextProps.order.workflowid)
      );
    }
  }

  handleStepClick = (step) => {
    this.setState({
      step,
    });
  };

  renderStepDetails() {
    if (!this.state.step) return undefined;

    return (
      <StepDetails
        step={this.state.step}
        instances={this.props.order.StepInstances}
      />
    );
  }

  render() {
    if (!this.props.workflow) return <Loader />;

    return (
      <div>
        <div className="pull-left diagram-view">
          <Graph
            workflow={this.props.workflow}
            order={this.props.order}
            onStepClick={this.handleStepClick}
          />
        </div>
        <div className="pull-right order-info-view">
          <Info
            data={this.props.order}
            dispatch={this.props.dispatch}
          />
          <Keys
            data={this.props.order}
          />
          { this.renderStepDetails() }
        </div>
      </div>
    );
  }
}
