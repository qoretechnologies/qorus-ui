/* @flow */
import React, { PropTypes } from 'react';

import Nav, { NavLink } from '../../../components/navlink';
import Users from './users';
import Roles from './roles';
import Permissions from './permissions';

type Props = {
  children: any,
  route: Object,
}

export default function RBAC(props: Props, context: Object): React.Element<any> {
  return (
    <div className="tab-pane active">
      <Nav
        path={context.location.pathname}
        type="nav-pills"
      >
        <NavLink to="./users">Users</NavLink>
        <NavLink to="./roles">Roles</NavLink>
        <NavLink to="./permissions">Permissions</NavLink>
      </Nav>
      { props.children }
    </div>
  );
}

RBAC.contextTypes = {
  router: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTitle: PropTypes.func.isRequired,
};

RBAC.Users = Users;
RBAC.Roles = Roles;
RBAC.Permissions = Permissions;
