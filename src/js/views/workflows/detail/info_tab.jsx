import React, { Component, PropTypes } from 'react';


import InfoTable from 'components/info_table';


import { pureRender } from 'components/utils';
import { ORDER_STATES } from 'constants/orders';


@pureRender
export default class DetailTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
  };

  render() {
    return (
      <InfoTable
        object={this.props.workflow}
        omit={[
          'options', 'lib', 'stepmap', 'segment', 'steps', 'stepseg',
          'stepinfo', 'wffuncs', 'groups', 'alerts', 'exec_count', 'autostart',
          'has_alerts', 'TOTAL', 'timestamp', 'id', 'normalizedName',
        ].concat(ORDER_STATES.map(os => os.name))}
      />
    );
  }
}
