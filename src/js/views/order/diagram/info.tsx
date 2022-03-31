// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
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
import actions from '../../../store/api/actions';
import { ORDER_ACTIONS, ALL_ORDER_STATES } from '../../../constants/orders';
import PaneItem from '../../../components/pane_item';
import withDispatch from '../../../hocomponents/withDispatch';
import ContentByType from '../../../components/ContentByType';
import { DateColumn, DateColumnHeader } from '../../../components/DateColumn';
import { IdColumnHeader, IdColumn } from '../../../components/IdColumn';
import { injectIntl, FormattedMessage } from 'react-intl';

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
  optimisticDispatch: Function,
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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <PaneItem title={intl.formatMessage({ id: 'order.info' })}>
    <Table bordered condensed className="text-table">
      <Tbody>
        <Tr>
          <IdColumnHeader><FormattedMessage id='table.instance-id' /></IdColumnHeader>
          <IdColumn>{id}</IdColumn>
          <Th icon="info-sign"><FormattedMessage id='table.status' /></Th>
          <Td>
            <span className={`label status-${label}`}>{workflowstatus}</span>
          </Td>
        </Tr>
        <Tr>
          <DateColumnHeader><FormattedMessage id='table.started' /></DateColumnHeader>
          <DateColumn>{started}</DateColumn>
          <Th icon="info-sign"><FormattedMessage id='table.custom' /></Th>
          <Td>{customStatus}</Td>
        </Tr>
        <Tr>
          <DateColumnHeader><FormattedMessage id='table.modified' /></DateColumnHeader>
          <DateColumn>{modified}</DateColumn>
          <Th icon="warning-sign"><FormattedMessage id='table.priority' /></Th>
          { /* @ts-expect-error ts-migrate(2741) FIXME: Property 'className' is missing in type '{ value: ... Remove this comment to see the full error message */ }
          <EditableCell
            value={priority}
            type="number"
            min={0}
            max={999}
            onSave={handlePriorityChange}
          />
        </Tr>
        <Tr>
          <DateColumnHeader><FormattedMessage id='table.completed' /></DateColumnHeader>
          <DateColumn>{completed}</DateColumn>
          <Th icon="arrow-up"><FormattedMessage id='table.parent-id' /></Th>
          <Td>{parentId}</Td>
        </Tr>
        <Tr>
          <DateColumnHeader>Scheduled</DateColumnHeader>
          {includes(ORDER_ACTIONS[workflowstatus], 'schedule') ? (
            <DateColumn editable onDateChange={handleSchedule}>
              {scheduled}
            </DateColumn>
          ) : (
            <DateColumn>{scheduled}</DateColumn>
          )}
          <Th icon="refresh"> Synchronous </Th>
          <Td>
            { /* @ts-expect-error ts-migrate(2367) FIXME: This condition will always return 'true' since the... Remove this comment to see the full error message */ }
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
      optimisticDispatch(actions.orders.schedule, id, date, workflowstatus);
    },
    handlePriorityChange: ({ id, optimisticDispatch }: Props): Function => (
      priority: number
    ): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
      optimisticDispatch(actions.orders.setPriority, id, priority);
    },
  }),
  mapProps(
    // @ts-expect-error ts-migrate(2740) FIXME: Type '{ label: any; workflowstatus: any; }' is mis... Remove this comment to see the full error message
    ({ workflowstatus, ...rest }): Props => ({
      label: ALL_ORDER_STATES.find(
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        (state: Object): boolean => state.name === workflowstatus
      ).label,
      workflowstatus,
      ...rest,
    })
  ),
  pure(['scheduled', 'priority', 'workflowstatus']),
  injectIntl
)(DiagramInfoTable);
