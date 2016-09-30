import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Nav, { NavLink } from '../../../components/navlink';
import { SystemHealth } from './health';
import PerformanceChart from '../../workflow/tabs/performance/chart';
import ButtonsBar from '../../../containers/bubbles/buttons';
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
  static contextTypes = {
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired,
  };

  props: {
    children: any,
    route?: Object,
    health: Object,
    dispatch: Function,
  };

  componentWillMount() {
    this.props.dispatch(actions.health.fetch());
  }

  render() {
    return (
      <div className="tab-pane active">
        <div className="container-fluid">
          <SystemHealth health={this.props.health} className="health-block" />
          <PerformanceChart
            days={1}
            global
          />
        </div>
        <div className="container-fluid">
          <Nav
            path={this.context.location.pathname}
            type="nav-pills"
          >
            <NavLink to="./ongoing">Ongoing</NavLink>
            <NavLink to="./transient">Transient</NavLink>
          </Nav>
          <div>
            { this.props.children }
          </div>
          {global.env.NODE_ENV !== 'production' ? (
            <div>
              Notifications:
              <ButtonsBar />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
