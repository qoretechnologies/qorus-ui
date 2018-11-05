/* @flow */
import React from 'react';
import withHandlers from 'recompose/withHandlers';

import LogContainer from '../../../../containers/log';
import Box from '../../../../components/box';

const JobLog = ({ job, ...other }: { job: Object }) => (
  <Box top>
    <LogContainer {...other} resource={`jobs/${job.id}`} />
  </Box>
);

export default withHandlers({
  heightUpdater: (): Function => (): number => {
    const navbar = document.querySelector('.navbar').clientHeight;
    const footer = document.querySelector('footer').clientHeight;
    const header = document.querySelector('.job-header').clientHeight;
    const desc = document.querySelector('.job-description').clientHeight;
    const tabs = document.querySelector('.nav-tabs').clientHeight;
    const top = navbar + footer + header + desc + tabs;

    return window.innerHeight - top;
  },
})(JobLog);
