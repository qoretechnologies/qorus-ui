// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { ButtonGroup, Button, Intent, Icon } from '@blueprintjs/core';

import queryControl from '../../../hocomponents/queryControl';
import Dropdown, { Item, Control } from '../../../components/dropdown';

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
        icon="filter-list"
      >
        {' '}
        Filter
      </Control>
      <Item
        title="Running"
        icon={runningQuery ? 'selection' : 'circle'}
        onClick={changeRunningQuery}
      />
      <Item
        title="Latest"
        icon={latestQuery ? 'selection' : 'circle'}
        onClick={changeLatestQuery}
      />
      <Item
        title="Deprecated"
        icon={deprecatedQuery ? 'selection' : 'circle'}
        onClick={changeDeprecatedQuery}
      />
    </Dropdown>
  ) : (
    <ButtonGroup>
      <Button
        text="Running"
        onClick={changeRunningQuery}
        icon={runningQuery ? 'selection' : 'circle'}
        intent={runningQuery ? Intent.PRIMARY : Intent.NONE}
      />
      <Button
        text="Last version"
        onClick={changeLatestQuery}
        icon={latestQuery ? 'selection' : 'circle'}
        intent={latestQuery ? Intent.PRIMARY : Intent.NONE}
      />
      <Dropdown>
        <Control intent={deprecatedQuery ? Intent.PRIMARY : Intent.NONE}>
          <Icon icon="caret-down" />
        </Control>
        <Item
          title="Deprecated"
          icon={deprecatedQuery ? 'selection' : 'circle'}
          onClick={changeDeprecatedQuery}
        />
      </Dropdown>
    </ButtonGroup>
  );

export default compose(
  queryControl('running', null, true),
  queryControl('latest', null, true),
  queryControl('deprecated', null, true),
  pure(['runningQuery', 'latestQuery', 'deprecatedQuery', 'isTablet'])
)(ToolbarFilters);
