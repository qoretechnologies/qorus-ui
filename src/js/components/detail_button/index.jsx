// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { Button, Intent, Tooltip, Position } from '@blueprintjs/core';

type Props = {
  active: boolean,
  onClick: Function,
};

const DetailButton: Function = ({
  active,
  onClick,
}: Props): React.Element<any> => (
  <Tooltip
    content="Opens pane with detailed view"
    position={Position.TOP}
    useSmartPositioning
  >
    <Button
      text={active ? 'Close' : 'Detail'}
      intent={active && Intent.PRIMARY}
      onClick={onClick}
      className="pt-small"
    />
  </Tooltip>
);

export default pure(['active'])(DetailButton);
