/* @flow */
import React from 'react';
import { Route } from 'react-router';

import Workflows from '../views/workflows';
import ViewWrapper from '../views/view_wrapper';

const WorkflowsRoutes = (): React.Element<any> => (
  <Route
    path="workflows(/:date)(/:filter)"
    component={ViewWrapper}
    view={Workflows}
    name="Workflows"
  />
);

export default WorkflowsRoutes;
