import React from 'react';


import Log from './log';
import Loader from 'components/loader';

const LogView = ({ workflow, location }: { workflow: Object, location: Object }) => {
  if (!workflow) return <Loader />;

  return (
    <Log
      resource={`workflows/${workflow.id}`}
      location={location}
    />
  );
};

export default LogView;
