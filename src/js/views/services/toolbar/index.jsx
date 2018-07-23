// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { Button, Intent, Popover, Position } from '@blueprintjs/core';

import Toolbar from '../../../components/toolbar';
import Selector from './selector';
import Actions from './actions';
import Search from '../../../containers/search';
import queryControl from '../../../hocomponents/queryControl';
import { InfoBar, InfoBarItem } from '../../../components/infobar';

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

const ServicesToolbar: Function = ({
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
    <Selector selected={selected} selectedCount={selectedIds.length} />{' '}
    {selected !== 'none' && <Actions selectedIds={selectedIds} />}{' '}
    <Button text="CSV" onClick={onCSVClick} />{' '}
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
        <Button icon="info-sign" className="bp3-minimal" />
      </Popover>
    )}
    <Search
      defaultValue={searchQuery}
      onSearchUpdate={changeSearchQuery}
      resource="services"
    />
  </Toolbar>
);

export default compose(
  queryControl('search'),
  pure(['selected', 'selectedIds', 'searchQuery'])
)(ServicesToolbar);
