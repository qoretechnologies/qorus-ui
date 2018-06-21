/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { Tr, Td } from '../../../../components/new_table';
import Checkbox from '../../../../components/checkbox';
import actions from '../../../../store/api/actions';
import OrderControls from './controls';
import Date from '../../../../components/date';
import AutoComp from '../../../../components/autocomponent';
import { ALL_ORDER_STATES } from '../../../../constants/orders';
import queryControl from '../../../../hocomponents/queryControl';
import Lock from './lock';

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
  normalizedName: string,
  name: string,
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
  name,
  normalizedName,
  started,
  completed,
  modified,
  scheduled,
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
}: Props): React.Element<any> => (
  <Tr
    first={first}
    onHighlightEnd={handleHighlightEnd}
    highlight={_updated}
    className={_selected ? 'row-selected' : ''}
    onClick={handleCheckboxClick}
  >
    <Td key="checkbox" className="tiny checker">
      <Checkbox
        action={handleCheckboxClick}
        checked={_selected ? 'CHECKED' : 'UNCHECKED'}
      />
    </Td>
    {!isTablet &&
      searchPage && (
        <Td className="name">
          <Link
            to={`/workflow/${workflowid}?date=${date}`}
            className="resource-name-link"
            title={normalizedName}
          >
            {normalizedName}
          </Link>
        </Td>
      )}
    <Td className="medium">
      <Link
        to={`/order/${id}/${date}?target=${target}&prevQuery=${JSON.stringify(
          allQuery
        )}`}
        className="resource-name-link"
        title={name}
      >
        {id}
      </Link>
    </Td>
    {!isTablet && (
      <Td className="medium">
        <OrderControls id={id} workflowstatus={workflowstatus} compact />
      </Td>
    )}
    <Td className="medium">
      <span className={`label status-${label}`}>{workflowstatus}</span>
    </Td>
    <Td className="narrow">
      <AutoComp>{busErr}</AutoComp>
    </Td>
    <Td className="big">
      <Date date={started} />
    </Td>
    <Td className="big">
      <Date date={completed} />
    </Td>
    <Td className="narrow">{errCnt}</Td>
    <Td className="narrow">{warnCnt}</Td>
    <Td className="medium">
      <Lock lock={operLock} id={id} />
    </Td>
    <Td className="narrow">{noteCnt}</Td>
  </Tr>
);

export default compose(
  connect(
    () => ({}),
    {
      select: actions.orders.select,
      updateDone: actions.orders.updateDone,
    }
  ),
  mapProps(
    ({ workflowstatus, ...rest }): Props => ({
      label: ALL_ORDER_STATES.find(
        (state: Object): boolean => state.name === workflowstatus
      ).label,
      workflowstatus,
      target: rest.searchPage
        ? '/search/orders'
        : `/workflow/${rest.workflowid}/list`,
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
