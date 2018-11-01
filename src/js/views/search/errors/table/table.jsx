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
import Pull from '../../../../components/Pull';
import CsvControl from '../../../../components/CsvControl';
import LoadMore from '../../../../components/LoadMore';
import Box from '../../../../components/box';
import DataOrEmptyTable from '../../../../components/DataOrEmptyTable';

type Props = {
  sortData: Object,
  sort: Function,
  onSortChange: Function,
  collection: Array<Object>,
  select: Function,
  updateDone: Function,
  handleLoadMore: Function,
  limit: number,
  onCSVClick: Function,
  canLoadMore: boolean,
  children: any,
};

const WorkflowTable: Function = ({
  sortData,
  onSortChange,
  collection,
  canLoadMore,
  children,
  handleLoadMore,
  limit,
  onCSVClick,
}: Props): React.Element<any> => (
  <Box top noPadding>
    <Table striped condensed fixed>
      <Thead>
        <FixedRow className="toolbar-row">
          <Th colspan="full">{children}</Th>
        </FixedRow>
        <FixedRow className="toolbar-row">
          <Th colspan="full">
            <Pull>
              <CsvControl onClick={onCSVClick} />
            </Pull>
            <Pull right>
              <LoadMore
                canLoadMore={canLoadMore}
                handleLoadMore={handleLoadMore}
                limit={limit}
              />
            </Pull>
          </Th>
        </FixedRow>
        <FixedRow sortData={sortData} onSortChange={onSortChange}>
          <Th className="medium" name="id">
            ID
          </Th>
          <Th className="medium" name="workflowstatus">
            Status
          </Th>
          <Th className="text name" name="error">
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
      <DataOrEmptyTable condition={collection.length === 0} cols={5}>
        {props => (
          <Tbody {...props}>
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
        )}
      </DataOrEmptyTable>
    </Table>
  </Box>
);

export default compose(
  pure(['sortData', 'collection', 'canLoadMore', 'children'])
)(WorkflowTable);
