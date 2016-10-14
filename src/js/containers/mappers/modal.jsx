/* @flow */
import React from 'react';

import Info from './info';
import Modal from '../../components/modal';

type Props = {
  mapper: Object,
  onClose: Function,
};

const MapperModal = ({ mapper, onClose: handleClose }: Props) => (
  <Modal size="lg">
    <Modal.Header
      titleId="modal-header"
      onClose={handleClose}
    >
      {mapper.name}
    </Modal.Header>
    <Modal.Body>
      <Info mapperId={mapper.mapperid} />
    </Modal.Body>
    <Modal.Footer />
  </Modal>
);

export default MapperModal;
