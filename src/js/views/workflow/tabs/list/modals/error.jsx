import React, { PropTypes } from 'react';
import Modal from 'components/modal';

export default function ErrorModal(props) {
  return (
    <Modal>
      <Modal.Header
        onClose={ props.onClose }
      >
        Error
      </Modal.Header>
      <Modal.Body>
        <p className="text-danger">
          { props.message }
        </p>
      </Modal.Body>
    </Modal>
  );
}

ErrorModal.propTypes = {
  onClose: PropTypes.func,
  message: PropTypes.string,
};
