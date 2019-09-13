// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';
import size from 'lodash/size';

import actions from '../../store/api/actions';
import { Table, Thead, Tbody, FixedRow, Th } from '../../components/new_table';
import Row from './row';
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
import { injectIntl } from 'react-intl';

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
  intl,
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
        <NameColumnHeader title={intl.formatMessage({ id: 'table.name' })} />
        <ActionColumnHeader children={intl.formatMessage({ id: 'table.actions' })} />
        <Th
          name="workflows_count"
          title={intl.formatMessage({ id: 'table.workflows' })}
          iconName={INTERFACE_ICONS.workflows}
        >
          {intl.formatMessage({ id: 'table.workflows' + (isTablet ? '-mini' : '') })}
        </Th>
        <Th
          name="services_count"
          title={intl.formatMessage({ id: 'table.services' })}
          iconName={INTERFACE_ICONS.services}
        >
          {intl.formatMessage({ id: 'table.services' + (isTablet ? '-mini' : '') })}
        </Th>
        <Th
          name="jobs_count"
          title={intl.formatMessage({ id: 'table.jobs' })}
          iconName={INTERFACE_ICONS.jobs}
        >
          {intl.formatMessage({ id: 'table.jobs' + (isTablet ? '-mini' : '') })}
        </Th>
        <Th
          name="vmaps_count"
          title={intl.formatMessage({ id: 'table.vmaps' })}
          iconName={INTERFACE_ICONS.valuemaps}
        >
          {intl.formatMessage({ id: 'table.vmaps' + (isTablet ? '-mini' : '') })}
        </Th>
        <Th
          name="roles_count"
          title={intl.formatMessage({ id: 'table.roles' })}
          iconName={INTERFACE_ICONS.roles}
        >
          {intl.formatMessage({ id: 'table.roles' + (isTablet ? '-mini' : '') })}
        </Th>
        <Th
          name="mappers_count"
          title={intl.formatMessage({ id: 'table.mappers' })}
          iconName={INTERFACE_ICONS.mappers}
        >
          {intl.formatMessage({ id: 'table.mappers' + (isTablet ? '-mini' : '') })}
        </Th>
        <DescriptionColumnHeader name="description" children={intl.formatMessage({ id: 'table.description' })} />
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
  pure(['collection', 'sortData']),
  injectIntl
)(GroupsTable);
