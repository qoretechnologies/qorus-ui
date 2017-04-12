// @flow
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flowRight } from 'lodash';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';

import { Table, Tbody, Thead, Tr, Th } from '../../../components/new_table';
import { Control as Button } from '../../../components/controls';
import withSort from '../../../hocomponents/sort';
import withLoadMore from '../../../hocomponents/loadMore';
import sync from '../../../hocomponents/sync';
import withPane from '../../../hocomponents/pane';
import actions from '../../../store/api/actions';
import { sortDefaults } from '../../../constants/sort';
import { findBy } from '../../../helpers/search';
import { querySelector, paramSelector, resourceSelector } from '../../../selectors';
import AlertsPane from './pane';
import AlertRow from './row';
import AlertsToolbar from './toolbar';
import Icon from '../../../components/icon';

type Props = {
  type: string,
  params: Object,
  sortData: Object,
  onSortChange: Function,
  alerts: Array<Object>,
  canLoadMore?: boolean,
  handleLoadMore: Function,
  openPane: Function,
  paneId: string,
  location: Object,
}

const AlertsTable: Function = ({
  sortData,
  onSortChange,
  alerts,
  canLoadMore,
  handleLoadMore,
  openPane,
  paneId,
  location,
  type,
}: Props): React.Element<any> => (
  <div>
    <AlertsToolbar location={location} />
    <Table
      fixed
      hover
      striped
      marginBottom={canLoadMore ? 60 : 0}
      key={type}
    >
      <Thead>
        <Tr
          sortData={sortData}
          onSortChange={onSortChange}
        >
          <Th className="tiny">
            <Icon icon="warning" />
          </Th>
          <Th className="narrow">-</Th>
          <Th className="text" name="type">Type</Th>
          <Th className="text" name="alert">Alert</Th>
          <Th className="name" name="object">Object</Th>
          <Th className="big" name="when">When</Th>
        </Tr>
      </Thead>
      <Tbody>
        {alerts.map((alert: Object): React.Element<any> => (
          <AlertRow
            key={`alert_${alert.alert}_${alert.name}_${alert.alertid}`}
            openPane={openPane}
            isActive={paneId === `${alert.type}:${alert.id}`}
            {...alert}
          />
        ))}
      </Tbody>
    </Table>
    {canLoadMore && (
      <Button
        label="Load 50 more..."
        btnStyle="success"
        big
        onClick={handleLoadMore}
      />
    )}
  </div>
);

const filterCollection: Function = (
  type: string
): Function => (alerts: Array<Object>): Array<Object> => (
  alerts.filter((alert: Object): boolean => alert.alerttype.toLowerCase() === type)
);

const searchCollection: Function = (
  query: string
): Function => (
  collection: Array<Object>
): Array<Object> => (
  findBy(['alerttype', 'alert', 'name'], query, collection)
);

const collectionSelector = createSelector(
  [
    resourceSelector('alerts'),
    paramSelector('type'),
    querySelector('search'),
  ], (alerts, type, search) => flowRight(
    filterCollection(type),
    searchCollection(search)
  )(alerts.data)
);

const viewSelector = createSelector(
  [
    resourceSelector('alerts'),
    collectionSelector,
  ],
  (meta, alerts) => ({
    meta,
    alerts,
  })
);

export default compose(
  connect(
    viewSelector,
    {
      load: actions.alerts.fetch,
    }
  ),
  mapProps(({ params, ...rest }: Props): Props => ({
    type: params.type,
    params,
    ...rest,
  })),
  withSort(
    ({ type }: Props): string => type,
    'alerts',
    sortDefaults.alerts
  ),
  withLoadMore('alerts', 'alerts', true, 50),
  sync('meta'),
  withPane(AlertsPane, null, null, 'alerts'),
  pure([
    'alerts',
    'location',
    'paneId',
  ])
)(AlertsTable);
