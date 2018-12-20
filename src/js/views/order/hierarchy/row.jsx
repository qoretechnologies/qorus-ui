// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import { Tr, Td } from '../../../components/new_table';
import { ALL_ORDER_STATES } from '../../../constants/orders';
import NameColumn from '../../../components/NameColumn';
import { DateColumn } from '../../../components/DateColumn';
import { IdColumn } from '../../../components/IdColumn';
import ContentByType from '../../../components/ContentByType';

type Props = {
  item: Object,
  id: number,
  compact: boolean,
  isTablet: boolean,
  label: string,
  first: boolean,
};

const HierarchyRow: Function = ({
  item,
  id,
  compact,
  label,
  first,
}: Props): React.Element<any> => (
  <Tr first={first}>
    <IdColumn>{id}</IdColumn>
    <NameColumn
      name={`${[...Array(item.hierarchy_level)].map((): string => '--')} ${
        item.name
      }`}
      link={`/workflow/${item.workflowid}`}
      type="workflow"
    />
    <Td className="medium">
      <span className={`label status-${label}`}>{item.workflowstatus}</span>
    </Td>
    <Td className="medium">{item.priority}</Td>
    <Td className="medium">
      <ContentByType content={item.business_error} />
    </Td>
    {!compact && <Td className="medium">{item.error_count}</Td>}
    {!compact && <Td className="medium">{item.warning_count}</Td>}
    {!compact && (
      <Td className="medium">
        <ContentByType content={item.subworkflow} />
      </Td>
    )}
    {!compact && (
      <Td className="narrow">
        <ContentByType content={item.synchronous} />
      </Td>
    )}
    {!compact && <DateColumn>{item.scheduled}</DateColumn>}
    {!compact && <DateColumn>{item.started}</DateColumn>}
    {!compact && <DateColumn>{item.completed}</DateColumn>}
  </Tr>
);

export default compose(
  mapProps(
    ({ item, ...rest }: Props): Props => ({
      label: ALL_ORDER_STATES.find(
        (order: Object): boolean => order.name === item.workflowstatus
      ).label,
      item,
      ...rest,
    })
  ),
  pure(['item'])
)(HierarchyRow);
