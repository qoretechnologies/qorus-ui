// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { Intent } from '@blueprintjs/core';

import queryControl from '../../../hocomponents/queryControl';
import Dropdown, { Item, Control } from '../../../components/dropdown';
import { Controls, Control as Button } from '../../../components/controls';

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
  isTablet,
}: Props): React.Element<any> =>
  isTablet ? (
    <Dropdown>
      <Control
        intent={
          deprecatedQuery || runningQuery || latestQuery
            ? Intent.PRIMARY
            : Intent.NONE
        }
        iconName="filter-list"
      >
        {' '}
        Filter
      </Control>
      <Item
        title="Running"
        iconName={runningQuery ? 'selection' : 'circle'}
        onClick={changeRunningQuery}
      />
      <Item
        title="Latest"
        iconName={latestQuery ? 'selection' : 'circle'}
        onClick={changeLatestQuery}
      />
      <Item
        title="Deprecated"
        iconName={deprecatedQuery ? 'selection' : 'circle'}
        onClick={changeDeprecatedQuery}
      />
    </Dropdown>
  ) : (
    <Controls>
      <Button
        text="Running"
        onClick={changeRunningQuery}
        iconName={runningQuery ? 'selection' : 'circle'}
        intent={runningQuery ? Intent.PRIMARY : Intent.NONE}
        big
      />
      <Button
        text="Last version"
        onClick={changeLatestQuery}
        iconName={latestQuery ? 'selection' : 'circle'}
        intent={latestQuery ? Intent.PRIMARY : Intent.NONE}
        big
      />
      <Button
        text="Deprecated"
        onClick={changeDeprecatedQuery}
        iconName={deprecatedQuery ? 'selection' : 'circle'}
        intent={deprecatedQuery ? Intent.PRIMARY : Intent.NONE}
        big
      />
    </Controls>
  );

export default compose(
  queryControl('running', null, true),
  queryControl('latest', null, true),
  queryControl('deprecated', null, true),
  pure(['runningQuery', 'latestQuery', 'deprecatedQuery', 'isTablet'])
)(ToolbarFilters);
