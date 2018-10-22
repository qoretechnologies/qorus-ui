// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import checkData from '../../hocomponents/check-no-data';
import actions from '../../store/api/actions';
import { Table, Thead, Tbody, FixedRow, Th } from '../../components/new_table';
import Icon from '../../components/icon';
import Row from './row';
import Pull from '../../components/Pull';
import Selector from './toolbar/selector';
import Actions from './toolbar/actions';
import LoadMore from '../../components/LoadMore';

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
        <Th colspan={11}>
          <Pull>
            <Selector selected={selected} selectedCount={selectedIds.length} />
            <Actions selectedIds={selectedIds} show={selected !== 'none'} />
          </Pull>
          <Pull right>
            <LoadMore
              canLoadMore={canLoadMore}
              handleLoadMore={handleLoadMore}
              handleLoadAll={handleLoadAll}
            />
          </Pull>
        </Th>
      </FixedRow>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <Th className="tiny">-</Th>
        <Th className="narrow">-</Th>
        <Th className="narrow" name="type">
          Type
        </Th>
        <Th className="medium">Actions</Th>
        <Th className="narrow" name="threads">
          Threads
        </Th>
        <Th className="tiny" name="has_alerts">
          <Icon iconName="warning" />
        </Th>
        <Th className="narrow" name="id">
          ID
        </Th>
        <Th className="name" name="name">
          Name
        </Th>
        <Th className="normal text" name="version">
          Version
        </Th>
        <Th name="desc">Description</Th>
        <Th className="narrow" name="remote">
          Remote
        </Th>
      </FixedRow>
    </Thead>
    <Tbody>
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
  checkData(
    ({ collection }: Props): boolean => collection && collection.length > 0
  ),
  pure(['collection', 'sortData', 'paneId'])
)(ServicesTable);
