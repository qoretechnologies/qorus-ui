// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import { Button, Intent } from '@blueprintjs/core';
import withHandlers from 'recompose/withHandlers';

type Props = {
  active: boolean,
  onClick: Function,
  handleClick: Function,
};

const DetailButton: Function = ({
  active,
  handleClick,
}: Props): React.Element<any> => (
  <Button
    text={active ? 'Close' : 'Detail'}
    intent={active ? Intent.PRIMARY : Intent.NONE}
    onClick={handleClick}
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
        onClick(e);
      }
    },
  }),
  pure(['active'])
)(DetailButton);
