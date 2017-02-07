/* @flow */
import React from 'react';
import { Route } from 'react-router';

import Groups from '../views/groups';

const GroupsRoutes = (): React.Element<any> => (
  <Route
    path="groups"
    component={Groups}
  />
);

export default GroupsRoutes;
