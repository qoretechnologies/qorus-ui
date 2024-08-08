// @flow
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import ContentByType from '../../../components/ContentByType';
import { DateColumn } from '../../../components/DateColumn';
import NameColumn from '../../../components/NameColumn';
import { Td, Tr } from '../../../components/new_table';
import { ALL_ORDER_STATES } from '../../../constants/orders';
import { StatusLabel } from '../../workflows/tabs/list/row';

type Props = {
  item: any;
  id: number;
  compact: boolean;
  isTablet: boolean;
  label: string;
  first: boolean;
};

const HierarchyRow: Function = ({
  item,
  id,
  compact,
  label,
  first,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Tr first={first}>
    <NameColumn name={id} link={`/order/${id}/24h`} type="order" className="medium" />
    <NameColumn
      // @ts-ignore ts-migrate(2339) FIXME: Property 'hierarchy_level' does not exist on type ... Remove this comment to see the full error message
      name={`${[...Array(item.hierarchy_level)].map((): string => '--')} ${
        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        item.name
      }`}
      // @ts-ignore ts-migrate(2339) FIXME: Property 'workflowid' does not exist on type 'Obje... Remove this comment to see the full error message
      link={`/workflow/${item.workflowid}`}
      type="workflow"
    />
    <Td className="medium">
      <StatusLabel text={item.workflowstatus} label={label} />
    </Td>
    <Td className="tiny">
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'hierarchy_level' does not exist on type ... Remove this comment to see the full error message */}
      <ContentByType content={item.hierarchy_level} />
    </Td>
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'priority' does not exist on type 'Object... Remove this comment to see the full error message */}
    <Td className="medium">{item.priority}</Td>
    <Td className="tiny">
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'business_error' does not exist on type '... Remove this comment to see the full error message */}
      <ContentByType content={item.business_error} />
    </Td>
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'error_count' does not exist on type 'Obj... Remove this comment to see the full error message */}
    {!compact && <Td className="narrow">{item.error_count}</Td>}
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'warning_count' does not exist on type 'O... Remove this comment to see the full error message */}
    {!compact && <Td className="medium">{item.warning_count}</Td>}
    {!compact && (
      <Td className="tiny">
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'subworkflow' does not exist on type 'Obj... Remove this comment to see the full error message */}
        <ContentByType content={item.subworkflow} />
      </Td>
    )}
    {!compact && (
      <Td className="tiny">
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'synchronous' does not exist on type 'Obj... Remove this comment to see the full error message */}
        <ContentByType content={item.synchronous} />
      </Td>
    )}
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'scheduled' does not exist on type 'Objec... Remove this comment to see the full error message */}
    {!compact && <DateColumn>{item.scheduled}</DateColumn>}
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'started' does not exist on type 'Object'... Remove this comment to see the full error message */}
    {!compact && <DateColumn>{item.started}</DateColumn>}
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message */}
    {!compact && <DateColumn>{item.completed}</DateColumn>}
  </Tr>
);

export default compose(
  mapProps(
    ({ item, ...rest }: Props): Props => ({
      label: ALL_ORDER_STATES.find(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        (order: any): boolean => order.name === item.workflowstatus
      ).label,
      item,
      ...rest,
    })
  ),
  pure(['item'])
)(HierarchyRow);
