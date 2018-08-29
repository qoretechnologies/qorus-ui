import React from 'react';
import withHandlers from 'recompose/withHandlers';

import Modal from '../../../components/modal';
import { Controls, Control } from '../../../components/controls';
import { ORDER_STATES } from '../../../constants/orders';

type Props = {
  closeModal: Function,
  sortData: Object,
  onSortChange: Function,
  handleSortClick: Function,
};

const SortModal: Function = ({
  closeModal,
  sortData,
  handleSortClick,
}: Props): any => (
  <Modal>
    <Modal.Header titleId="sortModal" onClose={closeModal}>
      Sort workflow instances
    </Modal.Header>
    <Modal.Body>
      <Controls className="pt-vertical">
        {ORDER_STATES.map(
          (state: Object): any => (
            <Control
              onClick={() => handleSortClick(state.name)}
              label={state.name}
              btnStyle={sortData.sortBy === state.name ? 'success' : 'default'}
              big
            />
          )
        )}
      </Controls>
    </Modal.Body>
  </Modal>
);

export default withHandlers({
  handleSortClick: ({ onSortChange, closeModal }: Props): Function => (
    name: string
  ): void => {
    onSortChange({ sortBy: name });
    closeModal();
  },
})(SortModal);
