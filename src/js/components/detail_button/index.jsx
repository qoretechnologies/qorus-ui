// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { Control as Button } from '../controls';
import { Intent } from '@blueprintjs/core';
import { injectIntl } from 'react-intl';

type Props = {
  active: boolean,
  onClick: Function,
  handleClick: Function,
};

const DetailButton: Function = ({
  active,
  handleClick,
  intl,
}: Props): React.Element<any> => (
  <Button
    title={intl.formatMessage({ id: 'button.opens-side-pane' })}
    intent={active ? Intent.PRIMARY : Intent.NONE}
    onClick={handleClick}
    iconName="list-detail-view"
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
  pure(['active']),
  injectIntl
)(DetailButton);
