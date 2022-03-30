/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import { connect } from 'react-redux';

import { Tr, Td } from '../../../../components/new_table';
import actions from '../../../../store/api/actions';
import OrderControls from './controls';
import { ALL_ORDER_STATES } from '../../../../constants/orders';
import queryControl from '../../../../hocomponents/queryControl';
import Lock from './lock';
import { SelectColumn } from '../../../../components/SelectColumn';
import NameColumn from '../../../../components/NameColumn';
import { ActionColumn } from '../../../../components/ActionColumn';
import { DateColumn } from '../../../../components/DateColumn';
import ContentByType from '../../../../components/ContentByType';

type Props = {
  date: string,
  openPane: Function,
  select: Function,
  handleCheckboxClick: Function,
  handleHighlightEnd: Function,
  updateDone: Function,
  id: number,
  _selected: boolean,
  _updated: boolean,
  business_error: boolean,
  // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'normalizedName'.
  normalizedName: string,
  name: string,
  // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'normalizedName'.
  normalizedName: string,
  started: string,
  completed: string,
  modified: string,
  scheduled: string,
  error_count: number,
  warning_count: number,
  operator_lock: boolean,
  note_count: number,
  workflowstatus: string,
  label: string,
  isTablet: boolean,
  searchPage?: boolean,
  workflowid: number,
  allQuery: Object,
  target: string,
  first: boolean,
};

const TableRow: Function = ({
  date,
  handleCheckboxClick,
  handleHighlightEnd,
  id,
  _selected,
  _updated,
  business_error: busErr,
  normalizedName,
  started,
  completed,
  error_count: errCnt,
  warning_count: warnCnt,
  operator_lock: operLock,
  note_count: noteCnt,
  workflowstatus,
  workflowid,
  label,
  isTablet,
  searchPage,
  allQuery,
  target,
  first,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Tr
    first={first}
    onHighlightEnd={handleHighlightEnd}
    highlight={_updated}
    className={_selected ? 'row-selected' : ''}
    onClick={handleCheckboxClick}
  >
    <SelectColumn onClick={handleCheckboxClick} checked={_selected} />
    <NameColumn
      name={id}
      link={`/order/${id}/${date}?target=${target}&prevQuery=${JSON.stringify(
        allQuery
      )}`}
      className="normal"
      type="order"
    />
    {!isTablet && searchPage && (
      <NameColumn
        name={normalizedName}
        link={`/workflow/${workflowid}?date=${date}`}
        type="workflow"
      />
    )}
    {!isTablet && (
      <ActionColumn className="medium">
        <OrderControls id={id} workflowstatus={workflowstatus} compact />
      </ActionColumn>
    )}
    <Td className="medium">
      <Lock lock={operLock} id={id} />
    </Td>
    <Td className="medium">
      <span className={`label status-${label}`}>{workflowstatus}</span>
    </Td>
    <Td className="narrow">
      <ContentByType content={busErr} />
    </Td>
    <Td className="narrow">{errCnt}</Td>
    <Td className="narrow">{warnCnt}</Td>
    <Td className="narrow">{noteCnt}</Td>
    <DateColumn>{started}</DateColumn>
    <DateColumn>{completed}</DateColumn>
  </Tr>
);

export default compose(
  connect(
    () => ({}),
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
      select: actions.orders.select,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
      updateDone: actions.orders.updateDone,
    }
  ),
  mapProps(
    // @ts-expect-error ts-migrate(2740) FIXME: Type '{ label: any; workflowstatus: any; target: s... Remove this comment to see the full error message
    ({ workflowstatus, ...rest }): Props => ({
      label: ALL_ORDER_STATES.find(
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        (state: Object): boolean => state.name === workflowstatus
      ).label,
      workflowstatus,
      target: rest.searchPage ? '/search' : `/workflow/${rest.workflowid}`,
      ...rest,
    })
  ),
  withHandlers({
    handleCheckboxClick: ({ select, id }: Props): Function => (): void => {
      select(id);
    },
    handleHighlightEnd: ({ updateDone, id }: Props): Function => (): void => {
      updateDone(id);
    },
  }),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 0.
  queryControl(),
  pure([
    'date',
    '_selected',
    '_updated',
    'workflowstatus',
    'note_count',
    'started',
    'completed',
    'modified',
    'scheduled',
    'isTablet',
  ])
)(TableRow);
