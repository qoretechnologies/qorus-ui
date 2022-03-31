/* @flow */
import React, { useContext } from 'react';
import { ModalContext } from '../../context/modal';

const ModalManager = () => {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'modals' does not exist on type '{}'.
  const { modals } = useContext(ModalContext);

  return (
    <>
      {modals.map((modal) => (
        <div className="bp3-portal">
          <div className="bp3-overlay-backdrop" />
          <div className="bp3-overlay bp3-overlay-open bp3-overlay-scroll-container">{modal}</div>
        </div>
      ))}
    </>
  );
};

export default ModalManager;
