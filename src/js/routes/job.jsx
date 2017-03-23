/* @flow */
import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import Job, { JobResults, JobLog, JobMappers, JobCode } from '../views/job';

const JobRoutes = (): React.Element<any> => (
  <Route
    path="job/:id"
    component={Job}
  >
    <IndexRedirect to="results" />
    <Route
      path="results"
      component={JobResults}
    />
    <Route
      path="log"
      component={JobLog}
    />
    <Route
      path="code"
      component={JobCode}
    />
    <Route
      path="mappers"
      component={JobMappers}
    />
  </Route>
);

export default JobRoutes;
