// @flow
import React from 'react';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import pure from 'recompose/onlyUpdateForKeys';

import actions from '../../store/api/actions';
import { querySelector, resourceSelector } from '../../selectors';
import { findBy } from '../../helpers/search';
import withSort from '../../hocomponents/sort';
import loadMore from '../../hocomponents/loadMore';
import patch from '../../hocomponents/patchFuncArgs';
import sync from '../../hocomponents/sync';
import selectable from '../../hocomponents/selectable';
import withCSV from '../../hocomponents/csv';
import { sortDefaults } from '../../constants/sort';
import GroupsToolbar from './toolbar';
import GroupsTable from './table';
import GroupsDetail from './detail';
import { Control } from '../../components/controls';

type Props = {
  sortData: Object,
  onSortChange: Function,
  groups: Array<Object>,
  selected: string,
  selectedIds: Array<number>,
  onCSVClick: Function,
  location: Object,
  group?: Object,
  canLoadMore: boolean,
  handleLoadMore: Function,
  limit: number,
  isTablet: boolean,
};

const GroupsView: Function = ({
  selected,
  selectedIds,
  onCSVClick,
  location,
  groups,
  sortData,
  onSortChange,
  group,
  limit,
  canLoadMore,
  handleLoadMore,
  isTablet,
}: Props): React.Element<any> => (group ? (
  <GroupsDetail
    {...group}
  />
) : (
  <div>
    <GroupsToolbar
      selected={selected}
      selectedIds={selectedIds}
      onCSVClick={onCSVClick}
      location={location}
    />
    <GroupsTable
      collection={groups}
      sortData={sortData}
      onSortChange={onSortChange}
      canLoadMore={canLoadMore}
      isTablet={isTablet}
    />
    { canLoadMore && (
      <Control
        label={`Load ${limit} more...`}
        btnStyle="success"
        big
        onClick={handleLoadMore}
      />
    )}
  </div>
));

const filterGroups: Function = (search: string) => (groups: Array<Object>): Array<Object> => (
  findBy(['name', 'description'], search, groups)
);

const transformGroups: Function = (groups: Array<Object>): Array<Object> => (
  groups.map((group: Object): Object => (
    { ...group, ...{
      workflows_count: group.workflows.length,
      jobs_count: group.jobs.length,
      services_count: group.services.length,
      vmaps_count: group.vmaps.length,
      roles_count: group.roles.length,
      mappers_count: group.mappers.length,
    } }
  ))
);

const groupsSelector: Function = createSelector(
  [
    resourceSelector('groups'),
    querySelector('search'),
  ], (groups: Object, search: string) => compose(
    filterGroups(search),
    transformGroups
  )(groups.data)
);

const groupSelector: Function = createSelector(
  [
    resourceSelector('groups'),
    querySelector('group'),
  ], (groups: Object, group: ?string) => (
    group ? groups.data.find((grp: Object): boolean => grp.name === group) : null
  )
);

const settingsSelector = (state: Object): Object => state.ui.settings;

const selector: Function = createSelector(
  [
    resourceSelector('groups'),
    groupSelector,
    groupsSelector,
    settingsSelector,
  ], (meta: Object, group: string, groups: Array<Object>, settings): Object => ({
    meta,
    groups,
    group,
    isTablet: settings.tablet,
  })
);

export default compose(
  connect(
    selector,
    {
      load: actions.groups.fetch,
    }
  ),
  withSort('groups', 'groups', sortDefaults.groups),
  loadMore('groups', 'groups', true, 50),
  withProps({
    fetchParams: { no_synthetic: true },
  }),
  patch('load', ['fetchParams']),
  sync('meta'),
  selectable('groups'),
  withCSV('groups', 'groups'),
  pure([
    'group',
    'groups',
    'sortData',
    'selected',
    'selectedIds',
    'canLoadMore',
    'isTablet',
  ])
)(GroupsView);
