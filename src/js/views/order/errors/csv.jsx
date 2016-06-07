import React, { PropTypes } from 'react';
import Modal from 'components/modal';

export default function CSVModal(props) {
  return (
    <Modal
      onMount={props.onMount}
    >
      <Modal.Header
        onClose={props.onClose}
        titleId="csv-modal"
      >
        Copy table
        <small> (Press ⌘ + c)</small>
      </Modal.Header>
      <Modal.Body>
          <textarea
            rows="12"
            readOnly
            id="csv-text"
            className="form-control"
            value={props.data}
          />
      </Modal.Body>
    </Modal>
  );
}

CSVModal.propTypes = {
  onClose: PropTypes.func,
  onMount: PropTypes.func,
  data: PropTypes.string,
};
