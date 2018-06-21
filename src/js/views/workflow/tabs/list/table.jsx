/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';

import {
  Table,
  Thead,
  Tbody,
  FixedRow,
  Th,
} from '../../../../components/new_table';
import noData from '../../../../hocomponents/check-no-data';
import Row from './row';
import actions from '../../../../store/api/actions';

type Props = {
  sortData: Object,
  sort: Function,
  handleHeaderClick: Function,
  onSortChange: Function,
  collection: Array<Object>,
  date: string,
  select: Function,
  updateDone: Function,
  canLoadMore: boolean,
  isTablet: boolean,
  searchPage?: boolean,
};

const WorkflowTable: Function = ({
  sortData,
  onSortChange,
  collection,
  date,
  handleHeaderClick,
  canLoadMore,
  isTablet,
  searchPage,
}: Props): React.Element<any> => (
  <Table
    striped
    condensed
    fixed
    className="resource-table"
    marginBottom={canLoadMore ? 55 : 0}
    key={collection.length}
  >
    <Thead>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <Th className="tiny"> - </Th>
        {!isTablet && searchPage && <Th className="name"> Worfklow </Th>}
        <Th className="medium"> ID </Th>
        {!isTablet && <Th className="medium"> Actions </Th>}
        <Th className="medium"> Status </Th>
        <Th className="narrow" name="business_error">
          {' '}
          Err.{' '}
        </Th>
        <Th className="big" name="started" onClick={handleHeaderClick}>
          {' '}
          Started{' '}
        </Th>
        <Th className="big" name="completed" onClick={handleHeaderClick}>
          {' '}
          Completed{' '}
        </Th>
        <Th className="narrow" name="error_count">
          {' '}
          Errors{' '}
        </Th>
        <Th className="narrow" name="warning_count">
          {' '}
          Warns.{' '}
        </Th>
        <Th className="medium" name="operator_lock">
          {' '}
          Lock{' '}
        </Th>
        <Th className="narrow" name="note_count">
          {' '}
          Notes{' '}
        </Th>
      </FixedRow>
    </Thead>
    <Tbody>
      {collection.map(
        (order: Object, index: number): React.Element<Row> => (
          <Row
            first={index === 0}
            key={`order_${order.workflow_instanceid}`}
            date={date}
            isTablet={isTablet}
            searchPage={searchPage}
            {...order}
          />
        )
      )}
    </Tbody>
  </Table>
);

export default compose(
  noData(({ collection }: Props): boolean => collection.length > 0),
  connect(
    null,
    {
      sort: actions.orders.changeServerSort,
    }
  ),
  withHandlers({
    handleHeaderClick: ({ sort }: Props): Function => (name: string): void => {
      sort(name);
    },
  }),
  pure(['sortData', 'collection', 'date', 'isTablet', 'searchPage'])
)(WorkflowTable);
