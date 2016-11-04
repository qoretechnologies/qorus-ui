/* @flow */
import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import Order from '../views/order';

const OrderRoutes = (): React.Element<any> => (
  <Route
    path="order/:id/:date"
    component={Order}
  >
    <IndexRedirect to="diagram" />
    <Route path="diagram" component={Order.Diagram} />
    <Route path="steps" component={Order.Steps} />
    <Route path="data" component={Order.Data}>
      <IndexRedirect to="static" />
      <Route path="static" component={Order.Data.Static} />
      <Route path="dynamic" component={Order.Data.Dynamic} />
      <Route path="keys" component={Order.Data.Keys} />
    </Route>
    <Route path="errors" component={Order.Errors} />
    <Route path="hierarchy" component={Order.Hierarchy} />
    <Route path="audit" component={Order.Audit} />
    <Route path="info" component={Order.Info} />
    <Route path="notes" component={Order.Notes} />
    <Route path="log" component={Order.Log} />
    <Route path="code" component={Order.Code} />
  </Route>
);

export default OrderRoutes;
