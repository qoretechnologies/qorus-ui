/* @flow */
import React from 'react';
import { Route } from 'react-router';

import Jobs from '../views/jobs';
import ViewWrapper from '../views/view_wrapper';

const JobsRoutes = (): React.Element<any> => (
  <Route
    path="jobs(/:date)(/:detailId)(/:tabId)"
    component={ViewWrapper}
    view={Jobs}
    name="Jobs"
  />
);

export default JobsRoutes;
