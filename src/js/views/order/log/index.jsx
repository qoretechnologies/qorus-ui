import React from 'react';

import Log from './log';
import Loader from '../../../components/loader';
import Box from '../../../components/box';

const LogView = ({
  workflow,
  location,
}: {
  workflow: Object,
  location: Object,
}) => {
  if (!workflow) return <Loader />;

  return (
    <Box top fill>
      <Log
        intfc="workflows"
        resource={`workflows/${workflow.id}`}
        id={workflow.id}
        location={location}
      />
    </Box>
  );
};

export default LogView;
