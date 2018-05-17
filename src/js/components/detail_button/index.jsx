// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { Button, Intent } from '@blueprintjs/core';

import { Control } from '../controls';

type Props = {
  active: boolean,
  onClick: Function,
};

const DetailButton: Function = ({
  active,
  onClick,
}: Props): React.Element<any> => (
  <Button
    text={active ? 'Close' : 'Detail'}
    intent={active ? Intent.WARNING : Intent.PRIMARY}
    onClick={onClick}
    className="pt-small"
  />
);

export default pure(['active'])(DetailButton);
