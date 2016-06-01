import React, { Component, PropTypes } from 'react';

import Nav, { NavLink } from '../../components/navlink';

import Alerts from './alerts';
import Dashboard from './dashboard';
import Options from './options';

function NotImplemented() {
  return (<div className="tab-pane active"><p>Not implemented yet</p></div>);
}

NotImplemented.Qorus = NotImplemented;
NotImplemented.Datasources = NotImplemented;
NotImplemented.User = NotImplemented;

export default class System extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    location: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    location: PropTypes.object,
  };

  getChildContext() {
    return {
      location: this.props.location,
    }
  }

  render() {
    return (
      <div>
        <Nav path={this.props.location.pathname}>
          <NavLink to="./dashboard">Dashboard</NavLink>
          <NavLink to="./alerts">Alerts</NavLink>
          <NavLink to="./options">Options</NavLink>
          <NavLink to="./remote">Connections</NavLink>
          <NavLink to="./props">Properties</NavLink>
          <NavLink to="./valuemaps">Valuemaps</NavLink>
          <NavLink to="./sqlcache">SQL cache</NavLink>
          <NavLink to="./http">Http Services</NavLink>
          <NavLink to="./info">Info</NavLink>
          <NavLink to="./logs">Logs</NavLink>
          <NavLink to="./rbac">RBAC</NavLink>
          <NavLink to="./errors">Errors</NavLink>
        </Nav>
        <div className="tab-content">
            {this.props.children}
        </div>
      </div>
    );
  }
}

System.Dashboard = Dashboard;
System.Alerts = Alerts;
System.Options = Options;
System.Remote = NotImplemented;
System.Properties = NotImplemented;
System.ValueMaps = NotImplemented;
System.SqlCache = NotImplemented;
System.HttpServices = NotImplemented;
System.RBAC = NotImplemented;
System.Info = NotImplemented;
System.Logs = NotImplemented;
System.Errors = NotImplemented;
