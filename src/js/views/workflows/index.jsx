// @flow
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flowRight } from 'lodash';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withState from 'recompose/withState';
import lifecycle from 'recompose/lifecycle';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { Intent } from '@blueprintjs/core';

import withPane from '../../hocomponents/pane';
import sync from '../../hocomponents/sync';
import patch from '../../hocomponents/patchFuncArgs';
import selectable from '../../hocomponents/selectable';
import unsync from '../../hocomponents/unsync';
import withCSV from '../../hocomponents/csv';
import Box from '../../components/box';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import withInfoBar from '../../hocomponents/withInfoBar';
import loadMore from '../../hocomponents/loadMore';
import actions from '../../store/api/actions';
import WorkflowsTable from './table';
import WorkflowsDetail from './detail';
import { DATES } from '../../constants/dates';
import {
  ORDER_STATES,
  ORDER_GROUPS,
  ORDER_GROUPS_COMPACT,
  GROUPED_ORDER_STATES,
  GROUPED_ORDER_STATES_COMPACT,
} from '../../constants/orders';
import { formatDate } from '../../helpers/workflows';
import { findBy } from '../../helpers/search';
import { formatCount } from '../../helpers/orders';
import { querySelector, resourceSelector } from '../../selectors';
import withSort from '../../hocomponents/sort';
import { sortDefaults } from '../../constants/sort';
import titleManager from '../../hocomponents/TitleManager';
import Toolbar from '../../components/toolbar';
import { CenterWrapper } from '../../components/layout';
import Search from '../../containers/search';
import queryControl from '../../hocomponents/queryControl';
import LoadMore from '../../components/LoadMore';

const filterSearch: Function = (search: string): Function => (
  workflows: Array<Object>
): Array<Object> => findBy(['name', 'id'], search, workflows);

const filterRunning: Function = (running: string): Function => (
  workflows: Array<Object>
): Array<Object> =>
  running === 'true' ? workflows.filter(w => w.exec_count > 0) : workflows;

const filterLastVersion: Function = (latest: string): Function => (
  workflows: Array<Object>
): Array<Object> =>
  latest && latest !== ''
    ? workflows.filter(w => {
        for (const workflow of workflows) {
          if (
            w.name === workflow.name &&
            parseFloat(w.version) < parseFloat(workflow.version)
          ) {
            return false;
          }
        }

        return true;
      })
    : workflows;

const filterDeprecated: Function = (deprecated: string): Function => (
  workflows: Array<Object>
): Array<Object> =>
  deprecated && deprecated !== ''
    ? workflows
    : workflows.filter(w => !w.deprecated);

const systemOptionsSelector: Function = (state: Object): Array<Object> =>
  state.api.systemOptions.data.filter((opt: Object): boolean => opt.workflow);

const groupStatuses: Function = (isTablet: boolean): Function => (
  workflows: Array<Object>
): Array<Object> =>
  workflows.map(
    (workflow: Object): Object => {
      const newWf: Object = { ...workflow };
      const obj = isTablet ? ORDER_GROUPS_COMPACT : ORDER_GROUPS;

      Object.keys(obj).forEach(
        (group: string): void => {
          newWf[`GROUPED_${group}`] = obj[group].reduce(
            (cnt, cur) => cnt + workflow[cur],
            0
          );
          newWf[`GROUPED_${group}_STATES`] = obj[group]
            .map(
              orderGrp => ORDER_STATES.find(grp => grp.name === orderGrp).title
            )
            .join(',');
        }
      );

      return newWf;
    }
  );

const countInstances: Function = (isTablet: boolean): Function => (
  workflows: Array<Object>
): Object => {
  const count: Object = { total: 0 };
  const addCount: Function = (group, addPrefix) => {
    const grp = addPrefix ? `GROUPED_${group}` : group;

    if (!count[grp]) count[grp] = 0;

    workflows.forEach(
      (workflow: Object): void => {
        count[grp] += workflow[grp];
      }
    );

    if (addPrefix) count.total += count[grp];

    count[grp] = formatCount(count[grp]);
  };

  if (isTablet) {
    Object.keys(ORDER_GROUPS_COMPACT).forEach(group => addCount(group, true));
  } else {
    Object.keys(ORDER_GROUPS).forEach(group => addCount(group, true));
  }

  ORDER_STATES.forEach(
    (state: Object): void => {
      addCount(state.name);
    }
  );

  count.total = formatCount(count.total);

  return count;
};

const settingsSelector = (state: Object): Object => state.ui.settings;

const collectionSelector: Function = createSelector(
  [
    querySelector('search'),
    querySelector('running'),
    querySelector('latest'),
    querySelector('deprecated'),
    resourceSelector('workflows'),
    settingsSelector,
  ],
  (search, running, latest, deprecated, workflows, settings) =>
    flowRight(
      filterLastVersion(latest),
      filterRunning(running),
      filterSearch(search),
      filterDeprecated(deprecated),
      groupStatuses(settings.tablet)
    )(workflows.data)
);

const totalInstancesSelector: Function = createSelector(
  [collectionSelector, settingsSelector],
  (workflows, settings) => countInstances(settings.tablet)(workflows)
);

const viewSelector = createSelector(
  [
    resourceSelector('workflows'),
    resourceSelector('currentUser'),
    collectionSelector,
    systemOptionsSelector,
    querySelector('deprecated'),
    querySelector('date'),
    settingsSelector,
    totalInstancesSelector,
  ],
  (
    workflows,
    user,
    collection,
    systemOptions,
    deprecated,
    date,
    settings,
    totalInstances
  ): Object => ({
    meta: workflows,
    user,
    workflows: collection,
    systemOptions,
    deprecated: deprecated === 'true',
    date,
    isTablet: settings.tablet,
    totalInstances,
  })
);

type Props = {
  workflows: Array<Object>,
  systemOptions: Array<Object>,
  location: Object,
  selected: string,
  onCSVClick: Function,
  paneId: string | number,
  openPane: Function,
  closePane: Function,
  fetch: Function,
  deprecated: boolean,
  selectedIds: Array<number>,
  date: string,
  unselectAll: Function,
  expanded: boolean,
  handleExpandClick: Function,
  toggleExpand: Function,
  sortData: Object,
  onSortChange: Function,
  canLoadMore: boolean,
  handleLoadMore: Function,
  handleLoadAll: Function,
  limit: number,
  isTablet: boolean,
  groupedStates: Object,
  infoTotalCount: number,
  infoEnabled: number,
  infoWithAlerts: number,
  totalInstances: Object,
  user: Object,
  searchQuery: string,
  changeSearchQuery: Function,
};

const Workflows: Function = ({
  selected,
  onCSVClick,
  expanded,
  location,
  selectedIds,
  workflows,
  paneId,
  openPane,
  deprecated,
  date,
  sortData,
  onSortChange,
  limit,
  canLoadMore,
  handleLoadMore,
  handleLoadAll,
  closePane,
  isTablet,
  totalInstances,
  searchQuery,
  changeSearchQuery,
}: Props): React.Element<any> => (
  <div>
    <Toolbar>
      <Breadcrumbs>
        <Crumb active> Workflows </Crumb>
      </Breadcrumbs>
      <div className="pull-right">
        <ButtonGroup marginRight={3}>
          <Button
            text="Export CSV"
            iconName="export"
            onClick={onCSVClick}
            big
          />
        </ButtonGroup>{' '}
        <Search
          defaultValue={searchQuery}
          onSearchUpdate={changeSearchQuery}
          resource="workflows"
        />
      </div>
    </Toolbar>
    <Box noPadding>
      <WorkflowsTable
        collection={workflows}
        paneId={paneId}
        openPane={openPane}
        closePane={closePane}
        states={ORDER_STATES}
        expanded={expanded}
        deprecated={deprecated}
        date={date}
        sortData={sortData}
        onSortChange={onSortChange}
        canLoadMore={canLoadMore}
        limit={limit}
        handleLoadMore={handleLoadMore}
        handleLoadAll={handleLoadAll}
        isTablet={isTablet}
        totalInstances={totalInstances}
        selected={selected}
        selectedIds={selectedIds}
        location={location}
      />
    </Box>
  </div>
);

export default compose(
  connect(
    viewSelector,
    {
      load: actions.workflows.fetch,
      fetch: actions.workflows.fetch,
      unsync: actions.workflows.unsync,
      unselectAll: actions.workflows.unselectAll,
    }
  ),
  withInfoBar('workflows'),
  withSort('workflows', 'workflows', sortDefaults.workflows),
  loadMore('workflows', 'workflows', true, 50),
  mapProps(
    ({ date, isTablet, user, ...rest }: Props): Object => ({
      isTablet: isTablet || user.data.storage.sidebarOpen,
      date: date || DATES.PREV_DAY,
      user,
      ...rest,
    })
  ),
  mapProps(
    ({ date, deprecated, ...rest }: Props): Object => ({
      fetchParams: { deprecated, date: formatDate(date).format() },
      date,
      deprecated,
      ...rest,
    })
  ),
  patch('load', ['fetchParams']),
  sync('meta'),
  withState('expanded', 'toggleExpand', false),
  mapProps(({ toggleExpand, isTablet, ...rest }: Props) => ({
    onToggleExpand: (): Function =>
      toggleExpand((val: boolean): boolean => !val),
    groupedStates: isTablet
      ? GROUPED_ORDER_STATES_COMPACT
      : GROUPED_ORDER_STATES,
    isTablet,
    ...rest,
  })),
  withHandlers({
    handleExpandClick: ({ onToggleExpand }: Object): Function => (): void => {
      onToggleExpand();
    },
  }),
  lifecycle({
    componentWillReceiveProps(nextProps: Props) {
      const { deprecated, date, unselectAll, fetch } = this.props;

      if (deprecated !== nextProps.deprecated || date !== nextProps.date) {
        unselectAll();
        fetch(nextProps.fetchParams);
      }
    },
  }),
  withPane(
    WorkflowsDetail,
    ['errors', 'systemOptions', 'globalErrors', 'location', 'fetchParams'],
    'detail',
    'workflows'
  ),
  selectable('workflows'),
  withCSV('workflows', 'workflows'),
  titleManager('Workflows'),
  queryControl('search'),
  pure([
    'sortData',
    'expanded',
    'workflows',
    'systemOptions',
    'selected',
    'selectedIds',
    'paneId',
    'deprecated',
    'date',
    'canLoadMore',
    'isTablet',
    'withAlertsCount',
    'totalInstances',
  ]),
  unsync()
)(Workflows);
