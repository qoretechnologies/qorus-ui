/* @flow */
import React from 'react';
import { Route } from 'react-router';

import Workflow from '../views/workflow';
import ViewWrapper from '../views/view_wrapper';

const WorkflowRoutes = (): React.Element<any> => (
  <Route
    path="workflow(/:id)(/:tabId)(/:filter)(/:date)"
    component={ViewWrapper}
    view={Workflow}
    name="Workflow"
  />
);

export default WorkflowRoutes;
