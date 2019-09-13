// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';
import size from 'lodash/size';

import actions from '../../store/api/actions';
import { Table, Thead, Tbody, FixedRow, Th } from '../../components/new_table';
import Row from './row';
import Pull from '../../components/Pull';
import Selector from './toolbar/selector';
import Actions from './toolbar/actions';
import LoadMore from '../../components/LoadMore';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import { NameColumnHeader } from '../../components/NameColumn';
import { SelectColumnHeader } from '../../components/SelectColumn';
import { IdColumnHeader } from '../../components/IdColumn';
import { ActionColumnHeader } from '../../components/ActionColumn';
import { DescriptionColumnHeader } from '../../components/DescriptionColumn';
import SortingDropdown from '../../components/SortingDropdown';
import { injectIntl, FormattedMessage } from 'react-intl';

type Props = {
  sortData: Object,
  onSortChange: Function,
  collection: Array<Object>,
  paneId: string | number,
  openPane: Function,
  closePane: Function,
  select: Function,
  updateDone: Function,
  canLoadMore: boolean,
  selected: string,
  selectedIds: Array<number>,
  handleLoadMore: Function,
  handleLoadAll: Function,
  loadMoreCurrent: number,
  loadMoreTotal: number,
  limit: number,
  sortKeys: Object,
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
  intl,
}: Props): React.Element<any> => (
  <Table
    fixed
    hover
    condensed
    striped
    className="resource-table"
    key={collection.length}
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
            <SortingDropdown
              onSortChange={onSortChange}
              sortData={sortData}
              sortKeys={sortKeys}
            />
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
        <Th name="type" iconName="info-sign">
          <FormattedMessage id='table.type' />
        </Th>
        <Th name="threads" iconName="multi-select">
          <FormattedMessage id='table.threads' />
        </Th>
        <DescriptionColumnHeader />
      </FixedRow>
    </Thead>
    <DataOrEmptyTable condition={size(collection) === 0} cols={7}>
      {props => (
        <Tbody {...props}>
          {collection.map(
            (service: Object, index: number): React.Element<Row> => (
              <Row
                first={index === 0}
                key={`service_${service.id}`}
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
  connect(
    null,
    {
      updateDone: actions.services.updateDone,
      select: actions.services.select,
    }
  ),
  pure(['collection', 'sortData', 'paneId']),
  injectIntl
)(ServicesTable);
