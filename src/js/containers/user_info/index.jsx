/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Control } from '../../components/controls';
import Dialog from '../../components/dialog';


export const UserInfo = ({ user, noauth }: { user: Object, noauth: boolean }) => {
  if (noauth) {
    return (
      <Control
        className="btn navbar-btn btn-inverse user"
        icon="user"
        label={user.name}
      />
    );
  }

  return (
    <Dialog
      className="nav-btn-tooltip"
      mainElement={
        <Control
          big
          className="btn navbar-btn btn-inverse user-dropdown"
          icon="user"
          label={user.name}
        />
      }
    >
      <Link to="/logout" className="btn btn-danger logout">
        <i className="fa fa-sign-out" />
        Logout
      </Link>
    </Dialog>
  );
};

export default connect(
  state => ({
    noauth: state.api.info.data.noauth,
  })
)(UserInfo);
