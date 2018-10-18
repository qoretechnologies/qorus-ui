/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import { ButtonGroup } from '@blueprintjs/core';
import { Control as Button } from '../../components/controls';
import mapProps from 'recompose/mapProps';

type Props = {
  autostart: number,
  execCount: number,
  onIncrementClick: Function,
  handleIncrementClick: Function,
  onDecrementClick: Function,
  handleDecrementClick: Function,
  btnStyle: string,
};

const AutoStart = ({
  autostart,
  execCount,
  btnStyle,
  handleIncrementClick,
  handleDecrementClick,
}: Props): React.Element<any> => (
  <ButtonGroup>
    <Button
      title="Decrement autostart"
      iconName="small-minus"
      onClick={handleDecrementClick}
    />
    <Button text={`${autostart} / ${execCount}`} btnStyle={btnStyle} />
    <Button
      title="Increment autostart"
      iconName="small-plus"
      onClick={handleIncrementClick}
    />
  </ButtonGroup>
);

export default compose(
  mapProps(
    ({ autostart, execCount, ...rest }: Props): Props => ({
      autostart: autostart ? parseInt(autostart, 10) : 0,
      execCount: execCount ? parseInt(execCount, 10) : 0,
      ...rest,
    })
  ),
  mapProps(
    ({ autostart, execCount, ...rest }: Props): Props => ({
      btnStyle:
        autostart === execCount && autostart > 0
          ? 'success'
          : autostart === 0 && execCount > 0
            ? 'warning'
            : '',
      autostart,
      execCount,
      ...rest,
    })
  ),
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
