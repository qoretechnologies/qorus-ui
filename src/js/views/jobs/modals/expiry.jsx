import React from 'react';

import Modal from 'components/modal';

export default function ModalExpiry(props) {
  return (
      <Modal>
        <Modal.Header
          onClose={ props.onClose }
          titleId="jobExpiration"
        >
          Set expiration for job { props.job.name }
        </Modal.Header>
        <Modal.Body>
          Test
        </Modal.Body>
      </Modal>
  );
}

ModalExpiry.propTypes = {
  job: React.PropTypes.object.isRequired,
  onClose: React.PropTypes.func.isRequired,
};
