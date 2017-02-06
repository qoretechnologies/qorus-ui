/* @flow */
import React from 'react';
import { Route } from 'react-router';

import Jobs from '../views/jobs';

const JobsRoutes = (): React.Element<any> => (
  <Route
    path="jobs"
    component={Jobs}
  />
);

export default JobsRoutes;
