/* @flow */
import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import System from '../views/system';
import Sla from '../views/system/slas/detail';
import SlaEvents from '../views/system/slas/detail/events';
import SlaSources from '../views/system/slas/detail/methods';
import SlaPerf from '../views/system/slas/detail/perf';

const DashboardRoutes = (): React.Element<any> => (
  <Route path="/system" component={System}>
    <IndexRedirect to="dashboard" />
    <Route path="dashboard" component={System.Dashboard} />
    <Route path="alerts" component={System.Alerts}>
      <IndexRedirect to="ongoing" />
      <Route path=":type" component={System.Alerts.Table}>
        <Route path=":id" component={System.Alerts.Pane} />
      </Route>
    </Route>
    <Route path="options" component={System.Options} />
    <Route path="remote" component={System.Connections} />
    <Route path="props" component={System.Properties} />
    <Route path="slas" component={System.Slas} />
    <Route path="sla/:id" component={Sla}>
      <IndexRedirect to="events" />
      <Route path="events" component={SlaEvents} />
      <Route path="sources" component={SlaSources} />
      <Route path="perf" component={SlaPerf} />
    </Route>
    <Route path="values" component={System.Valuemaps} />
    <Route path="sqlcache" component={System.SqlCache} />
    <Route path="http" component={System.HttpServices} />
    <Route path="info" component={System.Info} />
    <Route path="logs" component={System.Logs} />
    <Route path="rbac" component={System.RBAC} />
    <Route path="errors" component={System.Errors} />
    <Route path="releases" component={System.Releases} />
    <Route path="cluster" component={System.Cluster} />
    <Route path="orderStats" component={System.OrderStats} />
  </Route>
);

export default DashboardRoutes;
