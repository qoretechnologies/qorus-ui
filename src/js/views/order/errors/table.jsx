// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import { Table, Tbody, Thead, Tr, Th, Td } from '../../../components/new_table';
import Date from '../../../components/date';

type Props = {
  collection: Array<Object>,
  steps: Array<Object>,
};

const ErrorsTable: Function = ({
  collection,
  steps,
}: Props): React.Element<Table> => (
  <Table condensed striped>
    <Thead>
      <Tr>
        <Th className="narrow">Severity</Th>
        <Th>Error code</Th>
        <Th className="text">Description</Th>
        <Th className="name">Step Name</Th>
        <Th className="narrow">Index</Th>
        <Th>Created</Th>
        <Th className="text">Error Type</Th>
        <Th className="text">Info</Th>
        <Th className="narrow">Retry</Th>
      </Tr>
    </Thead>
    <Tbody>
      {collection.map((error: Object, index: number): React.Element<any> => {
        const currentStep: ?Object = steps.find((step: Object): boolean => (
          step.stepid === error.stepid
        ));
        const stepName: string = currentStep ? currentStep.stepname : '-';

        return (
          <Tr key={index}>
            <Td className="narrow">{error.severity}</Td>
            <Td>{error.error}</Td>
            <Td className="text">{error.description}</Td>
            <Td className="name">
              {stepName}
            </Td>
            <Td className="narro">{error.ind}</Td>
            <Td>
              <Date date={error.created} />
            </Td>
            <Td className="text">{error.business_error ? 'Business' : 'Other'}</Td>
            <Td className="text">{error.info}</Td>
            <Td className="narrow">{error.retry}</Td>
          </Tr>
        );
      })}
    </Tbody>
  </Table>
);

export default pure(['collection', 'steps'])(ErrorsTable);
