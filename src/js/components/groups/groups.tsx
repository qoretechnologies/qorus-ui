/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { injectIntl } from 'react-intl';

import PaneItem from '../pane_item';

const Groups: Function = ({
  children,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ children... Remove this comment to see the full error message
  intl,
}: {
  children: any,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}): React.Element<any> | any =>
  React.Children.count(children) !== 0 && (
    <PaneItem title={intl.formatMessage({ id: 'component.groups' })}>{children}</PaneItem>
  );

export default compose(
  pure(['childen']),
  injectIntl
)(Groups);
