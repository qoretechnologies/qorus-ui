import React, { PropTypes } from 'react';

import Nav, { NavLink } from '../../../components/navlink';

import LogView from './log';

export default function Logs(props, context) {
  return (
    <div className="tab-pane active">
        <Nav
          path={context.location.pathname}
          type="nav-pills"
        >
          <NavLink to="./system">System</NavLink>
          <NavLink to="./http">Http</NavLink>
          <NavLink to="./audit">Audit</NavLink>
          <NavLink to="./alert">Alert</NavLink>
          <NavLink to="./mon">Monitor</NavLink>
        </Nav>
        { props.children }
    </div>
  );
}

Logs.propTypes = {
  children: PropTypes.node.isRequired,
  route: PropTypes.object,
};

Logs.contextTypes = {
  router: PropTypes.object.isRequired,
  getTitle: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

Logs.Log = LogView;
