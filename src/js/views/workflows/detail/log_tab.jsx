/* @flow */
import React from 'react';
import LogContainer from '../../../containers/log';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

type Props = {
  resource: string,
}

const LogTab: Function = (props: Props): React.Element<any> => (
  <LogContainer {...props} />
);

export default compose(
  withHandlers({
    heightUpdater: (): Function => (): number => {
      const navbar = document.querySelector('.navbar').clientHeight;
      const header = document.querySelector('.pane__content .pane__header').clientHeight;
      const tabs = document.querySelector('.pane__content .nav-tabs').clientHeight;
      const top = navbar + header + tabs;

      return window.innerHeight - top;
    },
  })
)(LogTab);
