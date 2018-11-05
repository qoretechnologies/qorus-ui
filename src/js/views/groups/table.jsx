// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import actions from '../../store/api/actions';
import { Table, Thead, Tbody, FixedRow, Th } from '../../components/new_table';
import Row from './row';
import Icon from '../../components/icon';
import Selectors from './toolbar/selectors';
import Actions from './toolbar/actions';
import Pull from '../../components/Pull';
import LoadMore from '../../components/LoadMore';

type Props = {
  sortData: Object,
  onSortChange: Function,
  collection: Array<Object>,
  select: Function,
  updateDone: Function,
  canLoadMore: boolean,
  isTablet: boolean,
  selected: string,
  selectedIds: Array<Number>,
  handleLoadMore: Function,
  handleLoadAll: Function,
  limit: number,
};

const GroupsTable: Function = ({
  sortData,
  onSortChange,
  collection,
  select,
  updateDone,
  canLoadMore,
  isTablet,
  selected,
  selectedIds,
  limit,
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
            <Selectors selected={selected} selectedCount={selectedIds.length} />
            <Actions selectedIds={selectedIds} show={selected !== 'none'} />
          </Pull>
          <Pull right>
            <LoadMore
              canLoadMore={canLoadMore}
              handleLoadAll={handleLoadAll}
              handleLoadMore={handleLoadMore}
              limit={limit}
            />
          </Pull>
        </Th>
      </FixedRow>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <Th className="tiny">-</Th>
        <Th className="narrow" name="enabled">
          <Icon iconName="power-off" />
        </Th>
        <Th className="narrow" name="id">
          ID
        </Th>
        <Th className="name" name="name">
          Name
        </Th>
        <Th name="description">Description</Th>
        <Th
          className={isTablet ? 'narrow' : 'medium'}
          name="workflows_count"
          title="Workflows"
        >
          {isTablet ? 'W' : 'Workflows'}
        </Th>
        <Th
          className={isTablet ? 'narrow' : 'medium'}
          name="services_count"
          title="Services"
        >
          {isTablet ? 'S' : 'Services'}
        </Th>
        <Th
          className={isTablet ? 'narrow' : 'medium'}
          name="jobs_count"
          title="Jobs"
        >
          {isTablet ? 'J' : 'Jobs'}
        </Th>
        <Th
          className={isTablet ? 'narrow' : 'medium'}
          name="vmaps_count"
          title="Vmaps"
        >
          {isTablet ? 'V' : 'Vmaps'}
        </Th>
        <Th
          className={isTablet ? 'narrow' : 'medium'}
          name="roles_count"
          title="Roles"
        >
          {isTablet ? 'R' : 'Roles'}
        </Th>
        <Th
          className={isTablet ? 'narrow' : 'medium'}
          name="mappers_count"
          title="Mappers"
        >
          {isTablet ? 'M' : 'Mappers'}
        </Th>
      </FixedRow>
    </Thead>
    <Tbody>
      {collection.map(
        (group: Object, index: number): React.Element<Row> => (
          <Row
            first={index === 0}
            key={`group_${group.id}`}
            select={select}
            updateDone={updateDone}
            isTablet={isTablet}
            {...group}
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
      updateDone: actions.groups.updateDone,
      select: actions.groups.select,
    }
  ),
  pure(['collection', 'sortData'])
)(GroupsTable);
