// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import {
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  FixedRow,
} from '../../../components/new_table';
import Date from '../../../components/date';
import Pull from '../../../components/Pull';
import Dropdown, {
  Control as DropdownToggle,
  Item as DropdownItem,
} from '../../../components/dropdown';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';

type Props = {
  collection: Array<Object>,
  limit: number,
  onItemClick: Function,
};

const AuditTable: Function = ({
  collection,
  limit,
  onItemClick,
}: Props): React.Element<Table> => (
  <Table fixed condensed striped>
    <Thead>
      {collection.length !== 0 && (
        <FixedRow className="toolbar-row">
          <Th>
            <Pull right>
              <Dropdown id="show">
                <DropdownToggle>Showing: {limit}</DropdownToggle>
                <DropdownItem title="10" action={onItemClick} />
                <DropdownItem title="25" action={onItemClick} />
                <DropdownItem title="50" action={onItemClick} />
                <DropdownItem title="100" action={onItemClick} />
                <DropdownItem title="500" action={onItemClick} />
                <DropdownItem title="1000" action={onItemClick} />
                <DropdownItem title="All" action={onItemClick} />
              </Dropdown>
            </Pull>
          </Th>
        </FixedRow>
      )}
      <FixedRow>
        <Th className="narrow">Code</Th>
        <Th className="narrow">Event ID</Th>
        <Th>Created</Th>
        <Th className="name">Event</Th>
        <Th>Info</Th>
        <Th>Reason</Th>
        <Th>Source</Th>
        <Th className="narrow">Who</Th>
      </FixedRow>
    </Thead>
    <DataOrEmptyTable cols={8} condition={collection.length === 0}>
      {props => (
        <Tbody {...props}>
          {collection.map(
            (step: Object, index: number): React.Element<any> => (
              <Tr key={index} first={index === 0}>
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
            )
          )}
        </Tbody>
      )}
    </DataOrEmptyTable>
  </Table>
);

export default pure(['collection'])(AuditTable);
