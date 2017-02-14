// @flow
import React from 'react';
import { Link } from 'react-router';

import { Tr, Td } from '../../../components/new_table';
import AutoComp from '../../../components/autocomponent';
import Date from '../../../components/date';

type Props = {
  item: Object,
  id: number,
  compact: boolean,
};

const HierarchyRow: Function = ({
  item,
  id,
  compact,
}: Props): React.Element<any> => (
  <Tr>
    <Td className="narrow">
      <Link to={`/order/${id}/24h`}>
        {id}
      </Link>
    </Td>
    <Td className="name">
      <Link
        to={`/order/${id}/24h`}
        className="resource-name-link"
      >
        {[...Array(item.hierarchy_level)].map((): string => ('-'))}
        {' '}
        {item.name}
      </Link>
    </Td>
    <Td className="medium">
      <span className={`label status-${item.workflowstatus.toLowerCase()}`}>
        {item.workflowstatus}
      </span>
    </Td>
    <Td className="narrow">
      <AutoComp>{item.business_error}</AutoComp>
    </Td>
    <Td className="narrow">{item.error_count}</Td>
    <Td className="narrow">{item.priority}</Td>
    { !compact && (
      <Td className="big">
        <Date date={item.scheduled} />
      </Td>
    )}
    { !compact && (
      <Td className="big">
        <Date date={item.started} />
      </Td>
    )}
    <Td className="big">
      <Date date={item.completed} />
    </Td>
    { !compact && (
      <Td className="narrow">
        <AutoComp>{item.subworkflow}</AutoComp>
      </Td>
    )}
    { !compact && (
      <Td className="narrow">
        <AutoComp>{item.synchronous}</AutoComp>
      </Td>
    )}
    { !compact && (
      <Td className="medium">{item.warning_count}</Td>
    )}
  </Tr>
);

export default HierarchyRow;
