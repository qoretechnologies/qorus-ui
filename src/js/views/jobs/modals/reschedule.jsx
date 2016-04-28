import React from 'react';

import Modal from 'components/modal';

export default function ModalReschedule(props) {
  return (
    <Modal>
      <Modal.Header
        onClose={props.onClose}
        titleId="jobReschedule"
      >
        Reschedule job { props.job.name }
      </Modal.Header>
      <Modal.Body>
        Test
      </Modal.Body>
    </Modal>
  );
}

ModalReschedule.propTypes = {
  job: React.PropTypes.object.isRequired,
  onClose: React.PropTypes.func.isRequired,
};
