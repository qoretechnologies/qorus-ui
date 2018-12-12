/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';

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
import Dropdown, { Control, Item } from '../../components/dropdown';
import LoadMore from '../../components/LoadMore';
import { Icon } from '@blueprintjs/core';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import SortingDropdown from '../../components/SortingDropdown';
import { NameColumnHeader } from '../../components/NameColumn';

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
  sortKeysObj,
}: Props): React.Element<any> => (
  <Table striped hover condensed fixed>
    <Thead>
      <FixedRow className="toolbar-row">
        <Th colspan={isTablet ? 4 : 5}>
          <div className="pull-left">
            <Selector selected={selected} selectedCount={selectedIds.length} />
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
          </div>
          <div className="pull-right">
            <LoadMore
              limit={limit}
              canLoadMore={canLoadMore}
              handleLoadAll={handleLoadAll}
              handleLoadMore={handleLoadMore}
            />
          </div>
        </Th>
        <Th className="separated-cell" colspan={2}>
          <DatePicker
            date={dateQuery || '24h'}
            onApplyDate={changeDateQuery}
            className="toolbar-item"
          />
        </Th>
        <Th className="separated-cell" colspan={2}>
          <Dropdown>
            <Control icon="time">{band}</Control>
            <Item title="1 hour band" onClick={handleDispositionChange} />
            <Item title="4 hour band" onClick={handleDispositionChange} />
            <Item title="24 hour band" onClick={handleDispositionChange} />
          </Dropdown>
        </Th>
      </FixedRow>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <Th className="tiny">
          <Icon iconName="small-tick" />
        </Th>
        {!isTablet && <Th className="normal">Actions</Th>}
        <Th className="medium" name="autostart">
          Auto / Execs
        </Th>
        <Th className="narrow" name="id">
          ID
        </Th>
        <NameColumnHeader />
        {deprecated && (
          <Th className="medium" name="deprecated">
            Deprecated
          </Th>
        )}
        <Th className="huge separated-cell" onClick={handleInstancesClick}>
          Instances
        </Th>
        <Th className="narrow" name="TOTAL">
          All
        </Th>
        <Th className="big separated-cell">Disposition (%)</Th>
        <Th className="normal">SLA (%)</Th>
      </FixedRow>
    </Thead>
    <DataOrEmptyTable
      condition={collection.length === 0}
      cols={isTablet ? 8 : 9}
    >
      {props => (
        <Tbody {...props}>
          {collection.map(
            (workflow: Object, index: number): React.Element<Row> => (
              <Row
                first={index === 0}
                key={`worfkflow_${workflow.id}`}
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
  ])
)(WorkflowsTable);
