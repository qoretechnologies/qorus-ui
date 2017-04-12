/* @flow */
import React from 'react';

import Modal from '../../../../components/modal';
import { Controls, Control as Button } from '../../../../components/controls';
import Options from '../options';

const OptionsModal: Function = ({
  data,
  onSave,
  onClose,
}: {
  data: Object,
  onSave: Function,
  onClose: Function,
}): React.Element<any> => (
  <Modal hasFooter>
    <Modal.Header
      titleId="options"
      onClose={onClose}
    >
      Edit options
    </Modal.Header>
    <Modal.Body>
      <Options
        data={data}
        onSave={onSave}
      />
    </Modal.Body>
    <Modal.Footer>
      <Controls noControls grouped>
        <Button
          label="Done"
          btnStyle="default"
          action={onClose}
          big
        />
      </Controls>
    </Modal.Footer>
  </Modal>
);

export default OptionsModal;
