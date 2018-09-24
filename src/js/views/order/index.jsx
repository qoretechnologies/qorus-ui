import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import actions from 'store/api/actions';

import Header from './header';
import Loader from 'components/loader';
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
import Tabs, { Pane } from '../../components/tabs';
import titleManager from '../../hocomponents/TitleManager';

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
@withTabs('diagram')
@titleManager(({ order }): string => (order ? order.name : 'Order view'))
export default class Order extends Component {
  static propTypes = {
    order: PropTypes.object,
    workflow: PropTypes.object,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    route: PropTypes.object,
    location: PropTypes.object,
    children: PropTypes.node,
    user: PropTypes.object,
    isTablet: PropTypes.bool,
    tabQuery: PropTypes.string,
    handleTabChange: PropTypes.func,
  };

  static childContextTypes = {
    dispatch: PropTypes.func,
  };

  getChildContext() {
    return {
      dispatch: this.props.dispatch,
    };
  }

  async componentWillMount() {
    const { id } = this.props.params;

    this.fetch(id);
  }

  componentWillReceiveProps(nextProps: Object) {
    const { id } = this.props.params;
    const { id: nextId } = nextProps.params;

    if (parseInt(id, 10) !== parseInt(nextId, 10)) {
      this.fetch(nextId);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(actions.orders.unsync());

    this.props.dispatch(actions.workflows.unsync());
  }

  fetch: Function = async (id: number): void => {
    this.props.dispatch(actions.orders.unsync());

    this.props.dispatch(actions.workflows.unsync());

    const order = await this.props.dispatch(actions.orders.fetch({}, id));

    this.props.dispatch(
      actions.workflows.fetch({ lib_source: true }, order.payload.workflowid)
    );
  };

  render() {
    if (!this.props.workflow) {
      return <Loader />;
    }

    return (
      <div>
        <Header
          data={this.props.order}
          workflow={this.props.workflow}
          linkDate={this.props.params.date}
          username={this.props.user.username}
        />
        <Tabs
          active={this.props.tabQuery}
          id="orderData"
          onChange={this.props.handleTabChange}
          noContainer
          boxed
        >
          <Pane name="Diagram">
            <DiagramView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
              }}
            />
          </Pane>
          <Pane name="Steps">
            <StepsView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
              }}
            />
          </Pane>
          <Pane name="Data">
            <DataView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
              }}
            />
          </Pane>
          <Pane name="Errors">
            <ErrorsView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
              }}
            />
          </Pane>
          <Pane name="Hierarchy">
            <HierarchyView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
              }}
            />
          </Pane>
          <Pane name="Audit">
            <AuditView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
              }}
            />
          </Pane>
          <Pane name="Info">
            <InfoView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
              }}
            />
          </Pane>
          <Pane name="Notes">
            <NotesView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
                params: this.props.params,
              }}
            />
          </Pane>
          <Pane name="Log">
            <LogView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
              }}
            />
          </Pane>
          <Pane name="Code">
            <CodeView
              {...{
                order: this.props.order,
                workflow: this.props.workflow,
                dispatch: this.props.dispatch,
                isTablet: this.props.isTablet,
              }}
            />
          </Pane>
        </Tabs>
      </div>
    );
  }
}

Order.Steps = StepsView;
Order.Data = DataView;
Order.Info = InfoView;
Order.Log = LogView;
Order.Notes = NotesView;
Order.Errors = ErrorsView;
Order.Hierarchy = HierarchyView;
Order.Audit = AuditView;
Order.Code = CodeView;
Order.Diagram = DiagramView;
