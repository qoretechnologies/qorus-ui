/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import AutoStart from '../../components/autostart';

import actions from '../../store/api/actions';

type Props = {
  id: number,
  autostart: number,
  execCount: number,
  handleAutostartChange: Function,
  setAutostart: Function,
  withExec?: boolean,
};

const WorkflowAutostart: Function = ({
  autostart,
  execCount,
  handleAutostartChange,
  withExec,
}: Props): React.Element<any> => (
  <AutoStart
    autostart={autostart}
    execCount={execCount}
    onIncrementClick={handleAutostartChange}
    onDecrementClick={handleAutostartChange}
    withExec={withExec}
  />
);

export default compose(
  connect(
    () => ({}),
    {
      setAutostart: actions.workflows.setAutostart,
    }
  ),
  withHandlers({
    handleAutostartChange: ({ setAutostart, id }: Props): Function => (value: number): void => {
      setAutostart(id, value);
    },
  }),
  pure(['autostart', 'execCount'])
)(WorkflowAutostart);
