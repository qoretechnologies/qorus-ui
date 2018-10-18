import React from 'react';

import Toolbar from '../toolbar';
import { Controls, Control } from '../controls';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

type Props = {
  canLoadMore: boolean,
  limit: number,
  handleLoadMore: Function,
  handleLoadAll?: Function,
};

const LoadMore: Function = ({
  canLoadMore,
  limit,
  handleLoadMore,
  handleLoadAll,
}: Props): React.Element<Toolbar> =>
  canLoadMore && (
    <Controls>
      <Control
        text={`Show ${limit} more...`}
        iconName="chevron-down"
        onClick={handleLoadMore}
        big
      />
      {handleLoadAll && (
        <Control
          text="Show all"
          iconName="double-chevron-down"
          onClick={handleLoadAll}
          big
        />
      )}
    </Controls>
  );

export default onlyUpdateForKeys(['limit', 'canLoadMore'])(LoadMore);
