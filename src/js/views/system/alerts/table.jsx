// @flow
import React from 'react';
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
import withPane from '../../../hocomponents/pane';
import { sortDefaults } from '../../../constants/sort';
import { findBy } from '../../../helpers/search';
import AlertsPane from './pane';
import AlertRow from './row';
import LoadMore from '../../../components/LoadMore';
import titleManager from '../../../hocomponents/TitleManager';
import Pull from '../../../components/Pull';
import { NameColumnHeader } from '../../../components/NameColumn';
import mapProps from 'recompose/mapProps';
import Flex from '../../../components/Flex';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';

type Props = {
  params: Object,
  sortData: Object,
  onSortChange: Function,
  alerts: Array<Object>,
  canLoadMore?: boolean,
  handleLoadMore: Function,
  handleLoadAll: Function,
  loadMoreCurrent: number,
  loadMoreTotal: number,
  openPane: Function,
  closePane: Function,
  paneId: string,
  location: Object,
  limit: number,
  query: string,
};

const AlertsTable: Function = ({
  sortData,
  onSortChange,
  alerts,
  canLoadMore,
  handleLoadMore,
  handleLoadAll,
  loadMoreCurrent,
  loadMoreTotal,
  openPane,
  closePane,
  paneId,
  limit,
}: Props): React.Element<any> => (
  <Flex>
    <Table fixed hover striped condensed>
      <Thead>
        {canLoadMore && (
          <FixedRow className="toolbar-row">
            <Th>
              <Pull right>
                <LoadMore
                  canLoadMore={canLoadMore}
                  handleLoadMore={handleLoadMore}
                  handleLoadAll={handleLoadAll}
                  currentCount={loadMoreCurrent}
                  total={loadMoreTotal}
                  limit={limit}
                />
              </Pull>
            </Th>
          </FixedRow>
        )}
        <FixedRow sortData={sortData} onSortChange={onSortChange}>
          <Th icon="numbered-list" name="alertid">
            ID
          </Th>
          <NameColumnHeader
            name="name"
            title="Object name"
            icon="intersection"
          />
          <Th className="text" name="type" icon="application">
            Interface
          </Th>
          <Th className="text" name="alert" icon="warning-sign">
            Alert
          </Th>
          <Th name="when" icon="time">
            When
          </Th>
        </FixedRow>
      </Thead>
      <DataOrEmptyTable condition={!alerts || alerts.length === 0} cols={5}>
        {props => (
          <Tbody {...props}>
            {alerts.map(
              (alert: Object, index: number): React.Element<any> => (
                <AlertRow
                  first={index === 0}
                  key={alert.alertid}
                  openPane={openPane}
                  closePane={closePane}
                  isActive={parseInt(paneId, 10) === alert.alertid}
                  {...alert}
                />
              )
            )}
          </Tbody>
        )}
      </DataOrEmptyTable>
    </Table>
  </Flex>
);

export default compose(
  mapProps(
    ({ alerts, query, ...rest }: Props): Props => ({
      alerts: findBy(['alerttype', 'alert', 'name'], query, alerts),
      query,
      ...rest,
    })
  ),
  withSort(({ type }: Props): string => type, 'alerts', sortDefaults.alerts),
  withLoadMore('alerts', 'alerts', true, 50),
  withPane(AlertsPane, null, null, 'alerts'),
  titleManager(({ type }): string => `Alerts ${type}`),
  pure(['alerts', 'location', 'paneId', 'canLoadMore', 'sortData'])
)(AlertsTable);
