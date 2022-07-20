import React from 'react';
import Box from '../../../components/box';
import Code from '../../../components/code';

const LibraryView = ({ workflow, location }: { workflow: any; location: any }) => {
  return (
    <Box top>
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'lib' does not exist on type 'Object'. */}
      <Code data={workflow.lib} location={location} />
    </Box>
  );
};

export default LibraryView;
