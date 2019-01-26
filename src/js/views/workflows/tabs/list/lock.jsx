// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';

import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../../components/controls';
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
  <ButtonGroup>
    <Button
      disabled={lock && lock !== username}
      big={big}
      btnStyle={lock ? 'info' : undefined}
      iconName={lock ? 'lock' : 'unlock'}
      text={lock || ''}
      onClick={handleLockClick}
    />
  </ButtonGroup>
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
