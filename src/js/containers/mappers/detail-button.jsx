/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/pure';

import { Control } from '../../components/controls';

const DetailButton = ({ handleClick }: { handleClick: Function }) => (
  <Control
    btnStyle="success"
    onClick={handleClick}
    label="Detail"
  />
);

const addOpenDetailHandler = withHandlers({
  handleClick: ({ mapper }: { mapper: Object }) => () => console.log('Show detail for', mapper),
});

export default compose(
  pure,
  addOpenDetailHandler
)(DetailButton);
