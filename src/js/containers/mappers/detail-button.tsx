/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import withHandlers from 'recompose/withHandlers';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control } from '../../components/controls';
import modal from '../../hocomponents/modal';
import MapperModal from './modal';

const DetailButton = ({ handleClick }: { handleClick: Function }) => (
  <Control btnStyle="success" onClick={handleClick} label="Detail" />
);

const addOpenModalHandler = withHandlers({
  handleClick:
    ({
      openModal,
      closeModal,
      mapper,
    }: {
      openModal: Function;
      closeModal: Function;
      mapper: Object;
    }) =>
    () => {
      openModal(<MapperModal mapper={mapper} onClose={closeModal} />);
    },
});

export default compose(pure, modal(), addOpenModalHandler)(DetailButton);
