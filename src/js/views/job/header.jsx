/* @flow */
import React from 'react';
import { Link } from 'react-router';

const JobHeader = ({ job, location }: { job: Object, location: Object }) => (
  <div className="job-header row">
    <div className="col-xs-12">
      <h3 className="detail-title pull-left">
        <Link
          className="go-back"
          to={`/jobs${location.query.date && `/${location.query.date}` || ''}`}
        >
          <i className="fa fa-angle-left" />
        </Link>
        {' '}
        {job.name}
        {' '}
        <small>{job.version}</small>
      </h3>
    </div>
  </div>
);

export default JobHeader;
