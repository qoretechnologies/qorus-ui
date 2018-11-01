/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import { Link } from 'react-router';

import { Tr, Td } from '../../../../components/new_table';
import AutoComp from '../../../../components/autocomponent';
import { ALL_ORDER_STATES } from '../../../../constants/orders';
import Text from '../../../../components/text';

type Props = {
  id: number,
  business_error: boolean,
  normalizedName: string,
  name: string,
  operator_lock: boolean,
  workflowstatus: string,
  label: string,
  error: string,
  retry?: number,
  first?: boolean,
};

const TableRow: Function = ({
  id,
  business_error: busErr,
  name,
  error,
  workflowstatus,
  label,
  retry,
  first,
}: Props): React.Element<any> => (
  <Tr first={first}>
    <Td className="medium">
      <Link to={`/order/${id}/24h`} className="resource-name-link" title={name}>
        {id}
      </Link>
    </Td>
    <Td className="medium">
      <span className={`label status-${label}`}>{workflowstatus}</span>
    </Td>
    <Td className="text name">
      <Text text={error} />
    </Td>
    <Td className="narrow">
      <AutoComp>{retry}</AutoComp>
    </Td>
    <Td className="medium">
      <AutoComp>{busErr}</AutoComp>
    </Td>
  </Tr>
);

export default compose(
  mapProps(
    ({ workflowstatus, ...rest }): Props => ({
      label: ALL_ORDER_STATES.find(
        (state: Object): boolean => state.name === workflowstatus
      ).label,
      workflowstatus,
      ...rest,
    })
  ),
  pure(['workflowstatus'])
)(TableRow);
