import React, { Component, PropTypes } from 'react';
import Masonry from 'react-masonry-layout';

import actions from 'store/api/actions';
import Loader from 'components/loader';
import Info from './info';
import Keys from './keys';
import Graph from './graph';
import Hierarchy from '../hierarchy/';
import StepDetails from './step_details';
import Errors from './errors';
import Resize from 'components/resize/handle';
import PaneItem from '../../../components/pane_item';
import Box from '../../../components/box';
import NoData from '../../../components/nodata';
import Container from '../../../components/container';

export default class DiagramView extends Component {
  static propTypes = {
    order: PropTypes.object,
    workflow: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func,
    isTablet: PropTypes.bool,
  };

  componentWillMount() {
    this.setState({
      step: null,
      paneSize: 200,
    });
  }

  handleStepClick = step => {
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

  diagramRef = el => {
    if (el) {
      const copy = el;
      copy.scrollLeft = el.scrollWidth;
      const diff = (el.scrollWidth - el.scrollLeft) / 2;
      const middle = el.scrollWidth / 2 - diff;

      copy.scrollLeft = middle;
    }
  };

  renderErrorPane() {
    if (!this.props.order.ErrorInstances) return undefined;

    let errors = this.props.order.ErrorInstances;

    if (this.state.step) {
      const stepId = this.props.order.StepInstances.find(
        s => s.stepname === this.state.step
      ).stepid;

      errors = errors.filter(e => e.stepid === stepId);
    }

    return (
      <Box column={2} noTransition top>
        <Errors data={errors} paneSize={this.state.paneSize} />
      </Box>
    );
  }

  render() {
    if (!this.props.workflow) return <Loader />;

    return (
      <Container>
        <Masonry
          id="order-masonry"
          sizes={[{ columns: 2, gutter: 15 }]}
          infiniteScrollDisabled
          key={this.state.step}
        >
          <Box column={2} noTransition top style={{ overflowX: 'auto' }}>
            <PaneItem title="Steps graph">
              <Graph
                workflow={this.props.workflow}
                order={this.props.order}
                onStepClick={this.handleStepClick}
              />
            </PaneItem>
          </Box>
          <Box column={2} noTransition top>
            <Info {...this.props.order} />
          </Box>
          <Box column={2} noTransition top>
            <Keys data={this.props.order.keys} />
          </Box>
          <Box column={2} noTransition top>
            <PaneItem title="Hierarchy">
              <Hierarchy
                order={this.props.order}
                compact
                isTablet={this.props.isTablet}
              />
            </PaneItem>
          </Box>
          <Box column={2} noTransition top>
            <PaneItem title="Step details">
              {this.state.step ? (
                <StepDetails
                  step={this.state.step}
                  instances={this.props.order.StepInstances}
                  onSkipSubmit={this.handleSkipSubmit}
                />
              ) : (
                <NoData />
              )}
            </PaneItem>
          </Box>
          {this.renderErrorPane()}
        </Masonry>
      </Container>
    );
  }
}
