// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import Modal from '../modal';
import { Controls, Control as Button } from '../controls';
import Box from '../box';
import Alert from '../alert';

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
  <Modal
    hasFooter
    onEnterPress={() => {
      onConfirm();
    }}
  >
    <Modal.Header titleId="confirmdialog" onClose={onClose}>
      Please confirm your action
    </Modal.Header>
    <Modal.Body>
      <Box top>
        <Alert bsStyle="warning">{children}</Alert>
      </Box>
    </Modal.Body>
    <Modal.Footer>
      <Controls>
        <Button label="Cancel" action={onClose} btnStyle="default" big />
        <Button label="Confirm" action={onConfirm} btnStyle="success" big />
      </Controls>
    </Modal.Footer>
  </Modal>
);

export default pure(['children'])(ConfirmDialog);
