/* @flow */
import React from 'react';
import { Route } from 'react-router';

import Workflows from '../views/old_workflows';
import ViewWrapper from '../views/view_wrapper';

const oldWorkflowsRoutes = (): React.Element<any> => (
  <Route
    path="old_workflows(/:date)(/:filter)"
    component={ViewWrapper}
    view={Workflows}
    name="Workflows"
  />
);

export default oldWorkflowsRoutes;
