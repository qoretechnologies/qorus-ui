/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';
import mapProps from 'recompose/mapProps';
import { injectIntl } from 'react-intl';

type Props = {
  autostart: number,
  execCount: number,
  onIncrementClick: Function,
  handleIncrementClick: Function,
  onDecrementClick: Function,
  handleDecrementClick: Function,
  btnStyle: string,
  big?: boolean,
};

const AutoStart = ({
  autostart,
  execCount,
  btnStyle,
  handleIncrementClick,
  handleDecrementClick,
  big,
  intl,
}: Props): React.Element<any> => (
  <ButtonGroup marginRight={big ? 3 : 0}>
    <Button
      title={intl.formatMessage({ id: 'button.decrement-autostart' })}
      icon="small-minus"
      onClick={handleDecrementClick}
      big={big}
    />
    <Button
      big={big}
      text={`${autostart} / ${execCount}`}
      btnStyle={btnStyle}
    />
    <Button
      big={big}
      title={intl.formatMessage({ id: 'button.increment-autostart' })}
      icon="small-plus"
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
  pure(['autostart', 'execCount']),
  injectIntl
)(AutoStart);
