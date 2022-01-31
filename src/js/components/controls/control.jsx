/* @flow */
import { ReqoreButton } from '@qoretechnologies/reqore';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

const intentTransform = {
  success: 'success',
  danger: 'danger',
  info: 'info',
  primary: 'info',
  default: null,
  warning: 'warning',
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
  loading?: boolean,
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
}: Props): React.Element<any> => (
  <ReqoreButton
    id={id}
    className={className}
    title={isTablet ? text : title}
    onClick={handleClick}
    disabled={disabled}
    small
    type={type}
    style={css}
    icon={iconName}
    intent={intent}
    loading={loading}
  >
    {isTablet ? (iconName ? undefined : text) : text}
  </ReqoreButton>
);

export default compose(
  connect((state: Object): Object => ({
    isTablet: state.ui.settings.tablet,
  })),
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
      big,
      iconName: icon || iconName,
      text: text || label || children,
      intent: intentTransform[intent || btnStyle],
      btnStyle,
      ...rest,
    })
  ),
  withHandlers({
    handleClick:
      ({ action, onClick, stopPropagation }: Props): Function =>
      (event: Object): void => {
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
    'text',
    'loading',
  ])
)(Control);
