// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';

import Dropdown, { Control, Item } from '../../../../components/dropdown';
import Icon from '../../../../components/icon';
import withModal from '../../../../hocomponents/modal';
import Lock from './modals/lock';
import actions from '../../../../store/api/actions';

type Props = {
  lock?: string,
  username: string,
  handleLockClick: Function,
  openModal: Function,
  closeModal: Function,
  id: number,
  lockFunc: Function,
};

const OrderLock: Function = ({
  lock,
  username,
  handleLockClick,
}: Props): React.Element<any> => (
  <Dropdown>
    <Control
      disabled={lock && lock !== username}
      small
      btnStyle={lock ? 'danger' : 'success'}
    >
      <Icon icon={lock ? 'lock' : 'unlock'} />
      {' '}
      { lock || '' }
    </Control>
    <Item
      icon={lock ? 'unlock' : 'lock'}
      title={lock ? 'Unlock' : 'Lock'}
      action={handleLockClick}
    />
  </Dropdown>
);

export default compose(
  connect(
    (state: Object): Object => ({
      username: state.api.currentUser.data.username,
    }),
    {
      lockFunc: actions.orders.lock,
    }
  ),
  withModal(),
  withHandlers({
    handleLockClick: ({
      openModal,
      closeModal,
      lock,
      id,
      username,
      lockFunc,
    }: Props): Function => (): void => {
      openModal(
        <Lock
          locked={!!lock}
          onClose={closeModal}
          id={id}
          username={username}
          lock={lockFunc}
        />
      );
    },
  }),
  pure(['id', 'lock'])
)(OrderLock);
