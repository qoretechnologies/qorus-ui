// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { Button, Popover, Position } from '@blueprintjs/core';

import Toolbar from '../../../components/toolbar';
import Selector from './selectors';
import Actions from './actions';
import Search from '../../../containers/search';
import { InfoBar, InfoBarItem } from '../../../components/infobar';
import queryControl from '../../../hocomponents/queryControl';

type Props = {
  selected: string,
  selectedIds: Array<number>,
  onCSVClick: Function,
  searchQuery: string,
  changeSearchQuery: Function,
  location: Object,
  collectionCount: number,
  collectionTotal: number,
  withAlertsCount: number,
  enabledCount: number,
};

const GroupsToolbar: Function = ({
  selected,
  selectedIds,
  searchQuery,
  changeSearchQuery,
  onCSVClick,
  collectionCount,
  collectionTotal,
  withAlertsCount,
  enabledCount,
}: Props): React.Element<any> => (
  <Toolbar>
    <Selector selected={selected} selectedCount={selectedIds.length} />
    {selected !== 'none' && <Actions selectedIds={selectedIds} />}
    <Button text="CSV" onClick={onCSVClick} />
    {collectionCount > 0 && (
      <Popover
        content={
          <InfoBar>
            {selectedIds.length > 0 && (
              <InfoBarItem icon="check" style="success">
                {selectedIds.length}
              </InfoBarItem>
            )}
            <InfoBarItem icon="eye" style="info">
              {collectionCount} of {collectionTotal}
            </InfoBarItem>
            <InfoBarItem icon="warning" style="danger">
              {withAlertsCount}
            </InfoBarItem>
            <InfoBarItem icon="power-off" style="success">
              {enabledCount}
            </InfoBarItem>
          </InfoBar>
        }
        position={Position.BOTTOM}
      >
        <Button iconName="info-sign" className="pt-minimal" />
      </Popover>
    )}
    <Search
      defaultValue={searchQuery}
      onSearchUpdate={changeSearchQuery}
      resource="groups"
    />
  </Toolbar>
);

export default compose(
  queryControl('search'),
  pure(['selected', 'selectedIds', 'searchQuery'])
)(GroupsToolbar);
