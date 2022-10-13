// @flow
import size from 'lodash/size';
import { injectIntl } from 'react-intl';
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
import { INTERFACE_ICONS } from '../../constants/interfaces';
import titleManager from '../../hocomponents/TitleManager';
import actions from '../../store/api/actions';
import Row from './row';
import Actions from './toolbar/actions';
import Selectors from './toolbar/selectors';

type Props = {
  sortData: any;
  onSortChange: Function;
  collection: Array<Object>;
  select: Function;
  updateDone: Function;
  canLoadMore: boolean;
  isTablet: boolean;
  selected: string;
  selectedIds: Array<Number>;
  handleLoadMore: Function;
  handleLoadAll: Function;
  loadMoreCurrent: number;
  loadMoreTotal: number;
  limit: number;
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
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Table fixed hover condensed striped id="groups-view">
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
          title={intl.formatMessage({ id: 'table.workflows' })}
          icon={INTERFACE_ICONS.workflows}
        >
          {intl.formatMessage({ id: 'table.workflows' + (isTablet ? '-mini' : '') })}
        </Th>
        <Th
          name="services_count"
          title={intl.formatMessage({ id: 'table.services' })}
          icon={INTERFACE_ICONS.services}
        >
          {intl.formatMessage({ id: 'table.services' + (isTablet ? '-mini' : '') })}
        </Th>
        <Th
          name="jobs_count"
          title={intl.formatMessage({ id: 'table.jobs' })}
          icon={INTERFACE_ICONS.jobs}
        >
          {intl.formatMessage({ id: 'table.jobs' + (isTablet ? '-mini' : '') })}
        </Th>
        <Th
          name="vmaps_count"
          title={intl.formatMessage({ id: 'table.vmaps' })}
          icon={INTERFACE_ICONS.valuemaps}
        >
          {intl.formatMessage({ id: 'table.vmaps' + (isTablet ? '-mini' : '') })}
        </Th>
        <Th
          name="roles_count"
          title={intl.formatMessage({ id: 'table.roles' })}
          icon={INTERFACE_ICONS.roles}
        >
          {intl.formatMessage({ id: 'table.roles' + (isTablet ? '-mini' : '') })}
        </Th>
        <Th
          name="mappers_count"
          title={intl.formatMessage({ id: 'table.mappers' })}
          icon={INTERFACE_ICONS.mappers}
        >
          {intl.formatMessage({ id: 'table.mappers' + (isTablet ? '-mini' : '') })}
        </Th>
        <DescriptionColumnHeader
          name="description"
          children={intl.formatMessage({ id: 'table.description' })}
        />
      </FixedRow>
    </Thead>
    <DataOrEmptyTable condition={size(collection) === 0} cols={11}>
      {(props) => (
        <Tbody {...props}>
          {collection.map(
            // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
            (group: any, index: number) => (
              <Row
                first={index === 0}
                // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
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
  connect(null, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'groups' does not exist on type '{}'.
    updateDone: actions.groups.updateDone,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'groups' does not exist on type '{}'.
    select: actions.groups.select,
  }),
  titleManager('Groups'),
  pure(['collection', 'sortData']),
  injectIntl
)(GroupsTable);
