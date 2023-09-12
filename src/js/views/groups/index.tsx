// @flow
import { ReqoreControlGroup } from '@qoretechnologies/reqore';
import size from 'lodash/size';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withProps from 'recompose/withProps';
import { createSelector } from 'reselect';
import CsvControl from '../../components/CsvControl';
import Flex from '../../components/Flex';
import Box from '../../components/box';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import { sortDefaults } from '../../constants/sort';
import Search from '../../containers/search';
import { findBy } from '../../helpers/search';
import withCSV from '../../hocomponents/csv';
import hasInterfaceAccess from '../../hocomponents/hasInterfaceAccess';
import loadMore from '../../hocomponents/loadMore';
import patch from '../../hocomponents/patchFuncArgs';
import queryControl from '../../hocomponents/queryControl';
import selectable from '../../hocomponents/selectable';
import withSort from '../../hocomponents/sort';
import sync from '../../hocomponents/sync';
import withInfoBar from '../../hocomponents/withInfoBar';
import { querySelector, resourceSelector } from '../../selectors';
import actions from '../../store/api/actions';
import Controls from './controls';
import GroupsDetail from './detail';
import GroupsTable from './table';

type Props = {
  sortData: any;
  onSortChange: Function;
  groups: Array<Object>;
  selected: string;
  selectedIds: Array<number>;
  onCSVClick: Function;
  location: any;
  group?: any;
  canLoadMore: boolean;
  handleLoadMore: Function;
  handleLoadAll: Function;
  loadMoreCurrent: number;
  loadMoreTotal: number;
  limit: number;
  isTablet: boolean;
  infoTotalCount: number;
  infoEnabled: number;
  infoWithAlerts: number;
  searchQuery: string;
  changeSearchQuery: Function;
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
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) =>
  group ? (
    <Flex>
      <Breadcrumbs>
        <Crumb link="/groups">
          <FormattedMessage id="Groups" />
        </Crumb>
        <Crumb active>
          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
          {group.name} ({group.id})
        </Crumb>
        <ReqoreControlGroup fixed style={{ marginLeft: 'auto' }}>
          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'enabled' does not exist on type 'Object'... Remove this comment to see the full error message */}
          <Controls enabled={group.enabled} name={group.name} big />
        </ReqoreControlGroup>
      </Breadcrumbs>
      <GroupsDetail {...group} />
    </Flex>
  ) : (
    <Flex>
      <Breadcrumbs>
        <Crumb active>
          <FormattedMessage id="Groups" />
        </Crumb>
        <ReqoreControlGroup fixed style={{ marginLeft: 'auto' }}>
          <CsvControl onClick={onCSVClick} disabled={size(groups) === 0} />
          <Search defaultValue={searchQuery} onSearchUpdate={changeSearchQuery} resource="groups" />
        </ReqoreControlGroup>
      </Breadcrumbs>
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

const filterGroups: Function =
  (search: string) =>
  (groups: Array<Object>): Array<Object> =>
    findBy(['name', 'description'], search, groups);

const transformGroups: Function = (groups: Array<Object>): Array<Object> =>
  groups.map((group: any): any => ({
    ...group,
    ...{
      // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type 'Objec... Remove this comment to see the full error message
      workflows_count: group.workflows.length,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type 'Object'.
      jobs_count: group.jobs.length,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type 'Object... Remove this comment to see the full error message
      services_count: group.services.length,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'vmaps' does not exist on type 'Object'.
      vmaps_count: group.vmaps.length,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'roles' does not exist on type 'Object'.
      roles_count: group.roles.length,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'mappers' does not exist on type 'Object'... Remove this comment to see the full error message
      mappers_count: group.mappers.length,
    },
  }));

const groupsSelector: Function = createSelector(
  [resourceSelector('groups'), querySelector('search')],
  (groups: any, search: string) =>
    compose(
      filterGroups(search),
      transformGroups
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    )(groups.data)
);

const groupSelector: Function = createSelector(
  [resourceSelector('groups'), querySelector('group')],
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  (groups: any, group: string) =>
    group
      ? // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
        groups.data.find((grp: any): boolean => grp.name === group)
      : null
);

// @ts-ignore ts-migrate(2339) FIXME: Property 'ui' does not exist on type 'Object'.
const settingsSelector = (state: any): any => state.ui.settings;

const selector: Function = createSelector(
  [resourceSelector('groups'), groupSelector, groupsSelector, settingsSelector],
  (meta: any, group: string, groups: Array<Object>, settings): any => ({
    meta,
    groups,
    group,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'tablet' does not exist on type 'Object'.
    isTablet: settings.tablet,
  })
);

export default compose(
  hasInterfaceAccess('groups', 'Groups'),
  connect(selector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'groups' does not exist on type '{}'.
    load: actions.groups.fetch,
  }),
  withInfoBar('groups'),
  withProps({
    fetchParams: { no_synthetic: true },
  }),
  patch('load', ['fetchParams']),
  sync('meta'),
  withSort('groups', 'groups', sortDefaults.groups),
  loadMore('groups', 'groups', true, 50),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
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
