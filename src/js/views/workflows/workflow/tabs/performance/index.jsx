// @flow
import React from 'react';
import ChartView from './chart';
import Container from '../../../../../components/container';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Box from '../../../../../components/box';

const PerformanceTab: Function = ({
  workflow,
}: {
  workflow: Object,
}): React.Element<Container> => (
  <Box top>
    <Container>
      <ChartView workflow={workflow} days={1} />
      <ChartView workflow={workflow} days={7} />
      <ChartView workflow={workflow} days={30} />
    </Container>
  </Box>
);

export default onlyUpdateForKeys(['workflow'])(PerformanceTab);
