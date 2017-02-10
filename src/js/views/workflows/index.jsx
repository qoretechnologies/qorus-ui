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

import withPane from '../../hocomponents/pane';
import sync from '../../hocomponents/sync';
import patch from '../../hocomponents/patchFuncArgs';
import selectable from '../../hocomponents/selectable';
import unsync from '../../hocomponents/unsync';
import withCSV from '../../hocomponents/csv';
import loadMore from '../../hocomponents/loadMore';
import actions from '../../store/api/actions';
import WorkflowsToolbar from './toolbar';
import WorkflowsTable from './table';
import WorkflowsDetail from './detail';
import { DATES } from '../../constants/dates';
import { ORDER_STATES, ORDER_GROUPS, GROUPED_ORDER_STATES } from '../../constants/orders';
import { formatDate } from '../../helpers/workflows';
import { findBy } from '../../helpers/search';
import { querySelector, resourceSelector } from '../../selectors';
import withSort from '../../hocomponents/sort';
import { sortDefaults } from '../../constants/sort';
import { Control } from '../../components/controls';

const filterSearch: Function = (search: string): Function =>
  (workflows: Array<Object>): Array<Object> => (
    findBy(['name', 'id'], search, workflows)
  );

const filterRunning: Function = (running: string): Function =>
  (workflows: Array<Object>): Array<Object> => (
    running === 'true' ? workflows.filter(w => (
      w.exec_count > 0
    )) : workflows
  );

const filterLastVersion: Function = (latest: string): Function =>
  (workflows: Array<Object>): Array<Object> => (
    latest && latest !== '' ? workflows.filter(w => {
      for (const workflow of workflows) {
        if (w.name === workflow.name && parseFloat(w.version) < parseFloat(workflow.version)) {
          return false;
        }
      }

      return true;
    }) : workflows
  );

const filterDeprecated: Function = (deprecated: string): Function =>
  (workflows: Array<Object>): Array<Object> => (
    deprecated && deprecated !== '' ? workflows : workflows.filter(w => !w.deprecated)
  );

const systemOptionsSelector: Function = (state: Object): Array<Object> => (
  state.api.systemOptions.data.filter((opt: Object): boolean => opt.workflow)
);

const groupStatuses: Function = (): Function => (workflows: Array<Object>): Array<Object> => (
  workflows.map((workflow: Object): Object => {
    const newWf: Object = { ...workflow };
    Object.keys(ORDER_GROUPS).forEach((group: string): void => {
      newWf[`GROUPED_${group}`] = ORDER_GROUPS[group].reduce((cnt, cur) => (
        cnt + workflow[cur]
      ), 0);
      newWf[`GROUPED_${group}_STATES`] = ORDER_GROUPS[group].map((orderGrp) => (
        ORDER_STATES.find((grp) => grp.name === orderGrp).title)
      ).join(',');
    });

    return newWf;
  })
);

const collectionSelector: Function = createSelector(
  [
    querySelector('search'),
    querySelector('running'),
    querySelector('latest'),
    querySelector('deprecated'),
    resourceSelector('workflows'),
  ],
  (search, running, latest, deprecated, workflows) => flowRight(
    filterLastVersion(latest),
    filterRunning(running),
    filterSearch(search),
    filterDeprecated(deprecated),
    groupStatuses(),
  )(workflows.data)
);

const viewSelector = createSelector(
  [
    resourceSelector('workflows'),
    collectionSelector,
    systemOptionsSelector,
    querySelector('deprecated'),
    querySelector('date'),
  ],
  (workflows, collection, systemOptions, deprecated, date) => ({
    meta: workflows,
    workflows: collection,
    systemOptions,
    deprecated: deprecated === 'true',
    date,
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
  limit: number,
};

const Workflows: Function = ({
  selected,
  onCSVClick,
  expanded,
  handleExpandClick,
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
}: Props): React.Element<any> => (
  <div>
    <WorkflowsToolbar
      selected={selected}
      onCSVClick={onCSVClick}
      expanded={expanded}
      onToggleStatesClick={handleExpandClick}
      location={location}
      selectedIds={selectedIds}
    />
    <WorkflowsTable
      collection={workflows}
      paneId={paneId}
      openPane={openPane}
      states={expanded ? ORDER_STATES : GROUPED_ORDER_STATES}
      expanded={expanded}
      deprecated={deprecated}
      date={date}
      sortData={sortData}
      onSortChange={onSortChange}
      canLoadMore={canLoadMore}
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
  withSort('workflows', 'workflows', sortDefaults.workflows),
  loadMore('workflows', 'workflows', true, 50),
  mapProps(({ date, ...rest }: Props): Object => ({
    date: date || DATES.PREV_DAY,
    ...rest,
  })),
  mapProps(({ date, deprecated, ...rest }: Props): Object => ({
    fetchParams: { deprecated, date: formatDate(date).format() },
    date,
    deprecated,
    ...rest,
  })),
  patch('load', ['fetchParams']),
  sync('meta'),
  withState('expanded', 'toggleExpand', false),
  mapProps(({ toggleExpand, ...rest }: Props) => ({
    onToggleExpand: (): Function => toggleExpand((val: boolean): boolean => !val),
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
    [
      'errors',
      'systemOptions',
      'globalErrors',
      'location',
    ],
    'detail'
  ),
  selectable('workflows'),
  withCSV('workflows', 'workflows'),
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
  ]),
  unsync()
)(Workflows);
