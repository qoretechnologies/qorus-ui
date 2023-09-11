// @flow
import { ReqoreControlGroup } from '@qoretechnologies/reqore';
import { flowRight } from 'lodash';
import size from 'lodash/size';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { createSelector } from 'reselect';
import CsvControl from '../../components/CsvControl';
import Flex from '../../components/Flex';
import Box from '../../components/box';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import { DATES } from '../../constants/dates';
import {
  GROUPED_ORDER_STATES,
  GROUPED_ORDER_STATES_COMPACT,
  ORDER_GROUPS,
  ORDER_GROUPS_COMPACT,
  ORDER_STATES,
} from '../../constants/orders';
import { sortDefaults } from '../../constants/sort';
import Search from '../../containers/search';
import { formatCount } from '../../helpers/orders';
import { findBy } from '../../helpers/search';
import { formatDate } from '../../helpers/workflows';
import titleManager from '../../hocomponents/TitleManager';
import withCSV from '../../hocomponents/csv';
import hasInterfaceAccess from '../../hocomponents/hasInterfaceAccess';
import loadMore from '../../hocomponents/loadMore';
import withPane from '../../hocomponents/pane';
import patch from '../../hocomponents/patchFuncArgs';
import queryControl from '../../hocomponents/queryControl';
import selectable from '../../hocomponents/selectable';
import withSort from '../../hocomponents/sort';
import sync from '../../hocomponents/sync';
import unsync from '../../hocomponents/unsync';
import withInfoBar from '../../hocomponents/withInfoBar';
import { querySelector, resourceSelector } from '../../selectors';
import actions from '../../store/api/actions';
import WorkflowsDetail from './pane';
import WorkflowsTable from './table';

const filterSearch: Function =
  (search: string): Function =>
  (workflows: Array<Object>): Array<Object> =>
    findBy(['name', 'id'], search, workflows);

const filterRunning: Function =
  (running: string): Function =>
  (workflows: Array<Object>): Array<Object> =>
    // @ts-ignore ts-migrate(2339) FIXME: Property 'exec_count' does not exist on type 'Obje... Remove this comment to see the full error message
    running === 'true' ? workflows.filter((w) => w.exec_count > 0) : workflows;

const filterLastVersion: Function =
  (latest: string): Function =>
  (workflows: Array<Object>): Array<Object> =>
    latest && latest !== ''
      ? workflows.filter((w) => {
          for (const workflow of workflows) {
            if (
              // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
              w.name === workflow.name &&
              // @ts-ignore ts-migrate(2339) FIXME: Property 'version' does not exist on type 'Object'... Remove this comment to see the full error message
              parseFloat(w.version) < parseFloat(workflow.version)
            ) {
              return false;
            }
          }

          return true;
        })
      : workflows;

const filterDeprecated: Function =
  (deprecated: string): Function =>
  (workflows: Array<Object>): Array<Object> =>
    deprecated && deprecated !== ''
      ? workflows
      : // @ts-ignore ts-migrate(2339) FIXME: Property 'deprecated' does not exist on type 'Obje... Remove this comment to see the full error message
        workflows.filter((w) => !w.deprecated);

const systemOptionsSelector: Function = (state: any): Array<Object> =>
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  state.api.systemOptions.data.filter((opt: any): boolean => opt.workflow);

const groupStatuses: Function =
  (isTablet: boolean): Function =>
  (workflows: Array<Object>): Array<Object> =>
    workflows.map((workflow: any): any => {
      const newWf: any = { ...workflow };
      const obj = isTablet ? ORDER_GROUPS_COMPACT : ORDER_GROUPS;

      Object.keys(obj).forEach((group: string): void => {
        newWf[`GROUPED_${group}`] = obj[group].reduce((cnt, cur) => cnt + workflow[cur], 0);
        newWf[`GROUPED_${group}_STATES`] = obj[group]
          .map((orderGrp) => ORDER_STATES.find((grp) => grp.name === orderGrp).title)
          .join(',');
      });

      return newWf;
    });

const countInstances: Function =
  (isTablet: boolean): Function =>
  (workflows: Array<Object>): any => {
    const count: any = { total: 0 };
    const addCount: Function = (group, addPrefix) => {
      const grp = addPrefix ? `GROUPED_${group}` : group;

      if (!count[grp]) count[grp] = 0;

      workflows.forEach((workflow: any): void => {
        count[grp] += workflow[grp];
      });

      // @ts-ignore ts-migrate(2339) FIXME: Property 'total' does not exist on type 'Object'.
      if (addPrefix) count.total += count[grp];

      count[grp] = formatCount(count[grp]);
    };

    if (isTablet) {
      Object.keys(ORDER_GROUPS_COMPACT).forEach((group) => addCount(group, true));
    } else {
      Object.keys(ORDER_GROUPS).forEach((group) => addCount(group, true));
    }

    ORDER_STATES.forEach((state: any): void => {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      addCount(state.name);
    });

    // @ts-ignore ts-migrate(2339) FIXME: Property 'total' does not exist on type 'Object'.
    count.total = formatCount(count.total);

    return count;
  };

// @ts-ignore ts-migrate(2339) FIXME: Property 'ui' does not exist on type 'Object'.
const settingsSelector = (state: any): any => state.ui.settings;

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
      // @ts-ignore ts-migrate(2339) FIXME: Property 'tablet' does not exist on type 'Object'.
      groupStatuses(settings.tablet)
    )(workflows.data)
);

// @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
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
  ): any => ({
    meta: workflows,
    user,
    workflows: collection,
    systemOptions,
    deprecated: deprecated === 'true',
    date,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'tablet' does not exist on type 'Object'.
    isTablet: settings.tablet,
    totalInstances,
  })
);

type Props = {
  workflows: Array<Object>;
  systemOptions: Array<Object>;
  location: any;
  selected: string;
  onCSVClick: Function;
  paneId: string | number;
  openPane: Function;
  closePane: Function;
  fetch: Function;
  deprecated: boolean;
  selectedIds: Array<number>;
  date: string;
  unselectAll: Function;
  expanded: boolean;
  handleExpandClick: Function;
  toggleExpand: Function;
  sortData: any;
  onSortChange: Function;
  canLoadMore: boolean;
  handleLoadMore: Function;
  handleLoadAll: Function;
  loadMoreCurrent: number;
  loadMoreTotal: number;
  limit: number;
  isTablet: boolean;
  groupedStates: any;
  infoTotalCount: number;
  infoEnabled: number;
  infoWithAlerts: number;
  totalInstances: any;
  user: any;
  searchQuery: string;
  changeSearchQuery: Function;
  sortKeysObj: any;
  band: string;
  changeDispositionQuery: Function;
};

const Workflows: Function = ({
  sortKeysObj,
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
  loadMoreCurrent,
  loadMoreTotal,
  closePane,
  isTablet,
  totalInstances,
  searchQuery,
  changeSearchQuery,
  band,
  changeDispositionQuery,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Flex>
    <Breadcrumbs>
      <Crumb active>
        <FormattedMessage id="Workflows" />
      </Crumb>
      <ReqoreControlGroup fixed style={{ marginLeft: 'auto' }}>
        <CsvControl onClick={onCSVClick} disabled={size(workflows) === 0} />
        <Search
          defaultValue={searchQuery}
          onSearchUpdate={changeSearchQuery}
          resource="workflows"
          focusOnMount
        />
      </ReqoreControlGroup>
    </Breadcrumbs>

    <Box top noPadding fill>
      <WorkflowsTable
        sortKeysObj={sortKeysObj}
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
        loadMoreCurrent={loadMoreCurrent}
        loadMoreTotal={loadMoreTotal}
        isTablet={isTablet}
        totalInstances={totalInstances}
        selected={selected}
        selectedIds={selectedIds}
        location={location}
        band={band}
        changeDispositionQuery={changeDispositionQuery}
      />
    </Box>
  </Flex>
);

export default compose(
  hasInterfaceAccess('workflows', 'Workflows'),
  connect(viewSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
    load: actions.workflows.fetch,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
    fetch: actions.workflows.fetch,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
    unsync: actions.workflows.unsync,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
    unselectAll: actions.workflows.unselectAll,
  }),
  mapProps(({ date, isTablet, user, ...rest }: Props): any => ({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    isTablet: isTablet || user.data.storage.sidebarOpen,
    date: date || DATES.PREV_DAY,
    user,
    ...rest,
  })),
  mapProps(({ date, deprecated, ...rest }: Props): any => ({
    fetchParams: { deprecated, date: formatDate(date).format() },
    date,
    deprecated,
    ...rest,
  })),
  patch('load', ['fetchParams']),
  sync('meta'),
  withInfoBar('workflows'),
  withSort('workflows', 'workflows', sortDefaults.workflows),
  loadMore('workflows', 'workflows', true, 50),
  withState('expanded', 'toggleExpand', false),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('disposition'),
  // @ts-ignore ts-migrate(2339) FIXME: Property 'dispositionQuery' does not exist on type... Remove this comment to see the full error message
  mapProps(({ toggleExpand, isTablet, dispositionQuery, ...rest }: Props) => ({
    onToggleExpand: (): Function => toggleExpand((val: boolean): boolean => !val),
    groupedStates: isTablet ? GROUPED_ORDER_STATES_COMPACT : GROUPED_ORDER_STATES,
    isTablet,
    band: dispositionQuery || '24 hour band',
    ...rest,
  })),
  withHandlers({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'onToggleExpand' does not exist on type '... Remove this comment to see the full error message
    handleExpandClick:
      ({ onToggleExpand }: any): Function =>
      (): void => {
        onToggleExpand();
      },
  }),
  lifecycle({
    componentWillReceiveProps(nextProps: Props) {
      const { deprecated, date, unselectAll, fetch } = this.props;

      if (deprecated !== nextProps.deprecated || date !== nextProps.date) {
        unselectAll();
        // @ts-ignore ts-migrate(2339) FIXME: Property 'fetchParams' does not exist on type 'Pro... Remove this comment to see the full error message
        fetch(nextProps.fetchParams);
      }
    },
  }),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 4.
  withPane(
    WorkflowsDetail,
    ['errors', 'systemOptions', 'globalErrors', 'location', 'fetchParams', 'band'],
    'detail',
    'workflows'
  ),
  selectable('workflows'),
  withCSV('workflows', 'workflows'),
  titleManager('Workflows'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
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
    'dispositionQuery',
  ]),
  unsync()
)(Workflows);
