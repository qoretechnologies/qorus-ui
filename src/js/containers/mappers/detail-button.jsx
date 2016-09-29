/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/pure';

import MapperModal from './modal';
import modal from '../../hocomponents/modal';
import { Control } from '../../components/controls';

const DetailButton = ({ handleClick }: { handleClick: Function }) => (
  <Control
    btnStyle="success"
    onClick={handleClick}
    label="Detail"
  />
);

const addOpenModalHandler = withHandlers({
  handleClick: (
    { openModal, closeModal, mapper }: { openModal: Function, closeModal: Function, mapper: Object }
  ) => () => {
    openModal(<MapperModal mapper={mapper} onClose={closeModal} />);
  },
});

export default compose(
  pure,
  modal(),
  addOpenModalHandler,
)(DetailButton);
