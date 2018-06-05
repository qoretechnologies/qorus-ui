// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import {
  ButtonGroup,
  Button,
  Popover,
  Intent,
  Position,
  Menu,
  MenuItem,
} from '@blueprintjs/core';

import queryControl from '../../../hocomponents/queryControl';
import Dropdown, {
  Item,
  Control as DControl,
} from '../../../components/dropdown';
import { Control, Controls } from '../../../components/controls';

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
    <ButtonGroup>
      <Button
        iconName="filter-list"
        text="Filter"
        intent={
          deprecatedQuery || runningQuery || (latestQuery && Intent.PRIMARY)
        }
      />
      <Popover
        position={Position.BOTTOM}
        content={
          <Menu>
            <MenuItem
              text="Running"
              iconName={runningQuery ? 'selection' : 'circle'}
              onClick={changeRunningQuery}
            />
            <MenuItem
              text="Latest"
              iconName={latestQuery ? 'selection' : 'circle'}
              onClick={changeLatestQuery}
            />
            <MenuItem
              text="Deprecated"
              iconName={deprecatedQuery ? 'selection' : 'circle'}
              onClick={changeDeprecatedQuery}
            />
          </Menu>
        }
      >
        <Button
          iconName="caret-down"
          intent={
            deprecatedQuery || runningQuery || (latestQuery && Intent.PRIMARY)
          }
        />
      </Popover>
    </ButtonGroup>
  ) : (
    <ButtonGroup>
      <Button
        text="Running"
        onClick={changeRunningQuery}
        iconName={runningQuery ? 'selection' : 'circle'}
        intent={runningQuery && Intent.PRIMARY}
      />
      <Button
        text="Last version"
        onClick={changeLatestQuery}
        iconName={latestQuery ? 'selection' : 'circle'}
        intent={latestQuery && Intent.PRIMARY}
      />
      <Popover
        position={Position.BOTTOM}
        content={
          <Menu>
            <MenuItem
              text="Deprecated"
              iconName={deprecatedQuery ? 'selection' : 'circle'}
              onClick={changeDeprecatedQuery}
            />
          </Menu>
        }
      >
        <Button
          iconName="caret-down"
          intent={deprecatedQuery && Intent.PRIMARY}
        />
      </Popover>
    </ButtonGroup>
  );

export default compose(
  queryControl('running', null, true),
  queryControl('latest', null, true),
  queryControl('deprecated', null, true),
  pure(['runningQuery', 'latestQuery', 'deprecatedQuery', 'isTablet'])
)(ToolbarFilters);
