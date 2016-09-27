/* @flow */
import React from 'react';
import { Route } from 'react-router';

import Search from '../views/search';
import ViewWrapper from '../views/view_wrapper';

const SearchRoutes = (): React.Element<any> => (
  <Route
    path="search"
    component={ViewWrapper}
    view={Search}
    name="Search"
  />
);

export default SearchRoutes;
