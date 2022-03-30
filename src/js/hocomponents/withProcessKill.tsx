import React from 'react';
import compose from 'recompose/compose';
import modal from './modal';
import withDispatch from './withDispatch';
import withHandlers from 'recompose/withHandlers';
import actions from '../store/api/actions';
import ConfirmDialog from '../components/confirm_dialog';

export default compose(
  modal(),
  withDispatch(),
  withHandlers({
    handleKillClick: ({ openModal, closeModal, dispatchAction }): Function => (
      id: string
    ): void => {
      const confirmFunc: Function = () => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
        dispatchAction(actions.system.killProcess, id, () => {
          closeModal();
        });
      };

      openModal(
        <ConfirmDialog onClose={closeModal} onConfirm={confirmFunc}>
          Are you sure you want to kill the process <strong>{id}</strong>
        </ConfirmDialog>
      );
    },
  })
);
