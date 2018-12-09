import React from 'react';

import Code from 'components/code';
import Box from 'components/box';

const LibraryView = ({
  workflow,
  location,
}: {
  workflow: Object,
  location: Object,
}) => {
  return (
    <Box top>
      <Code data={workflow.lib} location={location} />
    </Box>
  );
};

export default LibraryView;
