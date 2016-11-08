/* @flow */
import React from 'react';
import classNames from 'classnames';

import Date from '../../../../../components/date';
import Table, { Th, Td, Row, Section } from '../../../../../components/table';
import showIfPassed from '../../../../../hocomponents/show-if-passed';

const AuditTable = ({ audit = [] }: { audit: Array<Object> }) => (
  <Table
    className={classNames(
      'table',
      'table-stripped',
      'table-condensed',
      'table-bordered',
      'table-fixed',
      'table--data'
    )}
  >
    <Section type="head">
      <Row>
        <Th>Id</Th>
        <Th>Code</Th>
        <Th>Event</Th>
        <Th>Reason</Th>
        <Th>Info 1</Th>
        <Th>Info 2</Th>
        <Th>Who</Th>
        <Th>Source</Th>
        <Th>Created</Th>
      </Row>
    </Section>
    <Section type="body">
      {audit.map((item, idx) => (
        <Row key={`audit_info_${idx}`}>
          <Td>{idx}</Td>
          <Td>{item.audit_event_code}</Td>
          <Td className="name">{item.event}</Td>
          <Td className="text">{item.reason}</Td>
          <Td className="text">{item.info1}</Td>
          <Td className="text">{item.info2}</Td>
          <Td className="text">{item.who}</Td>
          <Td className="text">{item.source}</Td>
          <Td><Date date={item.created} /></Td>
        </Row>
      ))}
    </Section>
  </Table>
);

export default showIfPassed(
  ({ audit }) => audit && audit.length > 0,
  <div>No audit data</div>
)(AuditTable);
