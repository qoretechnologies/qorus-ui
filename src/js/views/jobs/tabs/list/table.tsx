/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import {
  Table,
  Thead,
  Tbody,
  FixedRow,
  Th,
} from '../../../../components/new_table';
import InstanceRow from './row';
import queryControl from '../../../../hocomponents/queryControl';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import actions from '../../../../store/api/actions';
import Pull from '../../../../components/Pull';
import LoadMore from '../../../../components/LoadMore';
import CsvControl from '../../../../components/CsvControl';
import DatePicker from '../../../../components/datepicker';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Controls as ButtonGroup } from '../../../../components/controls';
import Filters from '../../../workflows/tabs/list/toolbar/filters';
import { JOB_STATES } from '../../../../constants/jobs';
import DataOrEmptyTable from '../../../../components/DataOrEmptyTable';
import InstancesBar from '../../../../components/instances_bar';
import { NameColumnHeader } from '../../../../components/NameColumn';
import { DateColumnHeader } from '../../../../components/DateColumn';
import { getInstancesCountByFilters } from '../../../../helpers/interfaces';

type Props = {
  collection: Array<Object>,
  sortData: Object,
  onSortChange: Function,
  jobQuery: string | number,
  changeJobQuery: Function,
  handleHeaderClick: Function,
  sort: Function,
  canLoadMore: Function,
  onLoadMore: Function,
  loadMoreCurrent: number,
  limit: number,
  onCSVClick: Function,
  dateQuery: string,
  changeDateQuery: Function,
  job: Object,
  filter: string,
};

const ResultTable = ({
  collection = [],
  sortData,
  onSortChange,
  jobQuery,
  changeJobQuery,
  handleHeaderClick,
  canLoadMore,
  onLoadMore,
  loadMoreCurrent,
  limit,
  onCSVClick,
  dateQuery = '24h',
  changeDateQuery,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'COMPLETE' does not exist on type 'Object... Remove this comment to see the full error message
  job: { COMPLETE = 0, ERROR = 0, PROGRESS = 0, CRASHED = 0, id, ...jobRest },
  filter,
}: Props) => (
  <Table fixed condensed hover striped>
    <Thead>
      <FixedRow className="toolbar-row">
        <Th colspan="full">
          <Pull>
            <CsvControl
              onClick={onCSVClick}
              disabled={size(collection) === 0}
            />
          </Pull>
          <Pull right>
            <LoadMore
              canLoadMore={canLoadMore}
              handleLoadMore={onLoadMore}
              currentCount={loadMoreCurrent}
              total={
                filter
                  ? getInstancesCountByFilters(filter.split(','), {
                    COMPLETE,
                    ERROR,
                    'IN-PROGRESS': jobRest['IN-PROGRESS'] || 0,
                    CRASHED,
                  })
                  : COMPLETE + ERROR + (jobRest['IN-PROGRESS'] || 0) + CRASHED
              }
              limit={limit}
            />
            <ButtonGroup>
              { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
              <DatePicker date={dateQuery} onApplyDate={changeDateQuery} />
            </ButtonGroup>
            <Filters items={JOB_STATES} />
            <InstancesBar
              states={[
                { name: 'COMPLETE', label: 'complete', title: 'Complete' },
                { name: 'ERROR', label: 'error', title: 'Error' },
                { name: 'IN-PROGRESS', label: 'waiting', title: 'In-progress' },
                { name: 'CRASHED', label: 'blocked', title: 'Crashed' },
              ]}
              instances={{
                COMPLETE,
                ERROR,
                'IN-PROGRESS': jobRest['IN-PROGRESS'] || 0,
                CRASHED,
              }}
              type="job"
              totalInstances={
                COMPLETE + ERROR + (jobRest['IN-PROGRESS'] || 0) + CRASHED
              }
              id={id}
              date={dateQuery}
              wrapperWidth={300}
              big
            />
          </Pull>
        </Th>
      </FixedRow>
      <FixedRow onSortChange={onSortChange} sortData={sortData}>
        <NameColumnHeader title="Instance ID" name="job_instanceid" />
        <Th name="jobstatus" icon="info-sign">
          Status
        </Th>
        <DateColumnHeader name="started">Started</DateColumnHeader>
        <DateColumnHeader name="modified">Modified</DateColumnHeader>
        <DateColumnHeader name="completed" onClick={handleHeaderClick}>
          Completed
        </DateColumnHeader>
      </FixedRow>
    </Thead>
    <DataOrEmptyTable cols={5} condition={collection.length === 0}>
      {props => (
        <Tbody {...props}>
          {collection.map(
            // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
            (item: Object, idx: number): React.Element<InstanceRow> => (
              <InstanceRow
                first={idx === 0}
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'job_instanceid' does not exist on type '... Remove this comment to see the full error message
                key={`item_${item.job_instanceid}`}
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'job_instanceid' does not exist on type '... Remove this comment to see the full error message
                active={item.job_instanceid === parseInt(jobQuery, 10)}
                changeJobQuery={changeJobQuery}
                {...item}
              />
            )
          )}
        </Tbody>
      )}
    </DataOrEmptyTable>
  </Table>
);

export default compose(
  connect(
    null,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'instances' does not exist on type '{}'.
    { sort: actions.instances.changeServerSort }
  ),
  withHandlers({
    handleHeaderClick: ({ sort }: Props): Function => (name: string): void => {
      sort(name);
    },
  }),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('date'),
  pure(['jobQuery', 'sortData', 'collection', 'canLoadMore', 'date', 'job'])
)(ResultTable);
