/* @flow */
import React from 'react';

import Modal from '../../../../components/modal';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}): React.Element<any> => (
  <Modal hasFooter>
    <Modal.Header
      titleId="options"
      onClose={onClose}
    >
      Edit options
    </Modal.Header>
    <Modal.Body>
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
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
