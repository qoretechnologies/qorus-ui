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
import Dropdown, {
  Control as DropdownToggle,
  Item as DropdownItem,
} from '../../../components/dropdown';
import Pull from '../../../components/Pull';
import Text from '../../../components/text';
import CsvControl from '../../../components/CsvControl';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';

type Props = {
  collection: Array<Object>,
  steps: Array<Object>,
  onItemClick: Function,
  onCSVClick: Function,
  limit: number,
};

const ErrorsTable: Function = ({
  collection,
  steps,
  onItemClick,
  onCSVClick,
  limit,
}: Props): React.Element<Table> => (
  <Table condensed striped fixed>
    <Thead>
      <FixedRow className="toolbar-row">
        <Th colspan="full">
          <Pull>
            <CsvControl onClick={onCSVClick} />
          </Pull>
          {collection.length !== 0 && (
            <Pull right>
              <Dropdown id="show">
                <DropdownToggle icon="chevron-down">
                  Showing: {limit}
                </DropdownToggle>
                <DropdownItem title="10" action={onItemClick} />
                <DropdownItem title="25" action={onItemClick} />
                <DropdownItem title="50" action={onItemClick} />
                <DropdownItem title="100" action={onItemClick} />
                <DropdownItem title="500" action={onItemClick} />
                <DropdownItem title="1000" action={onItemClick} />
                <DropdownItem title="All" action={onItemClick} />
              </Dropdown>
            </Pull>
          )}
        </Th>
      </FixedRow>
      <FixedRow>
        <Th className="narrow">Severity</Th>
        <Th>Error code</Th>
        <Th className="text">Description</Th>
        <Th className="name">Step Name</Th>
        <Th className="narrow">Index</Th>
        <Th className="big">Created</Th>
        <Th className="text">Error Type</Th>
        <Th className="text">Info</Th>
        <Th className="narrow">Retry</Th>
      </FixedRow>
    </Thead>
    <DataOrEmptyTable condition={collection.length === 0} cols={9}>
      {props => (
        <Tbody {...props}>
          {collection.map(
            (error: Object, index: number): React.Element<any> => {
              const currentStep: ?Object = steps.find(
                (step: Object): boolean => step.stepid === error.stepid
              );
              const stepName: string = currentStep ? currentStep.stepname : '-';

              return (
                <Tr key={index} first={index === 0}>
                  <Td className="narrow">{error.severity}</Td>
                  <Td>{error.error}</Td>
                  <Td className="text">{error.description}</Td>
                  <Td className="name">{stepName}</Td>
                  <Td className="narro">{error.ind}</Td>
                  <Td>
                    <Date date={error.created} />
                  </Td>
                  <Td className="text">
                    {error.business_error ? 'Business' : 'Other'}
                  </Td>
                  <Td className="text">
                    <Text text={error.info} />
                  </Td>
                  <Td className="narrow">{error.retry}</Td>
                </Tr>
              );
            }
          )}
        </Tbody>
      )}
    </DataOrEmptyTable>
  </Table>
);

export default pure(['collection', 'steps', 'limit'])(ErrorsTable);
