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
      const footer = document.querySelector('footer').clientHeight;
      const header = document.querySelector('.order-header').clientHeight;
      const tabs = document.querySelector('.nav-tabs').clientHeight;
      const top = navbar + footer + header + tabs;

      return window.innerHeight - top;
    },
  })
)(LogTab);
