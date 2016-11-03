/* @flow */
import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import System from '../views/system';

const DashboardRoutes = (): React.Element<any> => (
  <Route path="/system" component={System}>
    <IndexRedirect to="dashboard" />
    <Route path="dashboard" component={System.Dashboard}>
      <IndexRedirect to="ongoing" />
      <Route path=":type" component={System.Alerts.Table} />
    </Route>
    <Route path="alerts" component={System.Alerts}>
      <IndexRedirect to="ongoing" />
      <Route path=":type" component={System.Alerts.Table}>
        <Route path=":id" component={System.Alerts.Pane} />
      </Route>
    </Route>
    <Route path="options" component={System.Options} />
    <Route path="remote" component={System.Connections}>
      <IndexRedirect to="datasources" />
      <Route path=":type" component={System.Connections.Table}>
        <Route path=":id" component={System.Connections.Pane} />
      </Route>
    </Route>
    <Route path="props" component={System.Properties} />
    <Route path="values" component={System.Valuemaps} />
    <Route path="sqlcache" component={System.SqlCache} />
    <Route path="http" component={System.HttpServices} />
    <Route path="info" component={System.Info} />
    <Route path="logs" component={System.Logs}>
      <IndexRedirect to="system" />
      <Route path=":log" component={System.Logs.Log} />
    </Route>
    <Route path="rbac" component={System.RBAC}>
      <IndexRedirect to="users" />
      <Route path="users" component={System.RBAC.Users} />
      <Route path="roles" component={System.RBAC.Roles} />
      <Route path="permissions" component={System.RBAC.Permissions} />
    </Route>
    <Route path="errors" component={System.Errors} />
  </Route>
);

export default DashboardRoutes;
