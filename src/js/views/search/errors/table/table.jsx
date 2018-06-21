/* @flow */
import React from 'react';
import compose from 'recompose/compose';
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

type Props = {
  sortData: Object,
  sort: Function,
  onSortChange: Function,
  collection: Array<Object>,
  select: Function,
  updateDone: Function,
  canLoadMore: boolean,
};

const WorkflowTable: Function = ({
  sortData,
  onSortChange,
  collection,
  canLoadMore,
}: Props): React.Element<any> => (
  <Table
    key={new Date()}
    striped
    condensed
    fixed
    className="resource-table"
    marginBottom={canLoadMore ? 55 : 0}
  >
    <Thead>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <Th className="medium" name="id">
          ID
        </Th>
        <Th className="medium" name="workflowstatus">
          Status
        </Th>
        <Th className="text" name="error">
          Error
        </Th>
        <Th className="narrow" name="retry">
          Retry
        </Th>
        <Th className="medium" name="business_error">
          Bus. Err.
        </Th>
      </FixedRow>
    </Thead>
    <Tbody>
      {collection.map(
        (error: Object, index: number): React.Element<Row> => (
          <Row
            first={index === 0}
            key={`error_${error.error_instanceid}`}
            {...error}
          />
        )
      )}
    </Tbody>
  </Table>
);

export default compose(
  noData(({ collection }: Props): boolean => collection.length > 0),
  pure(['sortData', 'collection'])
)(WorkflowTable);
