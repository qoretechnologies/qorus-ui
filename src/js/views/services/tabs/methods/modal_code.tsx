// @flow
import React from 'react';
import pure from 'recompose/pure';
import Modal from '../../../../components/modal';
import SourceCode from '../../../../components/source_code';

type Props = {
  onClose: Function;
  method: Object;
};

const ServiceMethodModal: Function = ({
  onClose,
  method,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<Modal> => (
  <Modal>
    <Modal.Header titleId="methodsTableModalLabel" onClose={onClose}>
      {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
      Source code for {method.name}
    </Modal.Header>
    <Modal.Body>
      {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
      <SourceCode>{method.body}</SourceCode>
    </Modal.Body>
  </Modal>
);

export default pure(ServiceMethodModal);
