/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import Toolbar from '../../../components/toolbar';
import Search from '../../../containers/search';
import Datepicker from '../../../components/datepicker';
import queryControl from '../../../hocomponents/queryControl';
import { Control as Button } from '../../../components/controls';
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
  <div>
    <Toolbar>
      <Selector selected={selected} />
      { selected !== 'none' && (
        <Actions selectedIds={selectedIds} />
      )}
      <Datepicker
        date={dateQuery || '24h'}
        onApplyDate={changeDateQuery}
        className="toolbar-item"
      />
      <Button
        label="CSV"
        btnStyle="default"
        big
        action={onCSVClick}
      />
      <Search
        defaultValue={searchQuery}
        onSearchUpdate={changeSearchQuery}
        resource="jobs"
      />
    </Toolbar>
    {collectionCount > 0 && (
      <InfoBar>
        {(selectedIds.length > 0) && (
          <InfoBarItem icon="check" style="success">{ selectedIds.length }</InfoBarItem>
        )}
        <InfoBarItem icon="eye" style="info">
          { collectionCount } of { collectionTotal }
        </InfoBarItem>
        <InfoBarItem icon="warning" style="danger">{ withAlertsCount }</InfoBarItem>
        <InfoBarItem icon="power-off" style="success">{ enabledCount }</InfoBarItem>
      </InfoBar>
    )}
  </div>
);

export default compose(
  queryControl('search'),
  queryControl('date'),
  pure([
    'selected',
    'selectedIds',
    'searchQuery',
    'dateQuery',
  ])
)(JobsToolbar);
