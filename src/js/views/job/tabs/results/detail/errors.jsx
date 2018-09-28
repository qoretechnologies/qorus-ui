/* @flow */
import React from 'react';

import Date from '../../../../../components/date';
import Auto from '../../../../../components/autocomponent';
import Text from '../../../../../components/text';
import {
  Table,
  Th,
  Td,
  Tr,
  Thead,
  Tbody,
} from '../../../../../components/new_table';
import showIfPassed from '../../../../../hocomponents/show-if-passed';

const ErrorTable = ({ errors = [] }: { errors: Array<Object> }) => (
  <Table striped condensed bordered>
    <Thead>
      <Tr>
        <Th>Id</Th>
        <Th>Severity</Th>
        <Th>Error</Th>
        <Th>Bus. Err</Th>
        <Th>Created</Th>
        <Th>Description</Th>
      </Tr>
    </Thead>
    <Tbody>
      {errors
        .map(item => [
          <Tr key={`error_main_${item.job_errorid}`}>
            <Td>{item.job_errorid}</Td>
            <Td className="text">{item.severity}</Td>
            <Td className="name">{item.error}</Td>
            <Td>
              <Auto>{item.business_error}</Auto>
            </Td>
            <Td>
              <Date date={item.created} />
            </Td>
            <Td className="text">{item.description}</Td>
          </Tr>,
          item.info && (
            <Tr key={`error_info_${item.job_errorid}`}>
              <Td className="error-info" colspan={6}>
                <Text text={item.info} renderTree />
              </Td>
            </Tr>
          ),
        ])
        .reduce((a, b) => [...a, ...b], [])
        .filter(item => item)}
    </Tbody>
  </Table>
);

export default showIfPassed(
  ({ errors }) => errors && errors.length > 0,
  <div>No errors</div>
)(ErrorTable);
