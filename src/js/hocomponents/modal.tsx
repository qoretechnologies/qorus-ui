import { useReqoreProperty } from '@qoretechnologies/reqore';
import { useState } from 'react';

/**
 * A high-order component that provides an easy access to
 * opening and closing a modal
 */
// @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
export default (): Function => (Component) => {
  const ComponentWithModal = (props) => {
    const [modalId, setModalId] = useState(undefined);
    const addModal = useReqoreProperty('addModal');
    const removeModal = useReqoreProperty('removeModal');

    const handleOpenModal = (Modal) => {
      console.log(addModal);
      const id = addModal(Modal);
      setModalId(id);
    };

    console.log(modalId);

    return (
      <Component
        openModal={handleOpenModal}
        closeModal={() => {
          console.log(modalId);
          removeModal(modalId);
        }}
        {...props}
      />
    );
  };

  return ComponentWithModal;
};
