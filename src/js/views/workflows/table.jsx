/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfooter,
  FixedRow,
} from '../../components/new_table';
import Icon from '../../components/icon';
import Badge from '../../components/badge';
import checkData from '../../hocomponents/check-no-data';
import withModal from '../../hocomponents/modal';
import Row from './row';
import SortModal from './modals/sort_modal';
import actions from '../../store/api/actions';

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
  totalInstances,
  setRemote,
  handleInstancesClick,
}: Props): React.Element<any> => (
  <Table
    striped
    hover
    condensed
    fixed
    className="resource-table"
    marginBottom={canLoadMore ? 45 : 0}
    // Another Firefox hack, jesus
    key={collection.length}
  >
    <Thead>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <Th className="tiny" />
        <Th className="narrow">-</Th>
        {!isTablet && <Th className="narrow">Actions</Th>}
        <Th className="medium" name="autostart">
          Autostart
        </Th>
        <Th className="tiny" name="has_alerts">
          <Icon iconName="warning" />
        </Th>
        <Th className="narrow" name="exec_count">
          Execs
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
        <Th className="huge" onClick={handleInstancesClick}>
          Instances
        </Th>
        {/* states.map(
          (state: Object): React.Element<Th> => (
            <Th
              key={`header_${state.name}`}
              className={expanded || isTablet ? 'narrow' : 'medium'}
              name={!expanded ? `GROUPED_${state.name}` : state.name}
              title={state.title}
            >
              {state.short}
            </Th>
          )
        ) */}
        <Th className="narrow" name="TOTAL">
          All
        </Th>
        <Th className="big">Disposition (%)</Th>
        <Th className="normal">SLA (%)</Th>
        <Th className="narrow" name="remote">
          Remote
        </Th>
        {deprecated && (
          <Th className="medium" name="deprecated">
            Deprecated
          </Th>
        )}
      </FixedRow>
    </Thead>
    <Tbody>
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
            {...workflow}
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
      updateDone: actions.workflows.updateDone,
      select: actions.workflows.select,
    }
  ),
  checkData(
    ({ collection }: Props): boolean => collection && collection.length > 0
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
  }),
  pure([
    'sortData',
    'expanded',
    'collection',
    'deprecated',
    'paneId',
    'date',
    'isTablet',
    'totalInstances',
  ])
)(WorkflowsTable);
