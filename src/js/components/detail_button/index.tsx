// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Button
    title={intl.formatMessage({ id: 'button.opens-side-pane' })}
    intent={active ? Intent.PRIMARY : Intent.NONE}
    onClick={handleClick}
    icon="list-detail-view"
  />
);

export default compose(
  withHandlers({
    handleClick: ({ onClick }: Props): Function => (e: Object): void => {
      if (e) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'stopPropagation' does not exist on type ... Remove this comment to see the full error message
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
