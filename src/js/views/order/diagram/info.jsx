import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import moment from 'moment';
import includes from 'lodash/includes';
import mapProps from 'recompose/mapProps';

import {
  Table,
  Tbody,
  Tr,
  Td,
  Th,
  EditableCell,
} from '../../../components/new_table';
import Date from 'components/date';
import Datepicker from 'components/datepicker';
import AutoComponent from 'components/autocomponent';
import actions from 'store/api/actions';
import { ORDER_ACTIONS, ALL_ORDER_STATES } from '../../../constants/orders';
import PaneItem from '../../../components/pane_item';
import withDispatch from '../../../hocomponents/withDispatch';
import { ButtonGroup } from '@blueprintjs/core';

type Props = {
  setPriority: Function,
  schedule: Function,
  id: number,
  workflowstatus: string,
  handleSchedule: Function,
  handlePriorityChange: Function,
  workflow_instanceid?: number,
  started?: string,
  custom_status?: string,
  modified?: string,
  priority?: number,
  completed?: string,
  parent_workflow_instanceid?: number,
  scheduled?: string,
  synchronous?: boolean,
  label: string,
};

const DiagramInfoTable: Function = ({
  id,
  workflowstatus,
  label,
  custom_status: customStatus,
  started,
  modified,
  priority,
  handlePriorityChange,
  completed,
  parent_workflow_instanceid: parentId,
  scheduled,
  handleSchedule,
  synchronous,
}: Props): React.Element<any> => (
  <PaneItem title="Info">
    <Table bordered condensed className="text-table">
      <Tbody>
        <Tr>
          <Th className="text"> Instance ID </Th>
          <Td>{id}</Td>
          <Th> Status </Th>
          <Td>
            <span className={`label status-${label}`}>{workflowstatus}</span>
          </Td>
        </Tr>
        <Tr>
          <Th> Started </Th>
          <Td>
            <Date date={started} />
          </Td>
          <Th> Custom </Th>
          <Td>{customStatus}</Td>
        </Tr>
        <Tr>
          <Th> Modified </Th>
          <Td>
            <Date date={modified} />
          </Td>
          <Th> Priority </Th>
          <EditableCell
            value={priority}
            type="number"
            min={0}
            max={999}
            onSave={handlePriorityChange}
          />
        </Tr>
        <Tr>
          <Th> Completed </Th>
          <Td>
            <Date date={completed} />
          </Td>
          <Th> Parent ID </Th>
          <Td>{parentId}</Td>
        </Tr>
        <Tr>
          <Th> Scheduled </Th>
          <Td>
            {includes(ORDER_ACTIONS[workflowstatus], 'schedule') ? (
              <ButtonGroup>
                <Datepicker
                  date={scheduled}
                  onApplyDate={handleSchedule}
                  futureOnly
                />
              </ButtonGroup>
            ) : (
              <Date date={scheduled} />
            )}
          </Td>
          <Th> Synchronous </Th>
          <Td>
            <AutoComponent>{synchronous !== 0}</AutoComponent>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  </PaneItem>
);

export default compose(
  withDispatch(),
  withHandlers({
    handleSchedule: ({
      optimisticDispatch,
      id,
      workflowstatus,
    }: Props): Function => (date: string): void => {
      optimisticDispatch(
        actions.orders.schedule,
        id,
        moment(date).format(),
        workflowstatus
      );
    },
    handlePriorityChange: ({ id, optimisticDispatch }: Props): Function => (
      priority: number
    ): void => {
      optimisticDispatch(actions.orders.setPriority, id, priority);
    },
  }),
  mapProps(
    ({ workflowstatus, ...rest }): Props => ({
      label: ALL_ORDER_STATES.find(
        (state: Object): boolean => state.name === workflowstatus
      ).label,
      workflowstatus,
      ...rest,
    })
  ),
  pure(['scheduled', 'priority', 'workflowstatus'])
)(DiagramInfoTable);
