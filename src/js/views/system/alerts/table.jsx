// @flow
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flowRight } from 'lodash';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import {
  Table,
  Tbody,
  Thead,
  Th,
  FixedRow,
} from '../../../components/new_table';
import withSort from '../../../hocomponents/sort';
import withLoadMore from '../../../hocomponents/loadMore';
import sync from '../../../hocomponents/sync';
import withPane from '../../../hocomponents/pane';
import actions from '../../../store/api/actions';
import { sortDefaults } from '../../../constants/sort';
import { findBy } from '../../../helpers/search';
import { resourceSelector } from '../../../selectors';
import AlertsPane from './pane';
import AlertRow from './row';
import NoDataIf from '../../../components/NoDataIf';
import LoadMore from '../../../components/LoadMore';
import titleManager from '../../../hocomponents/TitleManager';
import Pull from '../../../components/Pull';
import { NameColumnHeader } from '../../../components/NameColumn';

type Props = {
  type: string,
  params: Object,
  sortData: Object,
  onSortChange: Function,
  alerts: Array<Object>,
  canLoadMore?: boolean,
  handleLoadMore: Function,
  handleLoadAll: Function,
  openPane: Function,
  closePane: Function,
  paneId: string,
  location: Object,
  limit: number,
};

const AlertsTable: Function = ({
  sortData,
  onSortChange,
  alerts,
  canLoadMore,
  handleLoadMore,
  handleLoadAll,
  openPane,
  closePane,
  paneId,
  type,
  limit,
}: Props): React.Element<any> => (
  <div>
    <NoDataIf condition={alerts.length === 0}>
      <Table
        fixed
        hover
        striped
        key={`${type}-${alerts.length}`}
        className="clear"
      >
        <Thead>
          {canLoadMore && (
            <FixedRow className="toolbar-row">
              <Th>
                <Pull right>
                  <LoadMore
                    canLoadMore={canLoadMore}
                    handleLoadMore={handleLoadMore}
                    handleLoadAll={handleLoadAll}
                    limit={limit}
                  />
                </Pull>
              </Th>
            </FixedRow>
          )}
          <FixedRow sortData={sortData} onSortChange={onSortChange}>
            <Th className="text big" name="type">
              Type
            </Th>
            <Th className="text alerts-large" name="alert">
              Alert
            </Th>
            <NameColumnHeader name="object" title="Object" />
            <Th className="big" name="when">
              When
            </Th>
          </FixedRow>
        </Thead>
        <Tbody>
          {alerts.map(
            (alert: Object, index: number): React.Element<any> => (
              <AlertRow
                first={index === 0}
                key={`alert_${alert.alert}_${alert.name}_${alert.alertid}`}
                openPane={openPane}
                closePane={closePane}
                isActive={paneId === `${alert.type}:${alert.id}`}
                {...alert}
              />
            )
          )}
        </Tbody>
      </Table>
    </NoDataIf>
  </div>
);

const filterCollection: Function = (type: string): Function => (
  alerts: Array<Object>
): Array<Object> =>
  alerts.filter(
    (alert: Object): boolean => alert.alerttype.toLowerCase() === type
  );

const searchCollection: Function = (query: string): Function => (
  collection: Array<Object>
): Array<Object> => findBy(['alerttype', 'alert', 'name'], query, collection);

const collectionSelector = createSelector(
  [
    resourceSelector('alerts'),
    (state, props) => props.type,
    (state, props) => props.location.query[`${props.type}Search`],
  ],
  (alerts, type, search) =>
    flowRight(
      filterCollection(type),
      searchCollection(search)
    )(alerts.data)
);

const viewSelector = createSelector(
  [resourceSelector('alerts'), collectionSelector],
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
  withSort(({ type }: Props): string => type, 'alerts', sortDefaults.alerts),
  withLoadMore('alerts', 'alerts', true, 50),
  sync('meta'),
  withPane(AlertsPane, null, null, 'alerts'),
  titleManager(({ type }): string => `Alerts ${type}`),
  pure(['alerts', 'location', 'paneId', 'canLoadMore', 'sortData'])
)(AlertsTable);
