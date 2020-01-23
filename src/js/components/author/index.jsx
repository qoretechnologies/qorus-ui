// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import Icon from '../icon';
import PaneItem from '../pane_item';

type Props = {
  model: Object,
  author: string,
};

const Author: Function = ({ model: { author } }: Props): ?React.Element<any> =>
  author ? (
    <PaneItem title="Author">
      <Icon icon="user" /> {author}
    </PaneItem>
  ) : null;

export default pure(['author'])(Author);
