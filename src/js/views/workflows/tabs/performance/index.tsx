// @flow
import React from 'react';
import ChartView from './chart';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Box from '../../../../components/box';

const PerformanceTab: Function = ({
  workflow,
}: {
  workflow: Object,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}): React.Element<Box> => (
  <Box top fill scrollY>
    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
    <ChartView workflow={workflow} days={1} />
    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
    <ChartView workflow={workflow} days={7} />
    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
    <ChartView workflow={workflow} days={30} />
  </Box>
);

export default onlyUpdateForKeys(['workflow'])(PerformanceTab);
