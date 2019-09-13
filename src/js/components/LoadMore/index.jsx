import React from 'react';

import Toolbar from '../toolbar';
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
  onLoadMore,
  onLoadAll,
  total,
  currentCount,
  intl
}: Props): React.Element<Toolbar> =>
  canLoadMore && (
    <Controls>
      <Control
        text={intl.formatMessage({ id: 'global.show-more' }) + ` (${currentCount} / ${total})`}
        iconName="chevron-down"
        onClick={onLoadMore}
        big
      />
      {onLoadAll && (
        <Control
          text={intl.formatMessage({ id: 'global.show-all' })}
          iconName="double-chevron-down"
          onClick={onLoadAll}
          big
        />
      )}
    </Controls>
  );

export default compose(
  mapProps(
    ({
      onLoadMore,
      handleLoadMore,
      onLoadAll,
      handleLoadAll,
      ...rest
    }: Props): Props => ({
      onLoadMore: onLoadMore || handleLoadMore,
      onLoadAll: onLoadAll || handleLoadAll,
      ...rest,
    })
  ),
  onlyUpdateForKeys(['limit', 'canLoadMore', 'currentCount', 'total']),
  injectIntl
)(LoadMore);
