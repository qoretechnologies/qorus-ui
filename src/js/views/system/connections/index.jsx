import React, { PropTypes } from 'react';

import Nav, { NavLink } from '../../../components/navlink';

import ConnectionsTable from './table';
import ConnectionsPane from './pane';

export default function Connections(props, context) {
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

Connections.propTypes = {
  children: PropTypes.node.isRequired,
  route: PropTypes.object,
};

Connections.contextTypes = {
  router: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTitle: PropTypes.func.isRequired,
};

Connections.Table = ConnectionsTable;
Connections.Pane = ConnectionsPane;
