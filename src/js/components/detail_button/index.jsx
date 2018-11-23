// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { Controls as ButtonGroup, Control as Button } from '../controls';
import { Intent } from '@blueprintjs/core';

type Props = {
  active: boolean,
  onClick: Function,
  handleClick: Function,
};

const DetailButton: Function = ({
  active,
  handleClick,
}: Props): React.Element<any> => (
  <ButtonGroup>
    <Button
      intent={active ? Intent.PRIMARY : Intent.NONE}
      onClick={handleClick}
      iconName="list-detail-view"
    />
  </ButtonGroup>
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
