// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { Popover, Position } from '@blueprintjs/core';

import Toolbar from '../../../components/toolbar';
import Selector from './selector';
import Actions from './actions';
import Search from '../../../containers/search';
import queryControl from '../../../hocomponents/queryControl';
import { InfoBar, InfoBarItem } from '../../../components/infobar';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';

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
    <div className="pull-left">
      <Selector selected={selected} selectedCount={selectedIds.length} />{' '}
      <Actions selectedIds={selectedIds} show={selected !== 'none'} />{' '}
      <ButtonGroup>
        <Button big text="CSV" onClick={onCSVClick} />
      </ButtonGroup>{' '}
      {collectionCount > 0 && (
        <Popover
          content={
            <InfoBar>
              {selectedIds.length > 0 && (
                <InfoBarItem iconName="check" style="success">
                  {selectedIds.length}
                </InfoBarItem>
              )}
              <InfoBarItem iconName="eye" style="info">
                {collectionCount} of {collectionTotal}
              </InfoBarItem>
              <InfoBarItem iconName="warning" style="danger">
                {withAlertsCount}
              </InfoBarItem>
              <InfoBarItem iconName="power-off" style="success">
                {enabledCount}
              </InfoBarItem>
            </InfoBar>
          }
          position={Position.BOTTOM}
        >
          <Button iconName="info-sign" className="pt-minimal" />
        </Popover>
      )}
    </div>
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
