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
import NameColumn from '../../../../components/NameColumn';
import ContentByType from '../../../../components/ContentByType';
import { IdColumn } from '../../../../components/IdColumn';

type Props = {
  id: number,
  business_error: boolean,
  normalizedName: string,
  operator_lock: boolean,
  workflowstatus: string,
  label: string,
  error: string,
  retry?: number,
  first?: boolean,
  error_instanceid: number,
  workflowid: number,
  severity: string,
};

const TableRow: Function = ({
  id,
  business_error: busErr,
  normalizedName,
  error,
  workflowstatus,
  workflowid,
  label,
  retry,
  first,
  severity,
  error_instanceid: errorId,
}: Props): React.Element<any> => (
  <Tr first={first}>
    <IdColumn>{errorId}</IdColumn>
    <NameColumn
      name={error}
      type="error"
      link={`/system/errors?globalErrQuery=${error}`}
    />
    <NameColumn
      name={id}
      type="order"
      link={`/order/${id}/24h`}
      className="medium"
    />
    <NameColumn
      name={normalizedName}
      type="workflow"
      link={`/workflow/${workflowid}`}
    />
    <Td className="medium">{severity}</Td>
    <Td className="medium">
      <span className={`label status-${label}`}>{workflowstatus}</span>
    </Td>
    <Td className="narrow">
      <ContentByType content={retry} />
    </Td>
    <Td className="medium">
      <ContentByType content={busErr} />
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
