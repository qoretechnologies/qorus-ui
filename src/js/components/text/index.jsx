// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';

import withModal from '../../hocomponents/modal';
import Modal from '../modal';

type Props = {
  text: string,
  noPopup?: boolean,
  handleClick: Function,
  openModal: Function,
  closeModal: Function,
};

const Text: Function = ({
  text,
  noPopup,
  handleClick,
}: Props): React.Element<any> => (
  <p
    title={text}
    onClick={noPopup ? null : handleClick}
  >
    {text}
  </p>
);

export default compose(
  withModal(),
  withHandlers({
    handleClick: ({ text, openModal, closeModal }: Props): Function => (): void => {
      openModal(
        <Modal>
          <Modal.Header
            titleId="text-popup"
            onClose={closeModal}
          />
          <Modal.Body>
            <p>{text}</p>
          </Modal.Body>
        </Modal>
      );
    },
  }),
  pure(['text', 'noPopup'])
)(Text);
