// @flow
import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Box from '../../../../components/box';
import ChartView from './chart';

const PerformanceTab: Function = ({
  workflow,
}: {
  workflow: any;
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}) => (
  <Box top fill scrollY>
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <ChartView workflow={workflow} days={1} />
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <ChartView workflow={workflow} days={7} />
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <ChartView workflow={workflow} days={30} />
  </Box>
);

export default onlyUpdateForKeys(['workflow'])(PerformanceTab);
