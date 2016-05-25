import React, { Component, PropTypes } from 'react';

import NavLink from '../../../components/navlink';

import AlertsTable from './table' ;

export default class Alerts extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    route: PropTypes.object,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="tab-pane active">
          <ul className="nav nav-pills">
            <NavLink to="/system/alerts/ongoing">Ongoing</NavLink>
            <NavLink to="/system/alerts/transient">Transient</NavLink>
          </ul>
          { this.props.children }
      </div>
    );
  }
}

Alerts.Ongoing = AlertsTable;
Alerts.Transient = AlertsTable;
