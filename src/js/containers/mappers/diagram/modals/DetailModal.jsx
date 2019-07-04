import React from 'react';
import Modal from '../../../../components/modal';
import DiagramDetail from '../detail';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

type Props = {
  detail: Object,
  onClose: Function,
};

const DetailModal: Function = ({ detail, onClose, tab }: Props): any => (
  <Modal width={600}>
    <Modal.Header onClose={onClose} titleId="diagram-modal">
      Detail
    </Modal.Header>
    <Modal.Body>
      <DiagramDetail data={detail} tab={tab} />
    </Modal.Body>
  </Modal>
);

export default onlyUpdateForKeys(['detail'])(DetailModal);
