// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import { Table, Tbody, Thead, Tr, Th, Td } from '../../../components/new_table';
import Date from '../../../components/date';

type Props = {
  collection: Array<Object>,
};

const AuditTable: Function = ({
  collection,
}: Props): React.Element<Table> => (
  <Table condensed striped>
    <Thead>
      <Tr>
        <Th className="narrow">Event code</Th>
        <Th className="narrow">Event ID</Th>
        <Th>Created</Th>
        <Th className="name">Event</Th>
        <Th>Info</Th>
        <Th>Reason</Th>
        <Th>Source</Th>
        <Th className="narrow">Who</Th>
      </Tr>
    </Thead>
    <Tbody>
      {collection.map((step: Object, index: number): React.Element<any> => (
        <Tr key={index}>
          <Td className="narrow">{step.audit_event_code}</Td>
          <Td className="narrow">{step.audit_eventid}</Td>
          <Td>
            <Date date={step.created} />
          </Td>
          <Td className="name">{step.event}</Td>
          <Td className="text">{step.info1}</Td>
          <Td className="text">{step.reason}</Td>
          <Td className="text">{step.source}</Td>
          <Td className="narrow">{step.who}</Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);

export default pure(['collection'])(AuditTable);
