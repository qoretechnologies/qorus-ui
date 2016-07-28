/* @flow */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Dropdown, { Control as DropdownControl, CustomItem } from '../../components/dropdown';
import { Control } from '../../components/controls';


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
    <Dropdown>
      <DropdownControl className="btn navbar-btn btn-inverse user-dropdown" noCaret>
        <i className="fa fa-user" />
          {' '}
          {user.name}
        </DropdownControl>
        <CustomItem>
          <Link to="/logout" className="logout">
            <i className="fa fa-sign-out" />
            Logout
          </Link>
        </CustomItem>
      </Dropdown>
  );
};
UserInfo.propTypes = {
  user: PropTypes.object.isRequired,
  noauth: PropTypes.bool,
};

export default connect(
  state => ({
    noauth: state.api.info.data.noauth,
  })
)(UserInfo);
