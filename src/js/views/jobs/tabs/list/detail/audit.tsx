/* @flow */
import React from 'react';

import Date from '../../../../../components/date';
import {
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
} from '../../../../../components/new_table';
import showIfPassed from '../../../../../hocomponents/show-if-passed';
import NoData from '../../../../../components/nodata';

const AuditTable = ({ audit = [] }: { audit: Array<Object> }) => (
  <Table striped condensed bordered>
    <Thead>
      <Tr>
        <Th>Id</Th>
        <Th>Code</Th>
        <Th>Event</Th>
        <Th>Reason</Th>
        <Th>Info 1</Th>
        <Th>Info 2</Th>
        <Th>Who</Th>
        <Th>Source</Th>
        <Th>Created</Th>
      </Tr>
    </Thead>
    <Tbody>
      {audit.map((item, idx) => (
        <Tr key={`audit_info_${idx}`}>
          <Td>{idx}</Td>
          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'audit_event_code' does not exist on type... Remove this comment to see the full error message */ }
          <Td>{item.audit_event_code}</Td>
          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'event' does not exist on type 'Object'. */ }
          <Td className="name">{item.event}</Td>
          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'reason' does not exist on type 'Object'. */ }
          <Td className="text">{item.reason}</Td>
          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'info1' does not exist on type 'Object'. */ }
          <Td className="text">{item.info1}</Td>
          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'info2' does not exist on type 'Object'. */ }
          <Td className="text">{item.info2}</Td>
          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'who' does not exist on type 'Object'. */ }
          <Td className="text">{item.who}</Td>
          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'source' does not exist on type 'Object'. */ }
          <Td className="text">{item.source}</Td>
          <Td>
            { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'created' does not exist on type 'Object'... Remove this comment to see the full error message */ }
            <Date date={item.created} />
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);

export default showIfPassed(
  ({ audit }) => audit && audit.length > 0,
  <NoData />
)(AuditTable);
