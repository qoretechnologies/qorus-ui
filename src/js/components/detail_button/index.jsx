// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import { Control } from '../controls';

type Props = {
  active: boolean,
  onClick: Function,
};

const DetailButton: Function = ({ active, onClick }: Props): React.Element<any> => (
  <Control
    label={active ? 'Close' : 'Detail'}
    btnStyle={active ? 'danger' : 'success'}
    onClick={onClick}
    title={active ? 'Close detail pane' : 'Open detail pane'}
  />
);

export default pure(['active'])(DetailButton);
