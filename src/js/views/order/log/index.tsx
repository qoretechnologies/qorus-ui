import React from 'react';
import Box from '../../../components/box';
import Loader from '../../../components/loader';
import Log from './log';

const LogView = ({ workflow, location }: { workflow: Object; location: Object }) => {
  if (!workflow) return <Loader />;

  return (
    <Box top fill>
      <Log
        intfc="workflows"
        // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
        resource={`workflows/${workflow.id}`}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
        id={workflow.id}
        location={location}
      />
    </Box>
  );
};

export default LogView;
