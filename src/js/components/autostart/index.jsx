/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import {
  ButtonGroup,
  Button,
  Intent,
  Tooltip,
  Position,
} from '@blueprintjs/core';

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
  <ButtonGroup>
    <Button
      iconName="small-minus"
      onClick={handleDecrementClick}
      intent={Intent.NONE}
      className="pt-small"
    />
    <Button
      text={
        !withExec ? autostart.toString() : `${autostart} / Execs: ${execCount}`
      }
      intent={
        parseInt(autostart, 10) === parseInt(execCount, 10) &&
        autostart &&
        autostart > 0
          ? Intent.SUCCESS
          : Intent.NONE
      }
      className="pt-small"
    />
    <Button
      iconName="small-plus"
      onClick={handleIncrementClick}
      className="pt-small"
    />
  </ButtonGroup>
);

export default compose(
  withHandlers({
    handleIncrementClick: ({
      onIncrementClick,
      autostart,
    }: Props): Function => (e): void => {
      e.stopPropagation();

      onIncrementClick(autostart + 1);
    },
    handleDecrementClick: ({
      onDecrementClick,
      autostart,
    }: Props): Function => (e): void => {
      e.stopPropagation();

      if (autostart - 1 >= 0) {
        onDecrementClick(autostart - 1);
      }
    },
  }),
  pure(['autostart', 'execCount'])
)(AutoStart);
