/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import { Table, Thead, Tbody, Tr, Th } from '../../components/new_table';
import Icon from '../../components/icon';
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
  date: string,
  select: Function,
  updateDone: Function,
  setAutostart: Function,
  expanded: boolean,
};

const WorkflowsTable: Function = ({
  sortData,
  onSortChange,
  states,
  deprecated,
  collection,
  paneId,
  openPane,
  date,
  select,
  updateDone,
  setAutostart,
  expanded,
}: Props): React.Element<any> => (
  <Table
    striped
    hover
    condensed
    fixed
    className="resource-table"
    marginBottom={30}
  >
    <Thead>
      <Tr
        sortData={sortData}
        onSortChange={onSortChange}
      >
        <Th className="narrow" />
        <Th className="narrow">-</Th>
        <Th className="narrow">Actions</Th>
        <Th className="medium" name="autostart">Autostart</Th>
        <Th className="narrow" name="has_alerts">
          <Icon icon="warning" />
        </Th>
        <Th className="narrow" name="exec_count">Execs</Th>
        <Th className="narrow" name="id">ID</Th>
        <Th className="name" name="name">Name</Th>
        <Th className="narrow" name="version">Version</Th>
        { states.map((state: Object): React.Element<Th> => (
          <Th
            key={`header_${state.name}`}
            className={expanded ? 'narrow' : 'medium'}
            name={!expanded ? `GROUPED_${state.name}` : state.name}
          >{ state.short }</Th>
        ))}
        <Th className="medium" name="TOTAL">TOTAL</Th>
        { deprecated && (
          <Th className="medium" name="deprecated">Deprecated</Th>
        )}
      </Tr>
    </Thead>
    <Tbody>
      {collection.map((workflow: Object): React.Element<Row> => (
        <Row
          key={`worfkflow_${workflow.id}`}
          isActive={workflow.id === parseInt(paneId, 10)}
          openPane={openPane}
          date={date}
          select={select}
          updateDone={updateDone}
          setAutostart={setAutostart}
          states={states}
          showDeprecated={deprecated}
          expanded={expanded}
          {...workflow}
        />
      ))}
    </Tbody>
  </Table>
);

export default compose(
  connect(
    () => ({}),
    {
      setAutostart: actions.workflows.setAutostart,
      updateDone: actions.workflows.updateDone,
      select: actions.workflows.select,
    }
  ),
  pure([
    'sortData',
    'expanded',
    'collection',
    'deprecated',
    'paneId',
    'date',
  ])
)(WorkflowsTable);
