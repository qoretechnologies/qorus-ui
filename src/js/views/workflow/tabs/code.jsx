/* @flow */
import React from 'react';
import Code from '../../../components/code';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

type Props = {
  workflow: Object,
  heightUpdater: Function,
  location: Object,
};

const CodeTab: Function = ({
  workflow,
  heightUpdater,
  location,
}: Props): React.Element<any> => (
  <Code data={workflow.lib} heightUpdater={heightUpdater} location={location} />
);

export default compose(
  withHandlers({
    heightUpdater: (): Function => (): number => {
      const { top } = document
        .querySelector('.code-list')
        .getBoundingClientRect();

      return window.innerHeight - top - 60;
    },
  })
)(CodeTab);
