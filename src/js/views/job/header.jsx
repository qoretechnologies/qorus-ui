/* @flow */
import React from 'react';
import withHandlers from 'recompose/withHandlers';

import Icon from '../../components/icon';
import Controls from '../jobs/controls';

type Props = { job: Object, handleBackClick: Function };

const JobHeader = ({ job, handleBackClick }: Props) => (
  <div className="job-header row">
    <div className="col-xs-12">
      <h3 className="detail-title pull-left">
        <a href="#" onClick={handleBackClick} className="go-back">
          <Icon icon="angle-left" />
        </a>
        {' '}
        {job.name}
        {' '}
        <small>{job.version}</small>
        {' '}
        <small>({job.id})</small>
      </h3>
      <div className="pull-right">
        <Controls {...job} />
      </div>
    </div>
  </div>
);

export default withHandlers({
  handleBackClick: (): Function => (ev: EventHandler): void => {
    ev.preventDefault();

    history.go(-1);
  },
})(JobHeader);
