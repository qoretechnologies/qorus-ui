// components
import React from 'react';
import Modal from 'components/modal';
import SourceCode from 'components/source_code';
import pure from 'recompose/pure';

type Props = {
  onClose: Function,
  method: Object,
};

const ServiceMethodModal: Function = ({
  onClose,
  method,
}: Props): React.Element<Modal> => (
  <Modal>
    <Modal.Header titleId="methodsTableModalLabel" onClose={onClose}>
      Source code for {method.name}
    </Modal.Header>
    <Modal.Body>
      <SourceCode>{method.body}</SourceCode>
    </Modal.Body>
  </Modal>
);

export default pure(ServiceMethodModal);
