import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import Dashboard from './dashboard';

function NavLink(props) {
  return (
    <Link {...props} activeClassName="active" />
  );
}

function NotImplemented() {
  return (<div className="tab-pane active"><p>Not implemented yet</p></div>);
}

export default class System extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    return (
      <div>
        <ul className="nav nav-tabs">
          <li><NavLink to="/system/dashboard">Dashboard</NavLink></li>
          <li><NavLink to="/system/alerts">Alerts</NavLink></li>
          <li><NavLink to="/system/options">Options</NavLink></li>
          <li><NavLink to="/system/remote">Connections</NavLink></li>
          <li><NavLink to="/system/props">Properties</NavLink></li>
          <li><NavLink to="/system/valuemaps">Valuemaps</NavLink></li>
          <li><NavLink to="/system/sqlcache">SQL cache</NavLink></li>
          <li><NavLink to="/system/http">Http Services</NavLink></li>
          <li><NavLink to="/system/info">Info</NavLink></li>
          <li><NavLink to="/system/logs">Logs</NavLink></li>
          <li><NavLink to="/system/rbac">RBAC</NavLink></li>
          <li><NavLink to="/system/errors">Errors</NavLink></li>
        </ul>
        <div className="tab-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

System.Dashboard = Dashboard;
System.Alerts = NotImplemented;
System.Options = NotImplemented;
System.Connections = NotImplemented;
System.Properties = NotImplemented;
System.ValueMaps = NotImplemented;
System.SqlCache = NotImplemented;
System.HttpServices = NotImplemented;
System.RBAC = NotImplemented;
System.Info = NotImplemented;
System.Logs = NotImplemented;
System.Errors = NotImplemented;
