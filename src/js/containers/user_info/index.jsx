/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import withHandlers from 'recompose/withHandlers';
import { browserHistory } from 'react-router';
import compose from 'recompose/compose';

import { Control as Button } from '../../components/controls';
import Dropdown, { Control, Item } from '../../components/dropdown';
import Icon from '../../components/icon';

export const UserInfo = ({
  user,
  noauth,
  handleLogoutClick,
}: {
  user: Object,
  noauth: boolean,
  handleLogoutClick: Function,
}) => {
  if (noauth) {
    return (
      <Button
        big
        className="btn navbar-btn btn-inverse user"
        icon="user"
        label={user.name}
      />
    );
  }

  return (
    <Dropdown>
      <Control
        noCaret
        className="btn navbar-btn btn-inverse"
      >
        <Icon icon="user" />
        {' '}
        {user.name}
      </Control>
      <Item
        title="Logout"
        action={handleLogoutClick}
      />
    </Dropdown>
  );
};

export default compose(
  connect(
    state => ({
      noauth: state.api.info.data.noauth,
    })
  ),
  withHandlers({
    handleLogoutClick: () => () => {
      browserHistory.push('/logout');
    },
  })
)(UserInfo);
