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
import NoData from '../../../../../components/nodata';

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
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'job_errorid' does not exist on type 'Obj... Remove this comment to see the full error message
          <Tr key={`error_main_${item.job_errorid}`}>
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'job_errorid' does not exist on type 'Obj... Remove this comment to see the full error message
            <Td>{item.job_errorid}</Td>
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'severity' does not exist on type 'Object... Remove this comment to see the full error message
            <Td className="text">{item.severity}</Td>
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'.
            <Td className="name">{item.error}</Td>
            <Td>
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'business_error' does not exist on type '... Remove this comment to see the full error message
              <Auto>{item.business_error}</Auto>
            </Td>
            <Td>
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'created' does not exist on type 'Object'... Remove this comment to see the full error message
              <Date date={item.created} />
            </Td>
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'description' does not exist on type 'Obj... Remove this comment to see the full error message
            <Td className="text">{item.description}</Td>
          </Tr>,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'info' does not exist on type 'Object'.
          item.info && (
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'job_errorid' does not exist on type 'Obj... Remove this comment to see the full error message
            <Tr key={`error_info_${item.job_errorid}`}>
              <Td className="error-info" colspan={6}>
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'info' does not exist on type 'Object'.
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
  <NoData />
)(ErrorTable);
