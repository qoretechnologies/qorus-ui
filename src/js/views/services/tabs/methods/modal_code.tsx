// @flow
import { useReqoreProperty } from '@qoretechnologies/reqore';
import Modal from '../../../../components/modal';
import SourceCode from '../../../../components/source_code';

type Props = {
  onClose: Function;
  method: any;
};

const ServiceMethodModal: Function = ({
  onClose,
  method,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
  const getAndIncreaseZIndex = useReqoreProperty('getAndIncreaseZIndex');
  return (
    <Modal zIndex={getAndIncreaseZIndex()}>
      <Modal.Header titleId="methodsTableModalLabel" onClose={onClose}>
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
        Source code for {method.name}
      </Modal.Header>
      <Modal.Body>
        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
        <SourceCode>{method.body}</SourceCode>
      </Modal.Body>
    </Modal>
  );
};

export default ServiceMethodModal;
