/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { Button } from '@blueprintjs/core';

import Toolbar from '../../../../../components/toolbar';

type Props = {
  onCSVClick: Function,
  location: Object,
};

const OrdersToolbar: Function = ({ onCSVClick }: Props): React.Element<any> => (
  <Toolbar mt mb>
    <Button text="CSV" onClick={onCSVClick} />
  </Toolbar>
);

export default compose(pure(['onCSVClick']))(OrdersToolbar);
