// @flow
import React from 'react';
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
import Date from '../../../components/date';
import Datepicker from '../../../components/datepicker';
import actions from '../../../store/api/actions';
import { ORDER_ACTIONS, ALL_ORDER_STATES } from '../../../constants/orders';
import PaneItem from '../../../components/pane_item';
import withDispatch from '../../../hocomponents/withDispatch';
import { ButtonGroup } from '@blueprintjs/core';
import ContentByType from '../../../components/ContentByType';
import { DateColumn, DateColumnHeader } from '../../../components/DateColumn';
import { IdColumnHeader, IdColumn } from '../../../components/IdColumn';

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
          <IdColumnHeader>Instance ID</IdColumnHeader>
          <IdColumn>{id}</IdColumn>
          <Th iconName="info-sign"> Status </Th>
          <Td>
            <span className={`label status-${label}`}>{workflowstatus}</span>
          </Td>
        </Tr>
        <Tr>
          <DateColumnHeader>Started</DateColumnHeader>
          <DateColumn>{started}</DateColumn>
          <Th iconName="info-sign"> Custom </Th>
          <Td>{customStatus}</Td>
        </Tr>
        <Tr>
          <DateColumnHeader>Modified</DateColumnHeader>
          <DateColumn>{modified}</DateColumn>
          <Th iconName="warning-sign"> Priority </Th>
          <EditableCell
            value={priority}
            type="number"
            min={0}
            max={999}
            onSave={handlePriorityChange}
          />
        </Tr>
        <Tr>
          <DateColumnHeader>Completed</DateColumnHeader>
          <DateColumn>{completed}</DateColumn>
          <Th iconName="arrow-up"> Parent ID </Th>
          <Td>{parentId}</Td>
        </Tr>
        <Tr>
          <DateColumnHeader>Scheduled</DateColumnHeader>
          {includes(ORDER_ACTIONS[workflowstatus], 'schedule') ? (
            <Td>
              <ButtonGroup>
                <Datepicker
                  date={scheduled}
                  onApplyDate={handleSchedule}
                  futureOnly
                />
              </ButtonGroup>
            </Td>
          ) : (
            <DateColumn>{scheduled}</DateColumn>
          )}
          <Th iconName="refresh"> Synchronous </Th>
          <Td>
            <ContentByType content={synchronous !== 0} />
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
