/* @flow */
import React from 'react';

const JobDescription = ({ job }: { job: Object }) => (
  <p className="job-description">
    {job.description}
  </p>
);

export default JobDescription;
