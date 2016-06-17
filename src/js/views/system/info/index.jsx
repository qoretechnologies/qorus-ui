import React, { PropTypes } from 'react';

import InfoTable from '../../../components/info_table';

export default function SystemInfoTable(props, context) {
  return (
    <InfoTable object={ context.store.getState().api.system.data } />
  );
}

SystemInfoTable.contextTypes = {
  store: PropTypes.object.isRequired,
};
