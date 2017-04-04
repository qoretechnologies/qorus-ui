/* @flow */
import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import Search from '../views/search';

const SearchRoutes = (): React.Element<any> => (
  <Route
    path="search"
    component={Search}
  >
    <IndexRedirect to="orders" />
    <Route path="orders" component={Search.Orders} />
    <Route path="errors" component={Search.Errors} />
  </Route>
);

export default SearchRoutes;
