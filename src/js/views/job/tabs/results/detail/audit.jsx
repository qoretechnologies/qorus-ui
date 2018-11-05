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
          <Td>{item.audit_event_code}</Td>
          <Td className="name">{item.event}</Td>
          <Td className="text">{item.reason}</Td>
          <Td className="text">{item.info1}</Td>
          <Td className="text">{item.info2}</Td>
          <Td className="text">{item.who}</Td>
          <Td className="text">{item.source}</Td>
          <Td>
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
