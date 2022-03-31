/* @flow */
import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { Control as Button, Controls as ButtonGroup } from '../../components/controls';

type Props = {
  autostart: number;
  execCount: number;
  onIncrementClick: Function;
  handleIncrementClick: Function;
  onDecrementClick: Function;
  handleDecrementClick: Function;
  btnStyle: string;
  big?: boolean;
};

const AutoStart = ({
  autostart,
  execCount,
  btnStyle,
  handleIncrementClick,
  handleDecrementClick,
  big,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <ButtonGroup marginRight={big ? 3 : 0}>
    <Button
      title={intl.formatMessage({ id: 'button.decrement-autostart' })}
      icon="small-minus"
      onClick={handleDecrementClick}
      big={big}
    />
    <Button big={big} text={`${autostart} / ${execCount}`} btnStyle={btnStyle} />
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
      // @ts-ignore ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
      autostart: autostart ? parseInt(autostart, 10) : 0,
      // @ts-ignore ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
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
    handleIncrementClick:
      ({ onIncrementClick, autostart }: Props): Function =>
      (e): void => {
        e.stopPropagation();

        onIncrementClick(autostart + 1);
      },
    handleDecrementClick:
      ({ onDecrementClick, autostart }: Props): Function =>
      (e): void => {
        e.stopPropagation();

        if (autostart - 1 >= 0) {
          onDecrementClick(autostart - 1);
        }
      },
  }),
  pure(['autostart', 'execCount']),
  injectIntl
)(AutoStart);
