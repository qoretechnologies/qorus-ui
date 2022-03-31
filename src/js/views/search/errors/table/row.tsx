/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import ContentByType from '../../../../components/ContentByType';
import { IdColumn } from '../../../../components/IdColumn';
import NameColumn from '../../../../components/NameColumn';
import { Td, Tr } from '../../../../components/new_table';
import { ALL_ORDER_STATES } from '../../../../constants/orders';

type Props = {
  id: number;
  business_error: boolean;
  normalizedName: string;
  operator_lock: boolean;
  workflowstatus: string;
  label: string;
  error: string;
  retry?: number;
  first?: boolean;
  error_instanceid: number;
  workflowid: number;
  severity: string;
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
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => (
  <Tr first={first}>
    <IdColumn>{errorId}</IdColumn>
    <NameColumn name={error} type="error" link={`/order/${id}/24h?tab=errors`} />
    <NameColumn name={id} type="order" link={`/order/${id}/24h`} className="medium" />
    <NameColumn name={normalizedName} type="workflow" link={`/workflow/${workflowid}`} />
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
    // @ts-ignore ts-migrate(2740) FIXME: Type '{ label: any; workflowstatus: any; }' is mis... Remove this comment to see the full error message
    ({ workflowstatus, ...rest }): Props => ({
      label: ALL_ORDER_STATES.find(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        (state: Object): boolean => state.name === workflowstatus
      ).label,
      workflowstatus,
      ...rest,
    })
  ),
  pure(['workflowstatus'])
)(TableRow);
