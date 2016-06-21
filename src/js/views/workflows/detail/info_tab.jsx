import React, { PropTypes } from 'react';

import InfoTable from '../../../components/info_table';

import { ORDER_STATES } from 'constants/orders';

/**
 * @param {!{ workflow: !Object }} props
 * @return {!ReactElement}
 */
export default function DetailTab(props) {
  return (
    <InfoTable
      object={props.workflow}
      omit={[
        'options', 'lib', 'stepmap', 'segment', 'steps', 'stepseg',
        'stepinfo', 'wffuncs', 'groups', 'alerts', 'exec_count', 'autostart',
        'has_alerts', 'TOTAL', 'timestamp', 'id', 'normalizedName',
      ].concat(ORDER_STATES.map(os => os.name))}
    />
  );
}

DetailTab.propTypes = {
  workflow: PropTypes.object.isRequired,
};
