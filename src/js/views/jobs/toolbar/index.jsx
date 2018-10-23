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
    <Selector selected={selected} />{' '}
    <Actions selectedIds={selectedIds} show={selected !== 'none'} />{' '}
    <Datepicker
      date={dateQuery || '24h'}
      onApplyDate={changeDateQuery}
      className="toolbar-item"
    />{' '}
    <ButtonGroup>
      <Button text="CSV" onClick={onCSVClick} />
    </ButtonGroup>
  </Toolbar>
);

export default compose(
  queryControl('search'),
  queryControl('date'),
  pure(['selected', 'selectedIds', 'searchQuery', 'dateQuery'])
)(JobsToolbar);
