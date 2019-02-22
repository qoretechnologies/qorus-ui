// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';
import size from 'lodash/size';

import actions from '../../store/api/actions';
import { Table, Thead, Tbody, FixedRow, Th } from '../../components/new_table';
import Row from './row';
import Icon from '../../components/icon';
import Selectors from './toolbar/selectors';
import Actions from './toolbar/actions';
import Pull from '../../components/Pull';
import LoadMore from '../../components/LoadMore';
import titleManager from '../../hocomponents/TitleManager';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import { SelectColumnHeader } from '../../components/SelectColumn';
import { IdColumnHeader } from '../../components/IdColumn';
import { NameColumnHeader } from '../../components/NameColumn';
import { ActionColumnHeader } from '../../components/ActionColumn';
import { DescriptionColumnHeader } from '../../components/DescriptionColumn';
import { INTERFACE_ICONS } from '../../constants/interfaces';

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
  loadMoreCurrent: number,
  loadMoreTotal: number,
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
  loadMoreCurrent,
  loadMoreTotal,
}: Props): React.Element<any> => (
  <Table fixed hover condensed striped>
    <Thead>
      <FixedRow className="toolbar-row">
        <Th colspan={11}>
          <Pull>
            <Selectors
              selected={selected}
              selectedCount={selectedIds.length}
              disabled={size(collection) === 0}
            />
            <Actions selectedIds={selectedIds} show={selected !== 'none'} />
          </Pull>
          <Pull right>
            <LoadMore
              canLoadMore={canLoadMore}
              handleLoadAll={handleLoadAll}
              handleLoadMore={handleLoadMore}
              currentCount={loadMoreCurrent}
              total={loadMoreTotal}
              limit={limit}
            />
          </Pull>
        </Th>
      </FixedRow>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <SelectColumnHeader />
        <IdColumnHeader />
        <NameColumnHeader />
        <ActionColumnHeader />
        <Th
          name="workflows_count"
          title="Workflows"
          iconName={INTERFACE_ICONS.workflows}
        >
          {isTablet ? 'W' : 'Workflows'}
        </Th>
        <Th
          name="services_count"
          title="Services"
          iconName={INTERFACE_ICONS.services}
        >
          {isTablet ? 'S' : 'Services'}
        </Th>
        <Th name="jobs_count" title="Jobs" iconName={INTERFACE_ICONS.jobs}>
          {isTablet ? 'J' : 'Jobs'}
        </Th>
        <Th
          name="vmaps_count"
          title="Vmaps"
          iconName={INTERFACE_ICONS.valuemaps}
        >
          {isTablet ? 'V' : 'Vmaps'}
        </Th>
        <Th name="roles_count" title="Roles" iconName={INTERFACE_ICONS.roles}>
          {isTablet ? 'R' : 'Roles'}
        </Th>
        <Th
          name="mappers_count"
          title="Mappers"
          iconName={INTERFACE_ICONS.mappers}
        >
          {isTablet ? 'M' : 'Mappers'}
        </Th>
        <DescriptionColumnHeader name="description" />
      </FixedRow>
    </Thead>
    <DataOrEmptyTable condition={size(collection) === 0} cols={11}>
      {props => (
        <Tbody {...props}>
          {collection.map(
            (group: Object, index: number): React.Element<Row> => (
              <Row
                first={index === 0}
                key={group.id}
                select={select}
                updateDone={updateDone}
                isTablet={isTablet}
                {...group}
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
      updateDone: actions.groups.updateDone,
      select: actions.groups.select,
    }
  ),
  titleManager('Groups'),
  pure(['collection', 'sortData'])
)(GroupsTable);
