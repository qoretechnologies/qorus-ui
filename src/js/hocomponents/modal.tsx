import React, {
  useContext, useEffect
} from 'react';

import { ModalContext } from '../context/modal';

/**
 * A high-order component that provides an easy access to
 * opening and closing a modal
 */
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
export default (): Function => (Component: ReactClass<*>): ReactClass<*> => {
  const ComponentWithModal = (props) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'addModal' does not exist on type '{}'.
    const { addModal, removeModal, modals } = useContext(ModalContext);

    useEffect(() => {
      if (modals.length) {
        window.addEventListener('keyup', handleKeyUp);
      } else {
        window.removeEventListener('keyup', handleKeyUp);
      }

      return () => {
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, [modals]);

    const handleKeyUp = (event) => {
      if (event.key === 'Escape') {
        removeModal();
      }
    };

    const handleOpenModal = (Modal) => {
      addModal(Modal);
    };

    return (
      <Component
        openModal={handleOpenModal}
        closeModal={() => removeModal()}
        {...props}
      />
    );
  };

  return ComponentWithModal;
};
