/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import Toolbar from '../../../components/toolbar';
import Search from '../../../containers/search';
import Datepicker from '../../../components/datepicker';
import queryControl from '../../../hocomponents/queryControl';
import { Control as Button } from '../../../components/controls';
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
};

const JobsToolbar: Function = ({
  selected,
  selectedIds,
  searchQuery,
  changeSearchQuery,
  dateQuery,
  changeDateQuery,
  onCSVClick,
}: Props): React.Element<any> => (
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
