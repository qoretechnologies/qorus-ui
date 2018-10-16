/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { Button, Popover, Position, ButtonGroup } from '@blueprintjs/core';

import Toolbar from '../../../components/toolbar';
import Search from '../../../containers/search';
import Datepicker from '../../../components/datepicker';
import queryControl from '../../../hocomponents/queryControl';
import { InfoBar, InfoBarItem } from '../../../components/infobar';
import Actions from './actions';
import Selector from './selector';

type Props = {
  selected: string,
  selectedIds: Array<number>,
  searchQuery: string,
  changeSearchQuery: Function,
  dateQuery: string,
  changeDateQuery: Function,
  onCSVClick: Function,
  collectionCount: number,
  collectionTotal: number,
  withAlertsCount: number,
  enabledCount: number,
};

const JobsToolbar: Function = ({
  selected,
  selectedIds,
  searchQuery,
  changeSearchQuery,
  dateQuery,
  changeDateQuery,
  onCSVClick,
  collectionCount,
  collectionTotal,
  withAlertsCount,
  enabledCount,
}: Props): React.Element<any> => (
  <Toolbar>
    <div className="pull-left">
      <Selector selected={selected} />{' '}
      <Actions selectedIds={selectedIds} show={selected !== 'none'} />{' '}
      <Datepicker
        date={dateQuery || '24h'}
        onApplyDate={changeDateQuery}
        className="toolbar-item"
      />{' '}
      <ButtonGroup>
        <Button text="CSV" onClick={onCSVClick} />
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
      resource="jobs"
    />
  </Toolbar>
);

export default compose(
  queryControl('search'),
  queryControl('date'),
  pure(['selected', 'selectedIds', 'searchQuery', 'dateQuery'])
)(JobsToolbar);
