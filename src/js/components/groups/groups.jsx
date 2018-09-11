/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import PaneItem from '../pane_item';

const Groups: Function = ({
  children,
}: {
  children: any,
}): React.Element<any> | any =>
  React.Children.count(children) !== 0 && (
    <PaneItem title="Groups">{children}</PaneItem>
  );

export default pure(['childen'])(Groups);
