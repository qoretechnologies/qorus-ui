/* @flow */
import React from 'react';
import Log from '../../../components/log';

const JobLog = ({ job }: { job: Object }) => (
  <div className="job-log">
    <Log
      model={job}
      resource="jobs"
    />
  </div>
);

export default JobLog;
