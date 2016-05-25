import React, { Component, PropTypes } from 'react';

import NavLink from '../../components/navlink';

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
  }

  render() {
    return (
      <div>
        <ul className="nav nav-tabs">
          <NavLink to="/system/dashboard">Dashboard</NavLink>
          <NavLink to="/system/alerts">Alerts</NavLink>
          <NavLink to="/system/options">Options</NavLink>
          <NavLink to="/system/remote">Connections</NavLink>
          <NavLink to="/system/props">Properties</NavLink>
          <NavLink to="/system/valuemaps">Valuemaps</NavLink>
          <NavLink to="/system/sqlcache">SQL cache</NavLink>
          <NavLink to="/system/http">Http Services</NavLink>
          <NavLink to="/system/info">Info</NavLink>
          <NavLink to="/system/logs">Logs</NavLink>
          <NavLink to="/system/rbac">RBAC</NavLink>
          <NavLink to="/system/errors">Errors</NavLink>
        </ul>
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
