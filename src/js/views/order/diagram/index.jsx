// @flow
import React, { Component } from 'react';

import actions from '../../../store/api/actions';
import Loader from '../../../components/loader';
import Info from './info';
import Keys from './keys';
import StepCodeDiagram from '../../../components/StepCodeDiagram';
import Hierarchy from '../hierarchy/';
import Errors from '../errors';
import PaneItem from '../../../components/pane_item';
import Box from '../../../components/box';
import withDispatch from '../../../hocomponents/withDispatch';
import Flex from '../../../components/Flex';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { MasonryLayout, MasonryPanel } from '../../../components/MasonryLayout';

@withDispatch()
@onlyUpdateForKeys(['order', 'workflow', 'isTablet'])
export default class DiagramView extends Component {
  props: {
    order: Object,
    workflow: Object,
    isTablet: boolean,
    dispatchAction: Function,
  } = this.props;

  handleSkipSubmit = (step, value, noretry) => {
    this.props.dispatchAction(
      actions.orders.skipStep,
      this.props.order.id,
      step.stepid,
      value,
      noretry
    );
  };

  renderContent () {
    const top: boolean = !this.props.isTablet;

    return [
      <MasonryPanel>
        <Box top key="diagram">
          <StepCodeDiagram
            workflow={this.props.workflow}
            order={this.props.order}
            onSkipSubmit={this.handleSkipSubmit}
          />
        </Box>
      </MasonryPanel>,
      <MasonryPanel>
        <Box top={top} key="info">
          <Info {...this.props.order} />
        </Box>
      </MasonryPanel>,
      <MasonryPanel>
        <Box top={top} key="keys">
          <Keys data={this.props.order.keys} />
        </Box>
      </MasonryPanel>,
      <MasonryPanel>
        <Box top={top} key="hierarchy">
          <PaneItem title="Hierarchy">
            <Hierarchy
              order={this.props.order}
              compact
              isTablet={this.props.isTablet}
            />
          </PaneItem>
        </Box>
      </MasonryPanel>,
      <MasonryPanel>
        <Box top={top} key="errors">
          <PaneItem title="Order Error Instances">
            <Errors
              order={this.props.order}
              tableId="compactOrderErrors"
              compact
            />
          </PaneItem>
        </Box>
      </MasonryPanel>,
    ];
  }

  render () {
    const { workflow, isTablet } = this.props;

    if (!workflow) return <Loader />;

    return (
      <Flex scrollY>
        <MasonryLayout columns={isTablet ? 1 : 2}>
          {this.renderContent()}
        </MasonryLayout>
      </Flex>
    );
  }
}
