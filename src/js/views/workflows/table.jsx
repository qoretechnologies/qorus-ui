/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import size from 'lodash/size';

import { Table, Thead, Tbody, Th, FixedRow } from '../../components/new_table';
import withModal from '../../hocomponents/modal';
import Row from './row';
import SortModal from './modals/sort_modal';
import actions from '../../store/api/actions';
import queryControl from '../../hocomponents/queryControl';
import DatePicker from '../../components/datepicker';
import Selector from './toolbar/selector';
import Actions from './toolbar/actions';
import Filters from './toolbar/filters';
import LoadMore from '../../components/LoadMore';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import SortingDropdown from '../../components/SortingDropdown';
import { NameColumnHeader } from '../../components/NameColumn';
import Pull from '../../components/Pull';
import { SelectColumnHeader } from '../../components/SelectColumn';
import { ActionColumnHeader } from '../../components/ActionColumn';
import { IdColumnHeader } from '../../components/IdColumn';
import Band from './toolbar/band';
import { injectIntl, FormattedMessage } from 'react-intl';

type Props = {
  sortData: Object,
  onSortChange: Function,
  states: Object,
  deprecated?: boolean,
  collection: Array<Object>,
  paneId?: number,
  openPane: Function,
  closePane: Function,
  date: string,
  select: Function,
  updateDone: Function,
  expanded: boolean,
  canLoadMore: boolean,
  isTablet: boolean,
  totalInstances: Object,
  setRemote: Function,
  openModal: Function,
  closeModal: Function,
  handleInstancesClick: Function,
  dateQuery: string,
  changeDateQuery: Function,
  dispositionQuery: string,
  changeDispositionQuery: Function,
  handleDispositionChange: Function,
  selected: string,
  selectedIds: Array<number>,
  location: Object,
  handleLoadMore: Function,
  handleLoadAll: Function,
  loadMoreCurrent: number,
  loadMoreTotal: number,
  limit: number,
  sortKeysObj: Object,
  band: string,
};

const WorkflowsTable: Function = ({
  sortData,
  onSortChange,
  states,
  deprecated,
  collection,
  paneId,
  openPane,
  closePane,
  date,
  select,
  updateDone,
  expanded,
  canLoadMore,
  isTablet,
  setRemote,
  handleInstancesClick,
  dateQuery,
  changeDateQuery,
  selected,
  selectedIds,
  location,
  band,
  handleDispositionChange,
  limit,
  handleLoadMore,
  handleLoadAll,
  loadMoreCurrent,
  loadMoreTotal,
  sortKeysObj,
  intl,
}: Props): React.Element<any> => (
  <Table striped hover condensed fixed>
    <Thead>
      <FixedRow className="toolbar-row">
        <Th colspan={5}>
          <Pull>
            <Selector
              selected={selected}
              selectedCount={selectedIds.length}
              disabled={size(collection) === 0}
            />
            <Actions
              selectedIds={selectedIds}
              show={selected !== 'none'}
              isTablet={isTablet}
            />
            <Filters location={location} isTablet={isTablet} />
            <SortingDropdown
              onSortChange={onSortChange}
              sortData={sortData}
              sortKeys={sortKeysObj}
            />
          </Pull>
          <Pull right>
            <LoadMore
              limit={limit}
              canLoadMore={canLoadMore}
              handleLoadAll={handleLoadAll}
              handleLoadMore={handleLoadMore}
              total={loadMoreTotal}
              currentCount={loadMoreCurrent}
            />
          </Pull>
        </Th>
        <Th className="separated-cell" colspan={2}>
          <DatePicker
            date={dateQuery || '24h'}
            onApplyDate={changeDateQuery}
            className="toolbar-item"
          />
        </Th>
        <Th className="separated-cell" colspan={2}>
          <Band band={band} onChange={handleDispositionChange} />
        </Th>
      </FixedRow>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <SelectColumnHeader />
        <IdColumnHeader />
        <NameColumnHeader title={intl.formatMessage({ id: 'table.name' })} />
        <ActionColumnHeader children={intl.formatMessage({ id: 'table.actions' })} />
        <Th name="autostart" iconName="automatic-updates">
          <FormattedMessage id='table.auto-execs' />
        </Th>
        {deprecated && (
          <Th name="deprecated" iconName="flag">
            <FormattedMessage id='table.deprecated' />
          </Th>
        )}
        <Th
          className="separated-cell"
          onClick={handleInstancesClick}
          iconName="layout-grid"
        >
          <FormattedMessage id='table.instances' />
        </Th>
        <Th name="TOTAL" iconName="grid">
          <FormattedMessage id='table.all' />
        </Th>
        <Th className="separated-cell" iconName="pie-chart">
          <FormattedMessage id='table.disposition' /> (%)
        </Th>
        <Th className="normal" iconName="time">
          <FormattedMessage id='table.sla' /> (%)
        </Th>
      </FixedRow>
    </Thead>
    <DataOrEmptyTable
      condition={collection.length === 0}
      cols={deprecated ? 10 : 9}
    >
      {props => (
        <Tbody {...props}>
          {collection.map(
            (workflow: Object, index: number): React.Element<Row> => (
              <Row
                first={index === 0}
                key={workflow.id}
                isActive={workflow.id === parseInt(paneId, 10)}
                openPane={openPane}
                closePane={closePane}
                date={date}
                select={select}
                updateDone={updateDone}
                states={states}
                showDeprecated={deprecated}
                expanded={expanded}
                isTablet={isTablet}
                setRemote={setRemote}
                band={band.replace(/ /g, '_')}
                {...workflow}
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
      updateDone: actions.workflows.updateDone,
      select: actions.workflows.select,
    }
  ),
  withModal(),
  withHandlers({
    handleInstancesClick: ({
      sortData,
      onSortChange,
      openModal,
      closeModal,
    }: Props): Function => (): void => {
      openModal(
        <SortModal
          sortData={sortData}
          onSortChange={onSortChange}
          closeModal={closeModal}
        />
      );
    },
    handleDispositionChange: ({ changeDispositionQuery }: Props): Function => (
      event: EventHandler,
      title: string
    ): void => {
      changeDispositionQuery(title);
    },
  }),
  queryControl('date'),
  pure([
    'sortData',
    'expanded',
    'collection',
    'deprecated',
    'paneId',
    'date',
    'isTablet',
    'totalInstances',
    'dateQuery',
    'band',
  ]),
  injectIntl
)(WorkflowsTable);
