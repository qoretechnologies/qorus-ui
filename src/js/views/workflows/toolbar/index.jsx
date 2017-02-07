/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import Toolbar from '../../../components/toolbar';
import Search from '../../../components/search';
import Datepicker from '../../../components/datepicker';
import queryControl from '../../../hocomponents/queryControl';
import { Control as Button } from '../../../components/controls';
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
}: Props): React.Element<any> => (
  <Toolbar>
    <Selector selected={selected} />
    <Actions
      selectedIds={selectedIds}
      show={selected !== 'none'}
    />
    <Datepicker
      date={dateQuery || '24h'}
      onApplyDate={changeDateQuery}
      className="toolbar-item"
    />
    <Filters location={location} />
    <Button
      label="CSV"
      btnStyle="default"
      big
      action={onCSVClick}
    />
    <Button
      label={expanded ? 'Collapse states' : 'Expand states'}
      btnStyle={expanded ? 'success' : 'default'}
      big
      action={onToggleStatesClick}
    />
    <Search
      defaultValue={searchQuery}
      onSearchUpdate={changeSearchQuery}
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
    'expanded',
  ])
)(WorkflowsToolbar);
