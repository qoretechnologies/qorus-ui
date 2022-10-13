/* @flow */
import size from 'lodash/size';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { ActionColumnHeader } from '../../components/ActionColumn';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import DatePicker from '../../components/datepicker';
import { IdColumnHeader } from '../../components/IdColumn';
import LoadMore from '../../components/LoadMore';
import { NameColumnHeader } from '../../components/NameColumn';
import { FixedRow, Table, Tbody, Th, Thead } from '../../components/new_table';
import Pull from '../../components/Pull';
import { SelectColumnHeader } from '../../components/SelectColumn';
import SortingDropdown from '../../components/SortingDropdown';
import { DATE_FORMATS } from '../../constants/dates';
import queryControl from '../../hocomponents/queryControl';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';
import Row from './row';
import Actions from './toolbar/actions';
import Selector from './toolbar/selector';

type Props = {
  sortData: any;
  sortKeys: any;
  onSortChange: Function;
  collection: Array<Object>;
  paneId?: number;
  openPane: Function;
  closePane: Function;
  date: string;
  select: Function;
  updateDone: Function;
  canLoadMore: boolean;
  isTablet: boolean;
  handleLoadMore: Function;
  handleLoadAll: Function;
  limit: number;
  selected: string;
  selectedIds: Array<number>;
  dateQuery: string;
  changeDateQuery: Function;
  handleExpiryChange: Function;
  dispatchAction: Function;
  loadMoreCurrent: number;
  loadMoreTotal: number;
};

const JobsTable: Function = ({
  sortData,
  sortKeys,
  onSortChange,
  collection,
  paneId,
  openPane,
  closePane,
  date,
  select,
  updateDone,
  canLoadMore,
  isTablet,
  selected,
  selectedIds,
  limit,
  handleLoadMore,
  handleLoadAll,
  loadMoreCurrent,
  loadMoreTotal,
  dateQuery,
  changeDateQuery,
  handleExpiryChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Table striped hover condensed fixed id="jobs-view">
    <Thead>
      <FixedRow className="toolbar-row">
        <Th colspan={isTablet ? 6 : 7}>
          <Pull>
            <Selector
              selected={selected}
              selectedCount={selectedIds.length}
              disabled={size(collection) === 0}
            />
            <Actions selectedIds={selectedIds} show={selected !== 'none'} />
            <SortingDropdown onSortChange={onSortChange} sortData={sortData} sortKeys={sortKeys} />
          </Pull>
          <Pull right>
            <LoadMore
              handleLoadAll={handleLoadAll}
              handleLoadMore={handleLoadMore}
              limit={limit}
              currentCount={loadMoreCurrent}
              total={loadMoreTotal}
              canLoadMore={canLoadMore}
            />
          </Pull>
        </Th>
        <Th className="separated-cell">
          {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
          <DatePicker date={dateQuery || '24h'} onApplyDate={changeDateQuery} />
        </Th>
      </FixedRow>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <SelectColumnHeader />
        <IdColumnHeader />
        <NameColumnHeader />
        <ActionColumnHeader />
        <Th name="last_executed" icon="calendar">
          <FormattedMessage id="table.last-run" />
        </Th>
        <Th name="next" icon="calendar">
          <FormattedMessage id="table.next-run" />
        </Th>
        {!isTablet && (
          <Th name="expiry_date" icon="outdated">
            <FormattedMessage id="table.expiry-date" />
          </Th>
        )}
        <Th className="separated-cell" icon="grid">
          <FormattedMessage id="table.instances" />
        </Th>
      </FixedRow>
    </Thead>
    <DataOrEmptyTable condition={size(collection) === 0} cols={isTablet ? 7 : 8}>
      {(props) => (
        <Tbody {...props}>
          {/* @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message */}
          {collection.map((job: any, index: number) => (
            <Row
              first={index === 0}
              // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
              key={`job_${job.id}`}
              // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
              isActive={job.id === parseInt(paneId, 10)}
              openPane={openPane}
              closePane={closePane}
              date={date}
              select={select}
              updateDone={updateDone}
              PROGRESS={job['IN-PROGRESS']}
              isTablet={isTablet}
              onExpiryChange={handleExpiryChange}
              {...job}
            />
          ))}
        </Tbody>
      )}
    </DataOrEmptyTable>
  </Table>
);

export default compose(
  connect(null, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
    updateDone: actions.jobs.updateDone,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
    select: actions.jobs.select,
  }),
  withDispatch(),
  withHandlers({
    handleExpiryChange:
      ({ dispatchAction }: Props): Function =>
      (date: any, id: number, onClose: Function): void => {
        const formatedDate: string = moment(date, DATE_FORMATS.PROP).format(DATE_FORMATS.PROP);

        // @ts-ignore ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
        dispatchAction(actions.jobs.expire, id, formatedDate, onClose);
      },
  }),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('date'),
  pure([
    'sortData',
    'collection',
    'paneId',
    'date',
    'isTablet',
    'dateQuery',
    'selected',
    'selectedIds',
    'canLoadMore',
  ]),
  injectIntl
)(JobsTable);
