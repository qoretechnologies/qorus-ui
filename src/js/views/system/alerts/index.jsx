import React, { PropTypes } from 'react';

import Nav, { NavLink } from '../../../components/navlink';

import AlertsTable from './table';
import AlertsPane from './pane';

export default function Alerts(props, context) {
  return (
    <div className="tab-pane active">
        <Nav
          path={context.location.pathname}
          type="nav-pills"
        >
          <NavLink to="./ongoing">Ongoing</NavLink>
          <NavLink to="./transient">Transient</NavLink>
        </Nav>
        { props.children }
    </div>
  );
}

Alerts.propTypes = {
  children: PropTypes.node.isRequired,
  route: PropTypes.object,
};

Alerts.contextTypes = {
  router: PropTypes.object.isRequired,
  getTitle: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

Alerts.Table = AlertsTable;
Alerts.Pane = AlertsPane;
