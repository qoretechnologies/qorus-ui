/* @flow */
import React from 'react';
import { Route } from 'react-router';

import Services from '../views/services';

const ServicesRoutes = (): React.Element<any> => (
  <Route
    path="services"
    component={Services}
  />
);

export default ServicesRoutes;
