/* @flow */
import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import PaneItem from '../pane_item';

const Groups: Function = ({
  children,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ children... Remove this comment to see the full error message
  intl,
}: any) =>
  React.Children.count(children) !== 0 && (
    <PaneItem title={intl.formatMessage({ id: 'component.groups' })}>{children}</PaneItem>
  );

export default compose(pure(['childen']), injectIntl)(Groups);
