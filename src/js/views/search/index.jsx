// @flow
import React from 'react';

import Nav, { NavLink } from '../../components/navlink';
import Orders from './orders';
import Errors from './errors';

type Props = {
  location: Object,
  children: any,
};

const Search: Function = ({ location, children }: Props): React.Element<any> => (
  <div>
    <Nav path={location.pathname}>
      <NavLink to="./orders">Orders</NavLink>
      <NavLink to="./errors">Errors</NavLink>
    </Nav>
    <div className="tab-content">
      {React.Children.map(children, (child: React.Element<any>) => (
        React.cloneElement(child, { location })
      ))}
    </div>
  </div>
);

Search.Orders = Orders;
Search.Errors = Errors;

export default Search;
