import React, { Component, PropTypes } from 'react';

import Nav, { NavLink } from '../../../components/navlink';

import AlertsTable from './table';
import AlertsPane from './pane';

export default class Alerts extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    route: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="tab-pane active">
          <Nav
            path={this.context.location.pathname}
            type="nav-pills"
          >
            <NavLink to="./ongoing">Ongoing</NavLink>
            <NavLink to="./transient">Transient</NavLink>
          </Nav>
          { this.props.children }
      </div>
    );
  }
}

Alerts.Table = AlertsTable;
Alerts.Pane = AlertsPane;
