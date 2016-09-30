/* @flow */
import React from 'react';
import { Route } from 'react-router';

import Services from '../views/services';
import ViewWrapper from '../views/view_wrapper';

const ServicesRoutes = (): React.Element<any> => (
  <Route
    path="services(/:detailId)(/:tabId)"
    component={ViewWrapper}
    view={Services}
    name="Services"
  />
);

export default ServicesRoutes;
