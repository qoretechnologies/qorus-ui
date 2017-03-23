// @flow
import React from 'react';

import { ORDER_STATES } from '../../../constants/orders';
import InfoTable from '../../../components/info_table';

type Props = {
  workflow: Object,
};

const InfoTab: Function = ({ workflow }: Props): React.Element<any> => (
  <InfoTable
    object={workflow}
    omit={[
      'options', 'lib', 'stepmap', 'segment', 'steps', 'stepseg',
      'stepinfo', 'wffuncs', 'groups', 'alerts', 'exec_count', 'autostart',
      'has_alerts', 'TOTAL', 'timestamp', 'id', 'normalizedName', '_selected', '_updated',
    ].concat(ORDER_STATES.map(os => os.name))}
  />
);

export default InfoTab;
