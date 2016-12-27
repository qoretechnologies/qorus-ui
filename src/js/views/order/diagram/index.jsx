import React, { Component, PropTypes } from 'react';

import actions from 'store/api/actions';
import Loader from 'components/loader';
import Info from './info';
import Keys from './keys';
import Graph from './graph';
import Hierarchy from '../hierarchy/';
import StepDetails from './step_details';
import Errors from './errors';
import Resize from 'components/resize/handle';

export default class DiagramView extends Component {
  static propTypes = {
    order: PropTypes.object,
    workflow: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentWillMount() {
    this.setState({
      step: null,
      paneSize: 200,
    });
  }

  handleStepClick = (step) => {
    this.setState({
      step,
    });
  };

  handleResizeStop = (width, height) => {
    this.setState({
      paneSize: height,
    });
  };

  handleSkipSubmit = (step, value, noretry) => {
    this.props.dispatch(
      actions.orders.skipStep(this.props.order.id, step.stepid, value, noretry)
    );
  };

  renderStepDetails() {
    if (!this.state.step) return undefined;

    return (
      <StepDetails
        step={this.state.step}
        instances={this.props.order.StepInstances}
        onSkipSubmit={this.handleSkipSubmit}
      />
    );
  }

  renderErrorPane() {
    if (!this.props.order.ErrorInstances) return undefined;

    let errors = this.props.order.ErrorInstances;

    if (this.state.step) {
      const stepId = this.props.order.StepInstances.find(s => (
        s.stepname === this.state.step
      )).stepid;

      errors = errors.filter(e => (
        e.stepid === stepId
      ));
    }

    return (
      <div className="error-pane fixed">
        <Resize
          top
          min={{ height: 200 }}
          onStop={this.handleResizeStop}
        />
        <Errors
          data={errors}
          paneSize={this.state.paneSize}
        />
      </div>
    );
  }

  render() {
    if (!this.props.workflow) return <Loader />;

    return (
      <div
        ref="wrapper"
        className="diagram-wrapper"
        style={{ paddingBottom: this.state.paneSize }}
      >
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
            data={this.props.order.keys}
          />
          <Hierarchy params={this.props.params} compact />
          { this.renderStepDetails() }
        </div>
        { this.renderErrorPane() }
      </div>
    );
  }
}
