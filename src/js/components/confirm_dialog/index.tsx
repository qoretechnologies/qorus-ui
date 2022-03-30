// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import Modal from '../modal';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Controls, Control as Button } from '../controls';
import Box from '../box';
import Alert from '../alert';
import { injectIntl, FormattedMessage } from 'react-intl';

type Props = {
  onConfirm: Function,
  onClose: Function,
  children: any,
};

const ConfirmDialog: Function = ({
  onConfirm,
  onClose,
  children,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Modal
    hasFooter
    onEnterPress={() => {
      onConfirm();
    }}
  >
    <Modal.Header titleId="confirmdialog" onClose={onClose}>
      <FormattedMessage id='dialog.please-confirm-action' />
    </Modal.Header>
    <Modal.Body>
      <Box top>
        <Alert bsStyle="warning">{children}</Alert>
      </Box>
    </Modal.Body>
    <Modal.Footer>
      <Controls>
        <Button
          label={intl.formatMessage({ id: 'button.cancel' })}
          action={onClose}
          btnStyle="default"
          big
        />
        <Button
          label={intl.formatMessage({ id: 'button.confirm' })}
          action={onConfirm}
          btnStyle="success"
          big
        />
      </Controls>
    </Modal.Footer>
  </Modal>
);

export default compose(
  pure(['children']),
  injectIntl
)(ConfirmDialog);
