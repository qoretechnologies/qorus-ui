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
  <Button
    text={active ? 'Close' : 'Detail'}
    intent={active ? Intent.PRIMARY : Intent.NONE}
    onClick={onClick}
    className="pt-small"
  />
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
