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
const settingsSelector = (state: Object): Object => state.ui.settings;

const selector = createSelector(
  [orderSelector, userSelector, workflowSelector, settingsSelector],
  (order, user, workflow, settings) => ({
    order,
    user,
    workflow,
    isTablet: settings.tablet,
  })
);

@connect(selector)
@withTabs('overview')
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
    const { id } = this.props.params;

    this.fetch(id);
  }

  componentWillReceiveProps (nextProps: Object) {
    const { id } = this.props.params;
    const { id: nextId } = nextProps.params;

    if (parseInt(id, 10) !== parseInt(nextId, 10)) {
      this.fetch(nextId);
    }
  }

  componentWillUnmount () {
    const { dispatch } = this.props;

    dispatch(actions.orders.unsync());
    dispatch(actions.workflows.unsync());
  }

  fetch: Function = async (id: number): void => {
    const { dispatch } = this.props;

    dispatch(actions.orders.unsync());
    dispatch(actions.workflows.unsync());

    const order = await dispatch(actions.orders.fetch({}, id));

    dispatch(
      actions.workflows.fetch({ lib_source: true }, order.payload.workflowid)
    );
  };

  render () {
    if (!this.props.workflow) {
      return <Loader />;
    }

    return (
      <Flex>
        <Header
          data={this.props.order}
          workflow={this.props.workflow}
          linkDate={this.props.params.date}
          username={this.props.user.username}
        />
        <SimpleTabs activeTab={this.props.tabQuery}>
          <SimpleTab name="overview">
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
                globalItems={this.props.workflow.global_config}
                intrf="system"
              />
              <WorkflowConfigItemsTable
                globalItems={objectCollectionToArray(
                  this.props.workflow.config
                )}
                intrf="workflows"
                intrfId={this.props.workflow.id}
              />
              <ConfigItemsTable
                items={{
                  ...rebuildConfigHash(this.props.workflow, true),
                }}
                intrf="workflows"
                intrfId={this.props.workflow.id}
              />
            </Box>
          </SimpleTab>
          <SimpleTab name="notes">
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
            <LogView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
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
