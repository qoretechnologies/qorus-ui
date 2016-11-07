/* @flow */
import React from 'react';
import withHandlers from 'recompose/withHandlers';

import Code from '../../../../components/code';

type Props = {
  job: Object,
  heightUpdater: Function,
}

const JobCode: Function = ({ job, heightUpdater }: Props): React.Element<any> => (
  <Code
    data={job.lib}
    heightUpdater={heightUpdater}
  />
);

export default withHandlers({
  heightUpdater: (): Function => (): number => {
    const navbar = document.querySelector('.navbar').clientHeight;
    const footer = document.querySelector('footer').clientHeight;
    const header = document.querySelector('.job-header').clientHeight;
    const desc = document.querySelector('.job-description').clientHeight;
    const tabs = document.querySelector('.nav-tabs').clientHeight;
    const top = navbar + footer + header + desc + tabs + 40;

    return window.innerHeight - top;
  },
})(JobCode);
