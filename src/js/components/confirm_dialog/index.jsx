// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import Modal from '../modal';
import { Controls, Control as Button } from '../controls';

type Props = {
  onConfirm: Function,
  onClose: Function,
  children: any,
};

const ConfirmDialog: Function = ({
  onConfirm,
  onClose,
  children,
}: Props): React.Element<any> => (
  <Modal hasFooter>
    <Modal.Header
      titleId="confirmdialog"
      onClose={onClose}
    >
      Please confirm your action
    </Modal.Header>
    <Modal.Body>
      {children}
    </Modal.Body>
    <Modal.Footer>
      <Controls noControls grouped>
        <Button
          label="Cancel"
          action={onClose}
          btnStyle="default"
          big
        />
        <Button
          label="Confirm"
          action={onConfirm}
          btnStyle="success"
          big
        />
      </Controls>
    </Modal.Footer>
  </Modal>
);

export default pure(['children'])(ConfirmDialog);
