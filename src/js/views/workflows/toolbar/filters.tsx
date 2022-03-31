// @flow
import { Intent } from '@blueprintjs/core';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import queryControl from '../../../hocomponents/queryControl';

type Props = {
  runningQuery: string;
  changeRunningQuery: Function;
  latestQuery: string;
  changeLatestQuery: Function;
  deprecatedQuery: string;
  changeDeprecatedQuery: Function;
  isTablet: boolean;
};

const ToolbarFilters: Function = ({
  runningQuery,
  changeRunningQuery,
  latestQuery,
  changeLatestQuery,
  deprecatedQuery,
  changeDeprecatedQuery,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  <Dropdown>
    {/* @ts-ignore ts-migrate(2739) FIXME: Type '{ children: (string | Element)[]; intent: "p... Remove this comment to see the full error message */}
    <Control
      intent={deprecatedQuery || runningQuery || latestQuery ? Intent.PRIMARY : Intent.NONE}
      icon="filter-list"
    >
      {' '}
      <FormattedMessage id="dropdown.filter" />
    </Control>
    <Item
      title={intl.formatMessage({ id: 'dropdown.running' })}
      icon={runningQuery ? 'selection' : 'circle'}
      // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
      onClick={changeRunningQuery}
    />
    <Item
      title={intl.formatMessage({ id: 'dropdown.latest' })}
      icon={latestQuery ? 'selection' : 'circle'}
      // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
      onClick={changeLatestQuery}
    />
    <Item
      title={intl.formatMessage({ id: 'dropdown.deprecated' })}
      icon={deprecatedQuery ? 'selection' : 'circle'}
      // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
      onClick={changeDeprecatedQuery}
    />
  </Dropdown>
);

export default compose(
  queryControl('running', null, true),
  queryControl('latest', null, true),
  queryControl('deprecated', null, true),
  pure(['runningQuery', 'latestQuery', 'deprecatedQuery', 'isTablet']),
  injectIntl
)(ToolbarFilters);
