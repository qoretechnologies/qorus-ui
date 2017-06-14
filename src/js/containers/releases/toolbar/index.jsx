// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';

import Toolbar from '../../../components/toolbar';
import actions from '../../../store/api/actions';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import SearchBar from './search';

type Props = {
  sort: string,
  compact: boolean,
  sortDir: boolean,
  changeSort: Function,
  changeSortDir: Function,
  handleSortChange: Function,
  handleSortDirChange: Function,
};

const ReleasesToolbar: Function = ({
  sort,
  sortDir,
  handleSortChange,
  handleSortDirChange,
  compact,
}: Props): React.Element<any> => (
  <Toolbar>
    <div className="pull-left">
      <Dropdown id="release-sort">
        <Control> Sort by: {sort}</Control>
        <Item
          title="Name"
          action={handleSortChange}
        />
        <Item
          title="Date"
          action={handleSortChange}
        />
      </Dropdown>
      <Dropdown id="release-sortDir">
        <Control> Sort direction: {sortDir}</Control>
        <Item
          title="Descending"
          action={handleSortDirChange}
        />
        <Item
          title="Ascending"
          action={handleSortDirChange}
        />
      </Dropdown>
    </div>
    {!compact && (
      <SearchBar />
    )}
  </Toolbar>
);

export default compose(
  connect(
    null,
    {
      changeSort: actions.releases.changeSort,
      changeSortDir: actions.releases.changeSortDir,
    }
  ),
  withHandlers({
    handleSortChange: ({ changeSort }: Props): Function => (event: Object, value: string): void => {
      changeSort(value);
    },
    handleSortDirChange: ({
      changeSortDir,
    }: Props): Function => (event: Object, value: string): void => {
      changeSortDir(value);
    },
  }),
  pure([
    'sort',
    'sortDir',
  ])
)(ReleasesToolbar);
