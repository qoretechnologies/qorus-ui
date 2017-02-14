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
};

const AutoStart = ({
  autostart,
  execCount,
  handleIncrementClick,
  handleDecrementClick,
}: Props): React.Element<any> => (
  <div className="autostart">
    <Controls grouped>
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
          'btn-success': autostart === execCount && autostart && autostart > 0,
        })}
      >
        { autostart }
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
