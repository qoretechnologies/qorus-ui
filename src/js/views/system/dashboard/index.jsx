import React, { Component } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Nav, { NavLink } from '../../../components/navlink';
import Loader from '../../../components/loader';
import { SystemHealth } from './health';
import PerformanceChart from '../../workflow/tabs/performance/chart';
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
  props: {
    children: any,
    route?: Object,
    health: Object,
    dispatch: Function,
    location: Object,
  };

  componentWillMount() {
    this.props.dispatch(actions.health.fetch());
  }

  render() {
    if (!this.props.health) return <Loader />;

    return (
      <div className="tab-pane active">
        <div className="container-fluid" style={{ height: 380 }}>
          <SystemHealth health={this.props.health} className="health-block" />
          <PerformanceChart
            days={1}
            global
          />
        </div>
        <div className="container-fluid">
          <Nav
            path={this.props.location.pathname}
            type="nav-pills"
          >
            <NavLink to="./ongoing">Ongoing</NavLink>
            <NavLink to="./transient">Transient</NavLink>
          </Nav>
          <div>
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }
}
