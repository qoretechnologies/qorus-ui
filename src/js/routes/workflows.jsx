/* @flow */
import React from 'react';
import { Route } from 'react-router';

import Workflows from '../views/workflows';

const workflowsRoutes = (): React.Element<any> => (
  <Route
    path="workflows"
    component={Workflows}
  />
);

export default workflowsRoutes;
