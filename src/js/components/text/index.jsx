// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import pure from 'recompose/onlyUpdateForKeys';

import withModal from '../../hocomponents/modal';
import Modal from '../modal';

type Props = {
  text: string,
  popup?: boolean,
  placeholder?: string,
  handleClick: Function,
  openModal: Function,
  closeModal: Function,
  setExpand: Function,
  expanded?: boolean,
};

const Text: Function = ({
  text,
  expanded,
  handleClick,
  placeholder,
}: Props): React.Element<any> => (
  expanded ?
    <div
      className="text-component"
      onClick={handleClick}
    >
      {text}
    </div> :
    <p
      title={placeholder || text}
      onClick={handleClick}
      className="text-component"
    >
      {placeholder || text}
    </p>
);

export default compose(
  withState('expanded', 'setExpand', false),
  withModal(),
  withHandlers({
    handleClick: ({
      text,
      openModal,
      closeModal,
      setExpand,
      popup,
    }: Props): Function => (): void => {
      if (popup) {
        openModal(
          <Modal>
            <Modal.Header
              titleId="text-popup"
              onClose={closeModal}
            />
            <Modal.Body>
              <div>{text}</div>
            </Modal.Body>
          </Modal>
        );
      } else {
        setExpand((expanded: boolean): boolean => !expanded);
      }
    },
  }),
  pure(['text', 'popup', 'expanded'])
)(Text);
