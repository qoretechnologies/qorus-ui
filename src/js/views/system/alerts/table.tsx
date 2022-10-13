import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import Flex from '../../../components/Flex';
import LoadMore from '../../../components/LoadMore';
import { NameColumnHeader } from '../../../components/NameColumn';
import { FixedRow, Table, Tbody, Th, Thead } from '../../../components/new_table';
import Pull from '../../../components/Pull';
import { sortDefaults } from '../../../constants/sort';
import { findBy } from '../../../helpers/search';
import withLoadMore from '../../../hocomponents/loadMore';
import withPane from '../../../hocomponents/pane';
import withSort from '../../../hocomponents/sort';
import titleManager from '../../../hocomponents/TitleManager';
import AlertsPane from './pane';
import AlertRow from './row';

type Props = {
  params: any;
  sortData: any;
  onSortChange: Function;
  alerts: Array<Object>;
  canLoadMore?: boolean;
  handleLoadMore: Function;
  handleLoadAll: Function;
  loadMoreCurrent: number;
  loadMoreTotal: number;
  openPane: Function;
  closePane: Function;
  paneId: string;
  location: any;
  limit: number;
  query: string;
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
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Flex>
    <Table fixed hover striped condensed id="alerts-view">
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
          <NameColumnHeader name="name" title="Object name" icon="intersection" />
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
        {(props) => (
          <Tbody {...props}>
            {alerts.map(
              // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
              (alert: any, index: number) => (
                <AlertRow
                  first={index === 0}
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'alertid' does not exist on type 'Object'... Remove this comment to see the full error message
                  key={alert.alertid}
                  openPane={openPane}
                  closePane={closePane}
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'alertid' does not exist on type 'Object'... Remove this comment to see the full error message
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
  // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Props'.
  withSort(({ type }: Props): string => type, 'alerts', sortDefaults.alerts),
  withLoadMore('alerts', 'alerts', true, 50),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 4.
  withPane(AlertsPane, null, null, 'alerts'),
  // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
  titleManager(({ type }): string => `Alerts ${type}`),
  pure(['alerts', 'location', 'paneId', 'canLoadMore', 'sortData'])
)(AlertsTable);
