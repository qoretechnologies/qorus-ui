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
  big?: boolean,
};

const WorkflowAutostart: Function = ({
  autostart,
  execCount,
  handleAutostartChange,
  withExec,
  big,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <AutoStart
    big={big}
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      dispatchAction(actions.workflows.setAutostart, id, value);
    },
  }),
  pure(['autostart', 'execCount'])
)(WorkflowAutostart);
