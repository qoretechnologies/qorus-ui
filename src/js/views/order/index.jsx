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

const orderSelector = (state, props) => (
  state.api.orders.data.find(w => (
    parseInt(props.params.id, 10) === parseInt(w.workflow_instanceid, 10)
  ))
);

const selector = createSelector(
  [
    orderSelector,
  ], (order) => ({
    order,
  })
);

@connect(selector)
export default class Order extends Component {
  static propTypes = {
    order: PropTypes.object,
    dispatch: PropTypes.func,
    params: PropTypes.object,
    route: PropTypes.object,
    location: PropTypes.object,
    children: PropTypes.node,
  };

  componentDidMount() {
    const { id } = this.props.params;

    this.props.dispatch(
      actions.orders.fetch({}, id)
    );
  }

  render() {
    if (!this.props.order) {
      return <Loader />;
    }

    return (
      <div>
        <Header
          data={this.props.order}
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
            </Nav>
          </div>
        </div>
        <div className="row tab-pane">
          <div className="col-xs-12">
            { this.props.children }
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
