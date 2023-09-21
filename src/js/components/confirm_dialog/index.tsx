// @flow
import { useReqoreProperty } from '@qoretechnologies/reqore';
import { FormattedMessage, injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import Alert from '../alert';
import Box from '../box';
import { Control as Button, Controls } from '../controls';
import Modal from '../modal';

type Props = {
  onConfirm: Function;
  onClose: Function;
  children: any;
};

const ConfirmDialog: Function = ({
  onConfirm,
  onClose,
  children,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
  const getAndIncreaseZIndex = useReqoreProperty('getAndIncreaseZIndex');

  return (
    <Modal
      hasFooter
      onEnterPress={() => {
        onConfirm();
      }}
      zIndex={getAndIncreaseZIndex()}
    >
      <Modal.Header titleId="confirmdialog" onClose={onClose}>
        <FormattedMessage id="dialog.please-confirm-action" />
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
};

export default compose(pure(['children']), injectIntl)(ConfirmDialog);
