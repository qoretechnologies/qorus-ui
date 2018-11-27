// @flow
import React from 'react';
import { Link } from 'react-router';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import { Tr, Td } from '../../../components/new_table';
import AutoComp from '../../../components/autocomponent';
import Date from '../../../components/date';
import { ALL_ORDER_STATES } from '../../../constants/orders';

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
  isTablet,
  first,
}: Props): React.Element<any> => (
  <Tr first={first}>
    <Td className="normal">
      <Link to={`/order/${id}/24h`}>{id}</Link>
    </Td>
    {!isTablet && (
      <Td className="name">
        <Link
          to={`/workflow/${item.workflowid}`}
          className="resource-name-link"
          title={item.name}
        >
          {[...Array(item.hierarchy_level)].map((): string => '--')} {item.name}
        </Link>
      </Td>
    )}
    <Td className="medium">
      <span className={`label status-${label}`}>{item.workflowstatus}</span>
    </Td>
    <Td className="narrow">
      <AutoComp>{item.business_error}</AutoComp>
    </Td>
    <Td className="narrow">{item.error_count}</Td>
    <Td className="narrow">{item.priority}</Td>
    {!compact && !isTablet && (
      <Td className="big">
        <Date date={item.scheduled} />
      </Td>
    )}
    {!compact && (
      <Td className="big">
        <Date date={item.started} />
      </Td>
    )}
    <Td className="big">
      <Date date={item.completed} />
    </Td>
    {!compact && (
      <Td className="narrow">
        <AutoComp>{item.subworkflow}</AutoComp>
      </Td>
    )}
    {!compact && (
      <Td className="narrow">
        <AutoComp>{item.synchronous}</AutoComp>
      </Td>
    )}
    {!compact && <Td className="medium">{item.warning_count}</Td>}
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
  pure(['item', 'isTablet'])
)(HierarchyRow);
