import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import NavLink from '../../../components/navlink';
import { SystemHealth } from './health';
import PerformanceCharts from './perf';


import actions from 'store/api/actions';


const viewSelector = createSelector(
  [
    state => state.api.health,
  ],
  (health) => ({
    health,
  })
);

@connect(viewSelector)
export default class Dashboard extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    route: PropTypes.object,
    health: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.dispatch(actions.health.fetch());
  }

  render() {
    return (
      <div className="tab-pane active">
        <div className="container-fluid">
          <SystemHealth health={this.props.health} className="col-md-4" />
          <PerformanceCharts data={{}} className="col-md-8" />
        </div>
        <div className="container-fluid">
          <ul className="nav nav-pills">
            <NavLink to="/system/dashboard/ongoing">Ongoing</NavLink>
            <NavLink to="/system/dashboard/transient">Transient</NavLink>
          </ul>
          <div className="col-md-12">
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }
}
