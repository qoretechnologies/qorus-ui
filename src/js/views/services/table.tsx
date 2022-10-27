import size from 'lodash/size';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { ActionColumnHeader } from '../../components/ActionColumn';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import { DescriptionColumnHeader } from '../../components/DescriptionColumn';
import { IdColumnHeader } from '../../components/IdColumn';
import LoadMore from '../../components/LoadMore';
import { NameColumnHeader } from '../../components/NameColumn';
import { FixedRow, Table, Tbody, Th, Thead } from '../../components/new_table';
import Pull from '../../components/Pull';
import { SelectColumnHeader } from '../../components/SelectColumn';
import SortingDropdown from '../../components/SortingDropdown';
import actions from '../../store/api/actions';
import Row from './row';
import Actions from './toolbar/actions';
import Selector from './toolbar/selector';

type Props = {
  sortData: any;
  onSortChange: Function;
  collection: Array<Object>;
  paneId: string | number;
  openPane: Function;
  closePane: Function;
  select: Function;
  updateDone: Function;
  canLoadMore: boolean;
  selected: string;
  selectedIds: Array<number>;
  handleLoadMore: Function;
  handleLoadAll: Function;
  loadMoreCurrent: number;
  loadMoreTotal: number;
  limit: number;
  sortKeys: any;
};

const ServicesTable: Function = ({
  sortData,
  onSortChange,
  collection,
  paneId,
  openPane,
  closePane,
  select,
  updateDone,
  canLoadMore,
  selected,
  selectedIds,
  handleLoadMore,
  handleLoadAll,
  loadMoreCurrent,
  loadMoreTotal,
  limit,
  sortKeys,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Table
    fixed
    hover
    condensed
    striped
    className="resource-table"
    key={collection.length}
    id="services-view"
  >
    <Thead>
      <FixedRow className="toolbar-row">
        <Th>
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
              limit={limit}
              canLoadMore={canLoadMore}
              handleLoadMore={handleLoadMore}
              handleLoadAll={handleLoadAll}
              currentCount={loadMoreCurrent}
              total={loadMoreTotal}
            />
          </Pull>
        </Th>
      </FixedRow>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <SelectColumnHeader />
        <IdColumnHeader />
        <NameColumnHeader />
        <ActionColumnHeader />
        <Th name="type" icon="info-sign">
          <FormattedMessage id="table.type" />
        </Th>
        <Th name="threads" icon="multi-select">
          <FormattedMessage id="table.threads" />
        </Th>
        <DescriptionColumnHeader />
      </FixedRow>
    </Thead>
    <DataOrEmptyTable condition={size(collection) === 0} cols={7}>
      {(props) => (
        <Tbody {...props}>
          {collection.map(
            // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
            (service: any, index: number) => (
              <Row
                first={index === 0}
                // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                key={`service_${service.id}`}
                // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                isActive={service.id === parseInt(paneId, 10)}
                openPane={openPane}
                closePane={closePane}
                select={select}
                updateDone={updateDone}
                {...service}
              />
            )
          )}
        </Tbody>
      )}
    </DataOrEmptyTable>
  </Table>
);

export default compose(
  connect(null, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
    updateDone: actions.services.updateDone,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
    select: actions.services.select,
  }),
  pure(['collection', 'sortData', 'paneId']),
  injectIntl
)(ServicesTable);
