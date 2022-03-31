// @flow
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import actions from '../../store/api/actions';

import Header from './header';
import Loader from '../../components/loader';
import withTabs from '../../hocomponents/withTabs';

import StepsView from './steps';
import DataView from './data';
import InfoView from './info';
import LogView from './log';
import NotesView from './notes';
import ErrorsView from './errors';
import HierarchyView from './hierarchy';
import AuditView from './audit';
import CodeView from './code';
import DiagramView from './diagram';
import { SimpleTabs, SimpleTab } from '../../components/SimpleTabs';
import titleManager from '../../hocomponents/TitleManager';
import Flex from '../../components/Flex';
import Box from '../../components/box';
import ConfigItemsTable from '../../components/ConfigItemsTable';
import {
  rebuildConfigHash,
  objectCollectionToArray,
} from '../../helpers/interfaces';
import GlobalConfigItemsTable from '../../components/GlobalConfigItemsTable';
import WorkflowConfigItemsTable from '../../components/WorkflowConfigItemsTable';
import MappersTable from '../../containers/mappers';

const orderSelector = (state, props) =>
  state.api.orders.data.find(
    w => parseInt(props.params.id, 10) === parseInt(w.workflow_instanceid, 10)
  );

const workflowSelector = (state, props) => {
  const workflow =
    state.api.orders.data.find(
      w => parseInt(props.params.id, 10) === parseInt(w.workflow_instanceid, 10)
    ) || null;

  return workflow
    ? state.api.workflows.data.find(
      w => parseInt(workflow.workflowid, 10) === parseInt(w.id, 10)
    )
    : null;
};

const userSelector = state => state.api.currentUser.data;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'ui' does not exist on type 'Object'.
const settingsSelector = (state: Object): Object => state.ui.settings;

const selector = createSelector(
  [orderSelector, userSelector, workflowSelector, settingsSelector],
  (order, user, workflow, settings) => ({
    order,
    user,
    workflow,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'tablet' does not exist on type 'Object'.
    isTablet: settings.tablet,
  })
);

@connect(selector)
// @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
@withTabs('overview')
// @ts-expect-error ts-migrate(2339) FIXME: Property 'order' does not exist on type 'Object'.
@titleManager(({ order }): string => (order ? order.name : 'Order view'))
export default class Order extends Component {
  props: {
    order: Object,
    workflow: Object,
    dispatch: Function,
    params: Object,
    route: Object,
    location: Object,
    children: any,
    user: Object,
    isTablet: boolean,
    tabQuery: string,
    handleTabChange: Function,
  } = this.props;

  static childContextTypes = {
    dispatch: PropTypes.func,
  };

  getChildContext () {
    return {
      dispatch: this.props.dispatch,
    };
  }

  componentWillMount () {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
    const { id } = this.props.params;

    this.fetch(id);
  }

  componentWillReceiveProps (nextProps: Object) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
    const { id } = this.props.params;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'params' does not exist on type 'Object'.
    const { id: nextId } = nextProps.params;

    if (parseInt(id, 10) !== parseInt(nextId, 10)) {
      this.fetch(nextId);
    }
  }

  componentWillUnmount () {
    const { dispatch } = this.props;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
    dispatch(actions.orders.unsync());
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
    dispatch(actions.workflows.unsync());
  }

  // @ts-expect-error ts-migrate(1055) FIXME: Type 'void' is not a valid async function return t... Remove this comment to see the full error message
  fetch: Function = async (id: number): void => {
    const { dispatch } = this.props;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
    dispatch(actions.orders.unsync());
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
    dispatch(actions.workflows.unsync());

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
    const order = await dispatch(actions.orders.fetch({}, id));

    dispatch(
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      actions.workflows.fetch({ lib_source: true }, order.payload.workflowid)
    );
  };

  render () {
    if (!this.props.workflow) {
      return <Loader />;
    }

    return (
      <Flex>
        { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
        <Header
          data={this.props.order}
          workflow={this.props.workflow}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'date' does not exist on type 'Object'.
          linkDate={this.props.params.date}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'username' does not exist on type 'Object... Remove this comment to see the full error message
          username={this.props.user.username}
        />
        <SimpleTabs activeTab={this.props.tabQuery}>
          <SimpleTab name="overview">
            { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
            <DiagramView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
              }}
            />
          </SimpleTab>
          <SimpleTab name="steps">
            <StepsView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
              }}
            />
          </SimpleTab>
          <SimpleTab name="data">
            <DataView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
              }}
            />
          </SimpleTab>
          <SimpleTab name="errors">
            <Box top noPadding>
              <ErrorsView
                {...{
                  order: this.props.order,
                  workflow: this.props.workflow,
                  dispatch: this.props.dispatch,
                  isTablet: this.props.isTablet,
                }}
              />
            </Box>
          </SimpleTab>
          <SimpleTab name="hierarchy">
            <Box top noPadding>
              <HierarchyView
                {...{
                  order: this.props.order,
                  workflow: this.props.workflow,
                  dispatch: this.props.dispatch,
                  isTablet: this.props.isTablet,
                }}
              />
            </Box>
          </SimpleTab>
          <SimpleTab name="audit">
            <AuditView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
              }}
            />
          </SimpleTab>
          <SimpleTab name="config">
            <Box top fill scrollY>
              <GlobalConfigItemsTable
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'global_config' does not exist on type 'O... Remove this comment to see the full error message
                globalItems={this.props.workflow.global_config}
                intrf="system"
              />
              <WorkflowConfigItemsTable
                globalItems={objectCollectionToArray(
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'config' does not exist on type 'Object'.
                  this.props.workflow.config
                )}
                intrf="workflows"
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                intrfId={this.props.workflow.id}
              />
              <ConfigItemsTable
                items={{
                  ...rebuildConfigHash(this.props.workflow, true),
                }}
                intrf="workflows"
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                intrfId={this.props.workflow.id}
              />
            </Box>
          </SimpleTab>
          <SimpleTab name="mappers">
            <Box top fill noPadding>
              { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'mappers' does not exist on type 'Object'... Remove this comment to see the full error message */ }
              <MappersTable mappers={this.props.workflow.mappers} />
            </Box>
          </SimpleTab>
          <SimpleTab name="notes">
            { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
            <NotesView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
                params: this.props.params,
              }}
            />
          </SimpleTab>
          <SimpleTab name="log">
            { /* @ts-expect-error ts-migrate(2741) FIXME: Property 'location' is missing in type '{ order: O... Remove this comment to see the full error message */ }
            <LogView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
                intfc: 'workflows',
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                resource: `workflows/${this.props.workflow.id}`,
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                id: this.props.workflow.id,
              }}
            />
          </SimpleTab>
          <SimpleTab name="code">
            <CodeView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
                location: this.props.location,
              }}
            />
          </SimpleTab>
          <SimpleTab name="info">
            <InfoView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
              }}
            />
          </SimpleTab>
        </SimpleTabs>
      </Flex>
    );
  }
}
