/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import {
  ButtonGroup,
  Button,
  Intent,
  Popover,
  Menu,
  MenuItem,
  Position,
} from '@blueprintjs/core';

import Toolbar from '../../../components/toolbar';
import Search from '../../../containers/search';
import Datepicker from '../../../components/datepicker';
import queryControl from '../../../hocomponents/queryControl';
import Actions from './actions';
import Selector from './selector';
import Filters from './filters';

type Props = {
  selected: string,
  selectedIds: Array<number>,
  searchQuery: string,
  changeSearchQuery: Function,
  dateQuery: string,
  changeDateQuery: Function,
  onCSVClick: Function,
  expanded: boolean,
  onToggleStatesClick: Function,
  location: Object,
  isTablet: boolean,
  collectionCount: number,
  collectionTotal: number,
  withAlertsCount: number,
  enabledCount: number,
};

const WorkflowsToolbar: Function = ({
  selected,
  selectedIds,
  searchQuery,
  changeSearchQuery,
  dateQuery,
  changeDateQuery,
  onCSVClick,
  expanded,
  onToggleStatesClick,
  location,
  isTablet,
  withAlertsCount,
  enabledCount,
}: Props): React.Element<any> => (
  <div>
    <Toolbar>
      <Selector selected={selected} selectedCount={selectedIds.length} />{' '}
      <Actions
        selectedIds={selectedIds}
        show={selected !== 'none'}
        isTablet={isTablet}
      />{' '}
      <Datepicker
        date={dateQuery || '24h'}
        onApplyDate={changeDateQuery}
        className="toolbar-item"
      />{' '}
      <Filters location={location} isTablet={isTablet} />{' '}
      <ButtonGroup>
        <Button text="CSV" onClick={onCSVClick} />
        {!isTablet && (
          <Button
            text={expanded ? 'Collapse states' : 'Expand states'}
            intent={expanded ? Intent.PRIMARY : Intent.NONE}
            onClick={onToggleStatesClick}
          />
        )}
      </ButtonGroup>{' '}
      <Popover
        content={
          <Menu>
            <MenuItem
              icon="warning-sign"
              text="Workflows with alert"
              label={withAlertsCount}
            />
            <MenuItem
              icon="power"
              text="Enabled workflows"
              label={enabledCount}
            />
          </Menu>
        }
        position={Position.BOTTOM}
      >
        <ButtonGroup>
          <Button icon="info-sign" />
        </ButtonGroup>
      </Popover>
      <Search
        defaultValue={searchQuery}
        onSearchUpdate={changeSearchQuery}
        resource="workflows"
      />
    </Toolbar>
  </div>
);

export default compose(
  queryControl('search'),
  queryControl('date'),
  pure(['selected', 'selectedIds', 'searchQuery', 'dateQuery', 'expanded'])
)(WorkflowsToolbar);
