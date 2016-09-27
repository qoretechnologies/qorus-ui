/* @flow */
import React from 'react';
import { Route } from 'react-router';

import Groups from '../views/groups';
import ViewWrapper from '../views/view_wrapper';

const GroupsRoutes = (): React.Element<any> => (
  <Route
    path="groups(/:id)"
    component={ViewWrapper}
    view={Groups}
    name="Groups"
  />
);

export default GroupsRoutes;
