import React, { Component, PropTypes } from 'react';

import Nav, { NavLink } from '../../../components/navlink';

import ConnectionsTable from './table';
import ConnectionsPane from './pane';

export default class Connections extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    route: PropTypes.object,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="tab-pane active">
        <Nav
          path={this.context.location.pathname}
          type="nav-pills"
        >
          <NavLink to="./datasources">Datasources</NavLink>
          <NavLink to="./qorus">Qorus</NavLink>
          <NavLink to="./user">User</NavLink>
        </Nav>
        { this.props.children }
      </div>
    );
  }
}

Connections.Table = ConnectionsTable;
Connections.Pane = ConnectionsPane;
