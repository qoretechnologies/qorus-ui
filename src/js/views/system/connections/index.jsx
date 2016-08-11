/* @flow */
import React, { PropTypes } from 'react';

import Nav, { NavLink } from '../../../components/navlink';

import ConnectionsTable from './table';
import ConnectionsPane from './pane';

type Props = {
  children: any,
  route: Object,
}

export default function Connections(props: Props, context: Object): React.Element<any> {
  return (
    <div className="tab-pane active">
      <Nav
        path={context.location.pathname}
        type="nav-pills"
      >
        <NavLink to="./datasources">Datasources</NavLink>
        <NavLink to="./qorus">Qorus</NavLink>
        <NavLink to="./user">User</NavLink>
      </Nav>
      { props.children }
    </div>
  );
}

Connections.contextTypes = {
  router: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTitle: PropTypes.func.isRequired,
};

Connections.Table = ConnectionsTable;
Connections.Pane = ConnectionsPane;
