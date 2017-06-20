/* @flow */
import React from 'react';
import Code from '../../../components/code';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

type Props = {
  workflow: Object,
  heightUpdater: Function,
  location: Object,
}

const CodeTab: Function = ({
  workflow,
  heightUpdater,
  location,
}: Props): React.Element<any> => (
  <Code
    data={workflow.lib}
    heightUpdater={heightUpdater}
    location={location}
  />
);

export default compose(
  withHandlers({
    heightUpdater: (): Function => (): number => {
      const navbar = document.querySelector('.navbar').clientHeight;
      const footer = document.querySelector('footer').clientHeight;
      const header = document.querySelector('.workflow-header').clientHeight;
      const tabs = document.querySelector('.nav-tabs').clientHeight;
      const top = navbar + footer + header + tabs;

      return window.innerHeight - top;
    },
  })
)(CodeTab);
