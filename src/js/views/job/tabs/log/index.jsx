/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import LogContainer from '../../../../containers/log';

const JobLog = ({ job, ...other }: { job: Object }) => (
  <LogContainer
    {...other}
    resource={`jobs/${job.id}`}
  />
);

export default compose(
  withHandlers({
    heightUpdater: (): Function => (): number => {
      const navbar = document.querySelector('.navbar').clientHeight;
      const footer = document.querySelector('footer').clientHeight;
      const header = document.querySelector('.job-header').clientHeight;
      const desc = document.querySelector('.job-description').clientHeight;
      const tabs = document.querySelector('.nav-tabs').clientHeight;
      const top = navbar + footer + header + + desc + tabs;

      return window.innerHeight - top;
    },
  })
)(JobLog);

