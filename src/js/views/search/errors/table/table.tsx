import size from 'lodash/size';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import Box from '../../../../components/box';
import CsvControl from '../../../../components/CsvControl';
import DataOrEmptyTable from '../../../../components/DataOrEmptyTable';
import { IdColumnHeader } from '../../../../components/IdColumn';
import LoadMore from '../../../../components/LoadMore';
import { NameColumnHeader } from '../../../../components/NameColumn';
import { FixedRow, Table, Tbody, Th, Thead } from '../../../../components/new_table';
import Pull from '../../../../components/Pull';
import { INTERFACE_ICONS } from '../../../../constants/interfaces';
import Row from './row';

type Props = {
  sortData: any;
  sort: Function;
  onSortChange: Function;
  collection: Array<Object>;
  select: Function;
  updateDone: Function;
  handleLoadMore: Function;
  limit: number;
  onCSVClick: Function;
  canLoadMore: boolean;
  loadMoreCurrent: number;
  children: any;
};

const WorkflowTable: Function = ({
  sortData,
  onSortChange,
  collection,
  canLoadMore,
  children,
  handleLoadMore,
  loadMoreCurrent,
  limit,
  onCSVClick,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Box top noPadding>
    <Table striped condensed fixed id="errors-search-view">
      <Thead>
        <FixedRow className="toolbar-row">
          <Th colspan="full">{children}</Th>
        </FixedRow>
        <FixedRow className="toolbar-row">
          <Th colspan="full">
            <Pull>
              <CsvControl onClick={onCSVClick} disabled={size(collection) === 0} />
            </Pull>
            <Pull right>
              <LoadMore
                canLoadMore={canLoadMore}
                handleLoadMore={handleLoadMore}
                currentCount={loadMoreCurrent}
                total="?"
                limit={limit}
              />
            </Pull>
          </Th>
        </FixedRow>
        <FixedRow sortData={sortData} onSortChange={onSortChange}>
          <IdColumnHeader />
          <NameColumnHeader name="error" />
          <NameColumnHeader icon={INTERFACE_ICONS.order} title="Order" name="workflow_instanceid" />
          <NameColumnHeader icon={INTERFACE_ICONS.workflow} title="Workflow" name="workflowid" />
          <Th name="severity" icon="warning-sign">
            Severity
          </Th>
          <Th name="workflowstatus" icon="info-sign">
            Status
          </Th>
          <Th name="retry" icon="refresh">
            Retry
          </Th>
          <Th name="business_error" icon="error">
            Bus. Err.
          </Th>
        </FixedRow>
      </Thead>
      <DataOrEmptyTable condition={collection.length === 0} cols={8}>
        {(props) => (
          <Tbody {...props}>
            {collection.map(
              // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
              (error: any, index: number) => (
                <Row
                  first={index === 0}
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'error_instanceid' does not exist on type... Remove this comment to see the full error message
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

export default compose(pure(['sortData', 'collection', 'canLoadMore', 'children']))(WorkflowTable);
