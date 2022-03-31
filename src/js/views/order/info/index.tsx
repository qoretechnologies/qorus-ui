import React from 'react';
import Box from '../../../components/box';
import Info from '../../../components/info_table';

const InfoView = ({ order }: { order: any }) => (
  <Box top>
    <Info
      object={order}
      pick={[
        'name',
        'workflowid',
        'workflow_instanceid',
        'workflowstatus',
        'status_sessionid',
        'started',
        'completed',
        'modified',
        'parent_workflow_instanceid',
        'synchronous',
        'warning_count',
        'error_count',
        'custom_status',
        'custom_status_desc',
        'priority',
        'scheduled',
      ]}
    />
  </Box>
);

export default InfoView;
