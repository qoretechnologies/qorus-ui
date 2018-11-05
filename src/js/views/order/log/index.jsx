import React from 'react';

import Log from './log';
import Loader from 'components/loader';
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
    <Box top>
      <Log resource={`workflows/${workflow.id}`} location={location} />
    </Box>
  );
};

export default LogView;
