/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfooter,
} from '../../components/new_table';
import Icon from '../../components/icon';
import Badge from '../../components/badge';
import checkData from '../../hocomponents/check-no-data';
import Row from './row';
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
}: Props): React.Element<any> => (
  <Table
    striped
    hover
    condensed
    fixed
    className="resource-table"
    marginBottom={canLoadMore ? 30 : 0}
    // Another Firefox hack, jesus
    key={collection.length}
  >
    <Thead>
      <Tr sortData={sortData} onSortChange={onSortChange}>
        <Th className="tiny" />
        <Th className="narrow">-</Th>
        {!isTablet && <Th className="narrow">Actions</Th>}
        <Th className="medium" name="autostart">
          Autostart
        </Th>
        <Th className="tiny" name="has_alerts">
          <Icon icon="warning" />
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
        {states.map((state: Object): React.Element<Th> => (
          <Th
            key={`header_${state.name}`}
            className={expanded || isTablet ? 'narrow' : 'medium'}
            name={!expanded ? `GROUPED_${state.name}` : state.name}
            title={state.title}
          >
            {state.short}
          </Th>
        ))}
        <Th className="narrow" name="TOTAL">
          All
        </Th>
        {deprecated && (
          <Th className="medium" name="deprecated">
            Deprecated
          </Th>
        )}
      </Tr>
    </Thead>
    <Tbody>
      {collection.map((workflow: Object): React.Element<Row> => (
        <Row
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
          {...workflow}
        />
      ))}
    </Tbody>
    <Tfooter>
      <Tr>
        <Td colspan={9}>-</Td>
        {states.map((state: Object): React.Element<Td> => {
          const value = !expanded
            ? totalInstances[`GROUPED_${state.name}`]
            : totalInstances[state.name];

          return (
            <Td
              key={`header_${state.name}`}
              className={expanded || isTablet ? 'narrow' : 'medium'}
              name={!expanded ? `GROUPED_${state.name}` : state.name}
              title={state.title}
            >
              <Badge className={`status-${state.label}`} val={value} />
            </Td>
          );
        })}
        <Td className="narrow" name="TOTAL">
          {totalInstances.total}
        </Td>
      </Tr>
    </Tfooter>
  </Table>
);

export default compose(
  connect(null, {
    updateDone: actions.workflows.updateDone,
    select: actions.workflows.select,
  }),
  checkData(
    ({ collection }: Props): boolean => collection && collection.length > 0
  ),
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
