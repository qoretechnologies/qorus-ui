import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import actions from 'store/api/actions';

import Header from './header';
import Loader from 'components/loader';
import Nav, { NavLink } from 'components/navlink';

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

const userSelector = state => state.api.currentUser.data;

const selector = createSelector(
  [
    orderSelector,
    userSelector,
    workflowSelector,
  ], (order, user, workflow) => ({
    order,
    user,
    workflow,
  })
);

@connect(selector)
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

    const order = await this.props.dispatch(
      actions.orders.fetch({}, id)
    );

    this.props.dispatch(
      actions.workflows.fetch({ lib_source: true }, order.payload.workflowid)
    );
  }

  componentWillUnmount() {
    this.props.dispatch(
      actions.orders.unsync()
    );

    this.props.dispatch(
      actions.workflows.unsync()
    );
  }

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
        <div className="row">
          <div className="col-xs-12">
            <Nav path={this.props.location.pathname}>
              <NavLink to="./diagram">Diagram</NavLink>
              <NavLink to="./steps">Steps</NavLink>
              <NavLink to="./data">Data</NavLink>
              <NavLink to="./errors">Errors</NavLink>
              <NavLink to="./hierarchy">Hierarchy</NavLink>
              <NavLink to="./audit">Audit</NavLink>
              <NavLink to="./info">Info</NavLink>
              <NavLink to="./notes">Notes</NavLink>
              <NavLink to="./log">Log</NavLink>
              <NavLink to="./code">Code</NavLink>
            </Nav>
          </div>
        </div>
        <div className="row tab-pane">
          <div className="col-xs-12">
            {React.cloneElement(
              this.props.children,
              {
                createElement: (Comp, props) => (
                  <Comp
                    {...{
                      ...props,
                      order: this.props.order,
                      workflow: this.props.workflow,
                      dispatch: this.props.dispatch,
                    }}
                  />
                ),
              }
            )}
          </div>
        </div>
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
