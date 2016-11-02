import React from 'react';

import Nav, { NavLink } from '../../../components/navlink';
import AlertsTable from './table';

type Props = {
  location: Object,
  children: any,
};

const Alerts = ({ location, children }: Props): React.Element<any> => (
  <div className="tab-pane active">
    <Nav
      path={location.pathname}
      type="nav-pills"
    >
      <NavLink to="./ongoing">Ongoing</NavLink>
      <NavLink to="./transient">Transient</NavLink>
    </Nav>
    { children }
  </div>
);

Alerts.Table = AlertsTable;

export default Alerts;
