/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { injectIntl } from 'react-intl';

import PaneItem from '../pane_item';

const Groups: Function = ({
  children,
  intl,
}: {
  children: any,
}): React.Element<any> | any =>
  React.Children.count(children) !== 0 && (
    <PaneItem title={intl.formatMessage({ id: 'global.groups' })}>{children}</PaneItem>
  );

export default compose(
  pure(['childen']),
  injectIntl
)(Groups);
