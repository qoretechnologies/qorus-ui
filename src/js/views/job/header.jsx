/* @flow */
import React from 'react';

const JobHeader = ({ job }: { job: Object }) => (
  <div className="job-header row">
    <div className="col-xs-12">
      <h3 className="detail-title pull-left">
        {job.name}
        {' '}
        <small>{job.version}</small>
      </h3>
    </div>
  </div>
);

export default JobHeader;
