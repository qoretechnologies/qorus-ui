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
      { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */ }
      {mapper.name}
    </Modal.Header>
    <Modal.Body>
      { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'mapperid' does not exist on type 'Object... Remove this comment to see the full error message */ }
      <Info mapperId={mapper.mapperid} />
    </Modal.Body>
    <Modal.Footer />
  </Modal>
);

export default MapperModal;
