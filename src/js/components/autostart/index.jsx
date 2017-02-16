/* @flow */
import React from 'react';
import classNames from 'classnames';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';

import { Controls, Control } from '../controls';

type Props = {
  autostart: number,
  execCount: number,
  onIncrementClick: Function,
  handleIncrementClick: Function,
  onDecrementClick: Function,
  handleDecrementClick: Function,
  withExec?: boolean,
};

const AutoStart = ({
  autostart,
  execCount,
  handleIncrementClick,
  handleDecrementClick,
  withExec,
}: Props): React.Element<any> => (
  <div className="autostart">
    <Controls noControls grouped>
      <Control
        title="Decrease"
        icon="minus"
        action={handleDecrementClick}
      />
      <button
        className={classNames({
          autostart__change: true,
          btn: true,
          'btn-xs': true,
          'btn-success': parseInt(autostart, 10) === parseInt(execCount, 10) &&
            autostart && autostart > 0,
        })}
      >
        { !withExec ? autostart : `${autostart} / Execs: ${execCount}` }
      </button>
      <Control
        title="Increase"
        icon="plus"
        action={handleIncrementClick}
      />
    </Controls>
  </div>
);

export default compose(
  withHandlers({
    handleIncrementClick: ({ onIncrementClick, autostart }: Props): Function => (): void => {
      onIncrementClick(autostart + 1);
    },
    handleDecrementClick: ({ onDecrementClick, autostart }: Props): Function => (): void => {
      if (autostart - 1 >= 0) {
        onDecrementClick(autostart - 1);
      }
    },
  }),
  pure([
    'autostart',
    'execCount',
  ])
)(AutoStart);
