// @flow
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';

import Row from './row';
import { groupInstances } from '../../../helpers/orders';
import checkNoData from '../../../hocomponents/check-no-data';
import { Table, Thead, Tr, Th } from '../../../components/new_table';
import Box from '../../../components/box';

type Props = {
  order: Object,
  steps: Object,
};

const StepsTable: Function = ({ steps }: Props): React.Element<Table> => (
  <Box noPadding>
    <Table condensed hover striped>
      <Thead>
        <Tr>
          <Th className="narrow">-</Th>
          <Th className="narrow">Status</Th>
          <Th className="name">Name</Th>
          <Th>Error Type</Th>
          <Th>Custom Status</Th>
          <Th className="narrow">Ind</Th>
          <Th className="narrow">Retries</Th>
          <Th className="narrow">Skip</Th>
          <Th>Started</Th>
          <Th>Completed</Th>
          <Th>SubWFL IID</Th>
        </Tr>
      </Thead>
      {Object.keys(steps).map(
        (step: string, index: number): React.Element<Row> => (
          <Row stepdata={steps[step]} key={index} />
        )
      )}
    </Table>
  </Box>
);

export default compose(
  mapProps(
    ({ order, ...rest }: Props): Props => ({
      steps: order.StepInstances,
      order,
      ...rest,
    })
  ),
  mapProps(
    ({ steps, ...rest }: Props): Props => ({
      steps: steps && steps.length ? groupInstances(steps) : {},
      ...rest,
    })
  ),
  checkNoData(
    ({ steps }: Object): boolean => steps && Object.keys(steps).length
  )
)(StepsTable);
