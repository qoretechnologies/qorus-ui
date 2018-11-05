// @flow
import React from 'react';

import { ORDER_STATES } from '../../../constants/orders';
import InfoTable from '../../../components/info_table';
import Container from '../../../components/container';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Box from '../../../components/box';

type Props = {
  workflow: Object,
};

const InfoTab: Function = ({ workflow }: Props): React.Element<any> => (
  <Box top noPadding>
    <Container>
      <InfoTable
        object={workflow}
        omit={[
          'options',
          'lib',
          'stepmap',
          'segment',
          'steps',
          'stepseg',
          'stepinfo',
          'wffuncs',
          'groups',
          'alerts',
          'exec_count',
          'autostart',
          'has_alerts',
          'TOTAL',
          'timestamp',
          'id',
          'normalizedName',
          '_selected',
          '_updated',
        ].concat(ORDER_STATES.map(os => os.name))}
      />
    </Container>
  </Box>
);

export default onlyUpdateForKeys(['workflow'])(InfoTab);
