/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import AutoStart from '../../components/autostart';

import actions from '../../store/api/actions';
import withDispatch from '../../hocomponents/withDispatch';

type Props = {
  id: number,
  autostart: number,
  execCount: number,
  handleAutostartChange: Function,
  dispatchAction: Function,
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
  withDispatch(),
  withHandlers({
    handleAutostartChange: ({ dispatchAction, id }: Props): Function => (
      value: number
    ): void => {
      dispatchAction(actions.workflows.setAutostart, id, value);
    },
  }),
  pure(['autostart', 'execCount'])
)(WorkflowAutostart);
