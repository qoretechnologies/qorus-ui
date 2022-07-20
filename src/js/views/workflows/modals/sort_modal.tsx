import React from 'react';
import withHandlers from 'recompose/withHandlers';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control, Controls } from '../../../components/controls';
import Modal from '../../../components/modal';
import { ORDER_STATES } from '../../../constants/orders';

type Props = {
  closeModal: Function;
  sortData: any;
  onSortChange: Function;
  handleSortClick: Function;
};

const SortModal: Function = ({ closeModal, sortData, handleSortClick }: Props): any => (
  <Modal>
    <Modal.Header titleId="sortModal" onClose={closeModal}>
      Sort workflow instances
    </Modal.Header>
    <Modal.Body>
      <Controls className="bp3-vertical">
        {ORDER_STATES.map((state: any): any => (
          <Control
            // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
            onClick={() => handleSortClick(state.name)}
            // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
            label={state.name}
            // @ts-ignore ts-migrate(2339) FIXME: Property 'sortBy' does not exist on type 'Object'.
            btnStyle={sortData.sortBy === state.name ? 'success' : 'default'}
            big
          />
        ))}
      </Controls>
    </Modal.Body>
  </Modal>
);

export default withHandlers({
  handleSortClick:
    ({ onSortChange, closeModal }: Props): Function =>
    (name: string): void => {
      onSortChange({ sortBy: name });
      closeModal();
    },
})(SortModal);
