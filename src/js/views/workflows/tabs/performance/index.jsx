// @flow
import React from 'react';
import ChartView from './chart';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Box from '../../../../components/box';

const PerformanceTab: Function = ({
  workflow,
}: {
  workflow: Object,
}): React.Element<Box> => (
  <Box top fill scrollY>
    <ChartView workflow={workflow} days={1} />
    <ChartView workflow={workflow} days={7} />
    <ChartView workflow={workflow} days={30} />
  </Box>
);

export default onlyUpdateForKeys(['workflow'])(PerformanceTab);
