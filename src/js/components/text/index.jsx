// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';

import withModal from '../../hocomponents/modal';
import Modal from '../modal';
import Tree from '../tree';

type Props = {
  text: any,
  popup?: boolean,
  placeholder?: string,
  handleClick: Function,
  openModal: Function,
  closeModal: Function,
  setExpand: Function,
  expanded?: boolean,
  renderTree?: boolean,
};

const Text: Function = ({
  text,
  expanded,
  handleClick,
  placeholder,
}: Props): React.Element<any> => {
  if (!placeholder && text && typeof text === 'object') {
    return text;
  } else if (expanded) {
    return (
      <div className="text-component" onClick={handleClick}>
        {text.toString()}
      </div>
    );
  }

  return (
    <div
      title={placeholder || text}
      onClick={handleClick}
      className="text-component"
    >
      {placeholder || text}
    </div>
  );
};

export default compose(
  withState('expanded', 'setExpand', false),
  withModal(),
  mapProps(
    ({ text, renderTree, ...rest }: Props): Props => ({
      // eslint-disable-next-line
      text:
        text && typeof text === 'object' ? (
          renderTree ? (
            <Tree data={text} />
          ) : (
            JSON.stringify(text)
          )
        ) : (
          text
        ),
      ...rest,
    })
  ),
  withHandlers({
    handleClick: ({
      text,
      openModal,
      closeModal,
      setExpand,
      popup,
    }: Props): Function => (event: Object): void => {
      event.stopPropagation();

      if (popup) {
        openModal(
          <Modal>
            <Modal.Header titleId="text-popup" onClose={closeModal} />
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
