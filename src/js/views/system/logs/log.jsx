/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import LogContainer from '../../../containers/log';

type Props = {
  params: Object,
  height: string | number,
};

const LogView = ({ params, ...other }: Props): React.Element<*> => (
  <div className="tab-pane active">
    <LogContainer resource={params.log} {...other} />
  </div>
);

export default compose(
  withHandlers({
    heightUpdater: (): Function => (): number => {
      const navbar = document.querySelector('.navbar').clientHeight;
      const tabs = document.querySelector('section .nav-tabs').clientHeight;
      const pills = document.querySelector('section .nav-pills').clientHeight;
      const footer = document.querySelector('footer').clientHeight;
      const top = navbar + tabs + pills + footer;

      return window.innerHeight - top;
    },
  })
)(LogView);
