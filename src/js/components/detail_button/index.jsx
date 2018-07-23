// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import { Button, Intent, Tooltip, Position } from '@blueprintjs/core';
import withHandlers from 'recompose/withHandlers';

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
      intent={active ? Intent.PRIMARY : Intent.NONE}
      onClick={onClick}
      className="bp3-small"
    />
  </Tooltip>
);

export default compose(
  withHandlers({
    handleClick: ({ onClick }: Props): Function => (e: Object): void => {
      if (e) {
        e.stopPropagation();
      }

      if (onClick) {
        onClick();
      }
    },
  }),
  pure(['active'])
)(DetailButton);
