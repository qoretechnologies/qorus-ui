// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { Intent } from '@blueprintjs/core';

import queryControl from '../../../hocomponents/queryControl';
import Dropdown, { Item, Control } from '../../../components/dropdown';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Controls, Control as Button } from '../../../components/controls';
import { injectIntl, FormattedMessage } from 'react-intl';

type Props = {
  runningQuery: string,
  changeRunningQuery: Function,
  latestQuery: string,
  changeLatestQuery: Function,
  deprecatedQuery: string,
  changeDeprecatedQuery: Function,
  isTablet: boolean,
};

const ToolbarFilters: Function = ({
  runningQuery,
  changeRunningQuery,
  latestQuery,
  changeLatestQuery,
  deprecatedQuery,
  changeDeprecatedQuery,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
  <Dropdown>
    // @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: (string | Element)[]; intent: "p... Remove this comment to see the full error message
    <Control
      intent={
        deprecatedQuery || runningQuery || latestQuery
          ? Intent.PRIMARY
          : Intent.NONE
      }
      icon="filter-list"
    >
      {' '}
      <FormattedMessage id='dropdown.filter' />
    </Control>
    <Item
      title={intl.formatMessage({ id: 'dropdown.running' })}
      icon={runningQuery ? 'selection' : 'circle'}
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
      onClick={changeRunningQuery}
    />
    <Item
      title={intl.formatMessage({ id: 'dropdown.latest' })}
      icon={latestQuery ? 'selection' : 'circle'}
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
      onClick={changeLatestQuery}
    />
    <Item
      title={intl.formatMessage({ id: 'dropdown.deprecated' })}
      icon={deprecatedQuery ? 'selection' : 'circle'}
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
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
