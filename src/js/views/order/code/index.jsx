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
  const getHeight: Function = (): number => {
    const { top } = document
      .querySelector('.code-list')
      .getBoundingClientRect();

    return window.innerHeight - top - 60;
  };

  return (
    <Box top>
      <Code data={workflow.lib} heightUpdater={getHeight} location={location} />
    </Box>
  );
};

export default LibraryView;
