import React from 'react';

import Toolbar from '../toolbar';
import { Controls, Control } from '../controls';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

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
}: Props): React.Element<Toolbar> =>
  canLoadMore && (
    <Controls>
      <Control
        text={`Show more (${currentCount} / ${total})`}
        iconName="chevron-down"
        onClick={onLoadMore}
        big
      />
      {onLoadAll && (
        <Control
          text="Show all"
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
  onlyUpdateForKeys(['limit', 'canLoadMore', 'currentCount', 'total'])
)(LoadMore);
