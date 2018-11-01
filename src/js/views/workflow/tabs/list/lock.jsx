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
import withDispatch from '../../../../hocomponents/withDispatch';

type Props = {
  lock?: string,
  username: string,
  handleLockClick: Function,
  openModal: Function,
  closeModal: Function,
  id: number,
  dispatchAction: Function,
  big?: boolean,
};

const OrderLock: Function = ({
  lock,
  username,
  handleLockClick,
  big,
}: Props): React.Element<any> => (
  <Dropdown>
    <Control
      disabled={lock && lock !== username}
      small={!big}
      btnStyle={lock ? 'danger' : 'success'}
    >
      <Icon iconName={lock ? 'lock' : 'unlock'} /> {lock || ''}
    </Control>
    <Item
      iconName={lock ? 'unlock' : 'lock'}
      title={lock ? 'Unlock' : 'Lock'}
      action={handleLockClick}
    />
  </Dropdown>
);

export default compose(
  connect(
    (state: Object): Object => ({
      username: state.api.currentUser.data.username,
    })
  ),
  withDispatch(),
  withModal(),
  withHandlers({
    handleLockClick: ({
      openModal,
      closeModal,
      lock,
      id,
      username,
      dispatchAction,
    }: Props): Function => (): void => {
      openModal(
        <Lock
          locked={!!lock}
          onClose={closeModal}
          id={id}
          username={username}
          lock={dispatchAction}
        />
      );
    },
  }),
  pure(['id', 'lock'])
)(OrderLock);
