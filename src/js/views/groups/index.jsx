// @flow
import React from 'react';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import actions from '../../store/api/actions';
import { querySelector, resourceSelector } from '../../selectors';
import { findBy } from '../../helpers/search';
import withSort from '../../hocomponents/sort';
import loadMore from '../../hocomponents/loadMore';
import patch from '../../hocomponents/patchFuncArgs';
import sync from '../../hocomponents/sync';
import selectable from '../../hocomponents/selectable';
import withCSV from '../../hocomponents/csv';
import withInfoBar from '../../hocomponents/withInfoBar';
import { sortDefaults } from '../../constants/sort';
import GroupsTable from './table';
import GroupsDetail from './detail';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import Box from '../../components/box';
import Headbar from '../../components/Headbar';
import Pull from '../../components/Pull';
import CsvControl from '../../components/CsvControl';
import Search from '../../containers/search';
import queryControl from '../../hocomponents/queryControl';
import Flex from '../../components/Flex';
import Controls from './controls';
import hasInterfaceAccess from '../../hocomponents/hasInterfaceAccess';
import { FormattedMessage } from 'react-intl';

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
  handleLoadAll: Function,
  loadMoreCurrent: number,
  loadMoreTotal: number,
  limit: number,
  isTablet: boolean,
  infoTotalCount: number,
  infoEnabled: number,
  infoWithAlerts: number,
  searchQuery: string,
  changeSearchQuery: Function,
};

const GroupsView: Function = ({
  selected,
  selectedIds,
  onCSVClick,
  groups,
  sortData,
  onSortChange,
  group,
  limit,
  canLoadMore,
  handleLoadMore,
  handleLoadAll,
  loadMoreCurrent,
  loadMoreTotal,
  isTablet,
  searchQuery,
  changeSearchQuery,
}: Props): React.Element<any> =>
  group ? (
    <Flex>
      <Headbar>
        <Breadcrumbs>
          <Crumb link="/groups">
            <FormattedMessage id="Groups" />
          </Crumb>
          <Crumb active>
            {group.name} ({group.id})
          </Crumb>
        </Breadcrumbs>
        <Pull right>
          <Controls enabled={group.enabled} name={group.name} big />
        </Pull>
      </Headbar>
      <GroupsDetail {...group} />
    </Flex>
  ) : (
    <Flex>
      <Headbar>
        <Breadcrumbs>
          <Crumb active>
            <FormattedMessage id="Groups" />
          </Crumb>
        </Breadcrumbs>
        <Pull right>
          <CsvControl onClick={onCSVClick} disabled={size(groups) === 0} />
          <Search
            defaultValue={searchQuery}
            onSearchUpdate={changeSearchQuery}
            resource="groups"
          />
        </Pull>
      </Headbar>
      <Box top noPadding>
        <GroupsTable
          collection={groups}
          sortData={sortData}
          onSortChange={onSortChange}
          canLoadMore={canLoadMore}
          isTablet={isTablet}
          selected={selected}
          selectedIds={selectedIds}
          handleLoadMore={handleLoadMore}
          handleLoadAll={handleLoadAll}
          loadMoreCurrent={loadMoreCurrent}
          loadMoreTotal={loadMoreTotal}
          limit={limit}
        />
      </Box>
    </Flex>
  );

const filterGroups: Function = (search: string) => (
  groups: Array<Object>
): Array<Object> => findBy(['name', 'description'], search, groups);

const transformGroups: Function = (groups: Array<Object>): Array<Object> =>
  groups.map((group: Object): Object => ({
    ...group,
    ...{
      workflows_count: group.workflows.length,
      jobs_count: group.jobs.length,
      services_count: group.services.length,
      vmaps_count: group.vmaps.length,
      roles_count: group.roles.length,
      mappers_count: group.mappers.length,
    },
  }));

const groupsSelector: Function = createSelector(
  [resourceSelector('groups'), querySelector('search')],
  (groups: Object, search: string) =>
    compose(
      filterGroups(search),
      transformGroups
    )(groups.data)
);

const groupSelector: Function = createSelector(
  [resourceSelector('groups'), querySelector('group')],
  (groups: Object, group: ?string) =>
    group
      ? groups.data.find((grp: Object): boolean => grp.name === group)
      : null
);

const settingsSelector = (state: Object): Object => state.ui.settings;

const selector: Function = createSelector(
  [resourceSelector('groups'), groupSelector, groupsSelector, settingsSelector],
  (meta: Object, group: string, groups: Array<Object>, settings): Object => ({
    meta,
    groups,
    group,
    isTablet: settings.tablet,
  })
);

export default compose(
  hasInterfaceAccess('groups', 'Groups'),
  connect(
    selector,
    {
      load: actions.groups.fetch,
    }
  ),
  withInfoBar('groups'),
  withProps({
    fetchParams: { no_synthetic: true },
  }),
  patch('load', ['fetchParams']),
  sync('meta'),
  withSort('groups', 'groups', sortDefaults.groups),
  loadMore('groups', 'groups', true, 50),
  queryControl('search'),
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
    'searchQuery',
  ])
)(GroupsView);
