/* @flow */
import { Button, Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

const intentTransform = {
  success: Intent.SUCCESS,
  danger: Intent.DANGER,
  info: Intent.PRIMARY,
  primary: Intent.PRIMARY,
  default: null,
  warning: Intent.WARNING,
};

type Props = {
  title?: string;
  label?: string;
  btnStyle: string;
  icon?: string;
  iconName?: string;
  action?: () => void;
  handleClick?: () => void;
  onClick?: () => void;
  stopPropagation?: boolean;
  disabled?: boolean;
  big?: boolean;
  type?: string;
  css?: Object;
  id?: string;
  className?: string;
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  children?: React.Element<*> | Array<React.Element<*>>;
  intent?: string;
  text?: any;
  isTablet?: boolean;
  loading?: boolean;
};

const Control: Function = ({
  id,
  className,
  title,
  handleClick,
  disabled,
  type,
  css,
  iconName,
  text,
  intent,
  isTablet,
  loading,
  big,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => (
  <Button
    id={id}
    className={className}
    title={isTablet ? text : title}
    onClick={handleClick}
    disabled={disabled}
    small
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type '"submit" ... Remove this comment to see the full error message
    type={type}
    style={css}
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'IconName ... Remove this comment to see the full error message
    icon={iconName}
    text={isTablet ? (iconName ? undefined : text) : text}
    // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'Intent'.
    intent={intent}
    loading={loading}
  />
);

export default compose(
  connect(
    (state: Object): Object => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'ui' does not exist on type 'Object'.
      isTablet: state.ui.settings.tablet,
    })
  ),
  mapProps(
    ({
      className,
      big,
      icon,
      iconName,
      text,
      label,
      children,
      intent,
      btnStyle,
      ...rest
    }: Props): Props => ({
      className: classNames(className, {
        'bp3-small': !big,
      }),
      big,
      iconName: icon || iconName,
      text: text || label || children,
      // @ts-ignore ts-migrate(2367) FIXME: This condition will always return 'false' since th... Remove this comment to see the full error message
      intent: intent || intent === 0 ? intent : intentTransform[btnStyle],
      btnStyle,
      ...rest,
    })
  ),
  withHandlers({
    handleClick:
      ({ action, onClick, stopPropagation }: Props): Function =>
      (event: Object): void => {
        const act: Function = action || onClick;

        // @ts-ignore ts-migrate(2339) FIXME: Property 'stopPropagation' does not exist on type ... Remove this comment to see the full error message
        if (!stopPropagation) event.stopPropagation();

        if (act) {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'preventDefault' does not exist on type '... Remove this comment to see the full error message
          event.preventDefault();
          act(event);
        }
      },
  }),
  pure([
    'className',
    'title',
    'disabled',
    'type',
    'style',
    'icon',
    'label',
    'children',
    'big',
    'btnStyle',
    'intent',
    'iconName',
    'isTablet',
    'text',
    'loading',
  ])
)(Control);
