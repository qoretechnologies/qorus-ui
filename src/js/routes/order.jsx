/* @flow */
import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import Order from '../views/order';
import Data from '../views/order/data';
import {
  StaticView,
  DynamicView,
  KeysView,
} from '../views/order/data';

const OrderRoutes = (): React.Element<any> => (
  <Route
    path="order/:id/:date"
    component={Order}
  >
    <IndexRedirect to="diagram" />
    <Route path="diagram" component={Order.Diagram} />
    <Route path="steps" component={Order.Steps} />
    <Route path="data" component={Data}>
      <IndexRedirect to="static" />
      <Route path="static" component={StaticView} />
      <Route path="dynamic" component={DynamicView} />
      <Route path="keys" component={KeysView} />
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
