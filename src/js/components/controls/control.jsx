/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';
import classNames from 'classnames';
import { Button, Intent } from '@blueprintjs/core';
import { connect } from 'react-redux';

const intentTransform = {
  success: Intent.SUCCESS,
  danger: Intent.DANGER,
  info: Intent.PRIMARY,
  primary: Intent.PRIMARY,
  default: null,
  warning: Intent.WARNING,
};

type Props = {
  title?: string,
  label?: string,
  btnStyle: string,
  icon?: string,
  iconName?: string,
  action?: () => void,
  handleClick?: () => void,
  onClick?: () => void,
  stopPropagation?: boolean,
  disabled?: boolean,
  big?: boolean,
  type?: string,
  css?: Object,
  id?: string,
  className?: string,
  children?: React.Element<*> | Array<React.Element<*>>,
  intent?: string,
  text?: any,
  isTablet?: boolean,
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
}: Props): React.Element<any> => (
  <Button
    id={id}
    className={className}
    title={isTablet ? text : title}
    onClick={handleClick}
    disabled={disabled}
    type={type}
    style={css}
    iconName={iconName}
    text={isTablet ? (iconName ? undefined : text) : text}
    intent={intent}
  />
);

export default compose(
  connect(
    (state: Object): Object => ({
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
        'pt-small': !big,
      }),
      big,
      iconName: icon || iconName,
      text: text || label || children,
      intent: intent || intent === 0 ? intent : intentTransform[btnStyle],
      btnStyle,
      ...rest,
    })
  ),
  withHandlers({
    handleClick: ({ action, onClick, stopPropagation }: Props): Function => (
      event: Object
    ): void => {
      const act: ?Function = action || onClick;

      if (!stopPropagation) event.stopPropagation();

      if (act) {
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
  ])
)(Control);
