import React from 'react';

import Nav, { NavLink } from '../../components/navlink';
import Alerts from './alerts';
import Dashboard from './dashboard';
import Options from './options';
import Connections from './connections';
import Errors from './errors';
import UserHttp from './http';
import Logs from './logs';
import SystemInfoTable from './info';
import SqlCache from './sqlcache';
import Properties from './properties';
import Rbac from './rbac';
import Valuemaps from './valuemaps';

type Props = {
  location: Object,
  children: any,
};

const System: Function = ({ location, children }: Props): React.Element<any> => (
  <div>
    <Nav path={location.pathname}>
      <NavLink to="./dashboard">Dashboard</NavLink>
      <NavLink to="./alerts">Alerts</NavLink>
      <NavLink to="./options">Options</NavLink>
      <NavLink to="./remote">Connections</NavLink>
      <NavLink to="./props">Properties</NavLink>
      <NavLink to="./values">Valuemaps</NavLink>
      <NavLink to="./sqlcache">SQL cache</NavLink>
      <NavLink to="./http">Http Services</NavLink>
      <NavLink to="./info">Info</NavLink>
      <NavLink to="./logs">Logs</NavLink>
      <NavLink to="./rbac">RBAC</NavLink>
      <NavLink to="./errors">Errors</NavLink>
    </Nav>
    <div className="tab-content">
      {React.Children.map(children, (child: React.Element<any>) => (
        React.cloneElement(child, { location })
      ))}
    </div>
  </div>
);

System.Dashboard = Dashboard;
System.Alerts = Alerts;
System.Options = Options;
System.Connections = Connections;
System.Properties = Properties;
System.SqlCache = SqlCache;
System.HttpServices = UserHttp;
System.RBAC = Rbac;
System.Info = SystemInfoTable;
System.Logs = Logs;
System.Errors = Errors;
System.Valuemaps = Valuemaps;

export default System;
