// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { Control as Button, Controls as ButtonGroup } from '../../../../components/controls';
import withModal from '../../../../hocomponents/modal';
import withDispatch from '../../../../hocomponents/withDispatch';
import Lock from './modals/lock';

type Props = {
  lock?: string;
  username: string;
  handleLockClick: Function;
  openModal: Function;
  closeModal: Function;
  id: number;
  dispatchAction: Function;
  big?: boolean;
};

const OrderLock: Function = ({
  lock,
  username,
  handleLockClick,
  big,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <ButtonGroup>
    <Button
      disabled={lock && lock !== username}
      big={big}
      btnStyle={lock ? 'info' : undefined}
      icon={lock ? 'lock' : 'unlock'}
      text={lock || ''}
      onClick={handleLockClick}
    />
  </ButtonGroup>
);

export default compose(
  connect((state: any): any => ({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    username: state.api.currentUser.data.username,
  })),
  withDispatch(),
  withModal(),
  withHandlers({
    handleLockClick:
      ({ openModal, closeModal, lock, id, username, dispatchAction }: Props): Function =>
      (): void => {
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
