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
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
        resource={`workflows/${workflow.id}`}
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
        id={workflow.id}
        location={location}
      />
    </Box>
  );
};

export default LogView;
