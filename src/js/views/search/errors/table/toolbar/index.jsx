/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import Toolbar from '../../../../../components/toolbar';
import { Control as Button } from '../../../../../components/controls';

type Props = {
  onCSVClick: Function,
  location: Object,
};

const OrdersToolbar: Function = ({
  onCSVClick,
}: Props): React.Element<any> => (
  <Toolbar sticky>
    <Button
      label="CSV"
      btnStyle="default"
      big
      action={onCSVClick}
    />
  </Toolbar>
);

export default compose(
  pure([
    'onCSVClick',
  ])
)(OrdersToolbar);
