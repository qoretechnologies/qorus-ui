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
import PaneItem from '../../../components/pane_item';
import Box from '../../../components/box';
import NoData from '../../../components/nodata';
import withDispatch from '../../../hocomponents/withDispatch';
import Flex from '../../../components/Flex';

@withDispatch()
export default class DiagramView extends Component {
  static propTypes = {
    order: PropTypes.object,
    workflow: PropTypes.object,
    params: PropTypes.object,
    isTablet: PropTypes.bool,
    dispatchAction: PropTypes.func,
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

  handleSkipSubmit = (step, value, noretry) => {
    this.props.dispatchAction(
      actions.orders.skipStep,
      this.props.order.id,
      step.stepid,
      value,
      noretry
    );
  };

  renderErrorPane(top, columns) {
    if (!this.props.order.ErrorInstances) return undefined;

    let errors = this.props.order.ErrorInstances;

    if (this.state.step) {
      const stepId = this.props.order.StepInstances.find(
        s => s.stepname === this.state.step
      ).stepid;

      errors = errors.filter(e => e.stepid === stepId);
    }

    return (
      <Box column={columns} noTransition top={top}>
        <Errors data={errors} />
      </Box>
    );
  }

  renderContent() {
    const columns: number = this.props.isTablet ? 1 : 2;
    const boxColumns: ?number = columns === 1 ? null : columns;
    const top: boolean = !this.props.isTablet;

    return [
      <Box column={boxColumns} noTransition top>
        <Graph
          workflow={this.props.workflow}
          order={this.props.order}
          onStepClick={this.handleStepClick}
        />
      </Box>,
      <Box column={boxColumns} noTransition top={top}>
        <Info {...this.props.order} />
      </Box>,
      <Box column={boxColumns} noTransition top={top}>
        <Keys data={this.props.order.keys} />
      </Box>,
      <Box column={boxColumns} noTransition top={top}>
        <PaneItem title="Hierarchy">
          <Hierarchy
            order={this.props.order}
            compact
            isTablet={this.props.isTablet}
          />
        </PaneItem>
      </Box>,
      <Box column={boxColumns} noTransition top={top}>
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
      </Box>,
      this.renderErrorPane(top, columns),
    ];
  }

  render() {
    if (!this.props.workflow) return <Loader />;

    return (
      <Flex scrollY>
        {!this.props.isTablet ? (
          <Masonry
            id="order-masonry"
            sizes={[{ columns: 2, gutter: 15 }]}
            infiniteScrollDisabled
            key={this.state.step}
          >
            {this.renderContent()}
          </Masonry>
        ) : (
          this.renderContent()
        )}
      </Flex>
    );
  }
}
