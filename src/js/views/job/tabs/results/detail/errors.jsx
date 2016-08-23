/* @flow */
import React from 'react';
import classNames from 'classnames';

import Date from '../../../../../components/date';
import Auto from '../../../../../components/autocomponent';
import Table, { Th, Td, Row, Section } from '../../../../../components/table';
import showIfPassed from '../../../../../hocomponents/show-if-passed';


const ErrorTable = ({ errors = [] }: { errors: Array<Object> }) => (
  <Table
    className={classNames(
      'table',
      'table-stripped',
      'table-condensed',
      'table-bordered',
      'table-fixed',
      'table--data',
      'job-result-detail-errors'
    )}
  >
    <Section type="head">
      <Row>
        <Th>Id</Th>
        <Th>Severity</Th>
        <Th>Error</Th>
        <Th>Bus. Err</Th>
        <Th>Created</Th>
        <Th>Description</Th>
      </Row>
    </Section>
    <Section type="body">
      {errors
        .map(item => [
          <Row key={`error_main_${item.job_errorid}`}>
            <Td>{item.job_errorid}</Td>
            <Td>{item.severity}</Td>
            <Td>{item.error}</Td>
            <Td><Auto>{item.business_error}</Auto></Td>
            <Td><Date date={item.created} /></Td>
            <Td>{item.description}</Td>
          </Row>,
          item.info && <Row key={`error_info_${item.job_errorid}`}>
            <Td className="error-info" colspan={6}>{item.info}</Td>
          </Row>,
        ])
        .reduce((a, b) => [...a, ...b], [])
        .filter(item => item)
      }
    </Section>
  </Table>
);

export default showIfPassed(
  ({ errors }) => errors && errors.length > 0,
  <div>No errors</div>
)(ErrorTable);
