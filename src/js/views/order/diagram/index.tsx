// @flow
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Box from '../../../components/box';
import Flex from '../../../components/Flex';
import Loader from '../../../components/loader';
import { MasonryLayout, MasonryPanel } from '../../../components/MasonryLayout';
import PaneItem from '../../../components/pane_item';
import StepCodeDiagram from '../../../components/StepCodeDiagram';
import withDispatch from '../../../hocomponents/withDispatch';
import actions from '../../../store/api/actions';
import Errors from '../errors';
import Hierarchy from '../hierarchy/';
import Info from './info';
import Keys from './keys';

@withDispatch()
@onlyUpdateForKeys(['order', 'workflow', 'isTablet'])
@injectIntl
export default class DiagramView extends Component {
  props: {
    order: Object;
    workflow: Object;
    isTablet: boolean;
    dispatchAction: Function;
  } = this.props;

  handleSkipSubmit = (step, value, noretry) => {
    this.props.dispatchAction(
      // @ts-ignore ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
      actions.orders.skipStep,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      this.props.order.id,
      step.stepid,
      value,
      noretry
    );
  };

  renderContent() {
    const top: boolean = !this.props.isTablet;

    return [
      <MasonryPanel>
        <Box top key="diagram">
          {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
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
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'keys' does not exist on type 'Object'. */}
          <Keys data={this.props.order.keys} />
        </Box>
      </MasonryPanel>,
      <MasonryPanel>
        <Box top={top} key="hierarchy">
          <PaneItem
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ order: O... Remove this comment to see the full error message
            title={this.props.intl.formatMessage({ id: 'order.hierarchy' })}
          >
            <Hierarchy order={this.props.order} compact isTablet={this.props.isTablet} />
          </PaneItem>
        </Box>
      </MasonryPanel>,
      <MasonryPanel>
        <Box top={top} key="errors">
          <PaneItem
            // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ order: O... Remove this comment to see the full error message
            title={this.props.intl.formatMessage({ id: 'order.order-err-instances' })}
          >
            <Errors order={this.props.order} tableId="compactOrderErrors" compact />
          </PaneItem>
        </Box>
      </MasonryPanel>,
    ];
  }

  render() {
    const { workflow, isTablet } = this.props;

    if (!workflow) return <Loader />;

    return (
      <Flex scrollY>
        <MasonryLayout columns={isTablet ? 1 : 2}>{this.renderContent()}</MasonryLayout>
      </Flex>
    );
  }
}
