// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import Toolbar from '../../../components/toolbar';
import Selector from './selectors';
import Actions from './actions';
import Search from '../../../containers/search';
import { Control as Button } from '../../../components/controls';
import queryControl from '../../../hocomponents/queryControl';

type Props = {
  selected: string,
  selectedIds: Array<number>,
  onCSVClick: Function,
  searchQuery: string,
  changeSearchQuery: Function,
  location: Object,
};

const GroupsToolbar: Function = ({
  selected,
  selectedIds,
  searchQuery,
  changeSearchQuery,
  onCSVClick,
}: Props): React.Element<any> => (
  <Toolbar>
    <Selector selected={selected} />
    { selected !== 'none' && (
      <Actions selectedIds={selectedIds} />
    )}
    <Button
      label="CSV"
      btnStyle="default"
      big
      action={onCSVClick}
    />
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
