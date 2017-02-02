/* @flow */
import React from 'react';
import { Route } from 'react-router';

import Search from '../views/search';

const SearchRoutes = (): React.Element<any> => (
  <Route
    path="search"
    component={Search}
  />
);

export default SearchRoutes;
