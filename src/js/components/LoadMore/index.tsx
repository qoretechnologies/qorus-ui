import React from 'react';

import Toolbar from '../toolbar';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Controls, Control } from '../controls';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import { injectIntl } from 'react-intl';

type Props = {
  canLoadMore: boolean,
  limit?: number,
  handleLoadMore: Function,
  handleLoadAll?: Function,
  total: number,
  currentCount: number,
};

const LoadMore: Function = ({
  canLoadMore,
  limit,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'onLoadMore' does not exist on type 'Prop... Remove this comment to see the full error message
  onLoadMore,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'onLoadAll' does not exist on type 'Props... Remove this comment to see the full error message
  onLoadAll,
  total,
  currentCount,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<Toolbar> =>
  canLoadMore && (
    <Controls>
      <Control
        text={intl.formatMessage({ id: 'global.show-more' }) + ` (${currentCount} / ${total})`}
        icon="chevron-down"
        onClick={onLoadMore}
        big
      />
      {onLoadAll && (
        <Control
          text={intl.formatMessage({ id: 'global.show-all' })}
          icon="double-chevron-down"
          onClick={onLoadAll}
          big
        />
      )}
    </Controls>
  );

export default compose(
  mapProps(
    ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onLoadMore' does not exist on type 'Prop... Remove this comment to see the full error message
      onLoadMore,
      handleLoadMore,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onLoadAll' does not exist on type 'Props... Remove this comment to see the full error message
      onLoadAll,
      handleLoadAll,
      ...rest
    }: Props): Props => ({
      // @ts-expect-error ts-migrate(2322) FIXME: Type '{ canLoadMore: boolean; limit?: number; tota... Remove this comment to see the full error message
      onLoadMore: onLoadMore || handleLoadMore,
      onLoadAll: onLoadAll || handleLoadAll,
      ...rest,
    })
  ),
  onlyUpdateForKeys(['limit', 'canLoadMore', 'currentCount', 'total']),
  injectIntl
)(LoadMore);
