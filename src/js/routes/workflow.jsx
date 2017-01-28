/* @flow */
import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import Workflow from '../views/workflow';
import List from '../views/workflow/tabs/list';
import Performance from '../views/workflow/tabs/performance';
import Log from '../views/workflow/tabs/log';
import Code from '../views/workflow/tabs/code';
import Info from '../views/workflow/tabs/info';
import Mappers from '../views/workflow/tabs/mappers';

const workflowRoutes = (): React.Element<any> => (
  <Route
    path="workflow/:id"
    component={Workflow}
  >
    <IndexRedirect to="list" />
    <Route path="list" component={List} />
    <Route path="performance" component={Performance} />
    <Route path="log" component={Log} />
    <Route path="code" component={Code} />
    <Route path="info" component={Info} />
    <Route path="mappers" component={Mappers} />
  </Route>
);

export default workflowRoutes;
