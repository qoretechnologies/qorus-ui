/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';
import classNames from 'classnames';
import { Button } from '@blueprintjs/core';

type Props = {
  title?: string,
  label?: string,
  btnStyle: string,
  icon?: string,
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
};

const Control: Function = ({
  id,
  className,
  title,
  handleClick,
  disabled,
  type,
  css,
  icon,
  label,
  children,
}: Props): React.Element<any> => (
  <button
    id={id}
    className={className}
    title={title}
    onClick={handleClick}
    disabled={disabled}
    type={type}
    style={css}
  >
    {icon && <i className={classNames(['fa', `fa-${icon}`])} />}
    {label ? ` ${label}` : ''}
    {children}
  </button>
);

export default compose(
  mapProps(({ className, big, btnStyle, ...rest }: Props): Props => ({
    className: classNames(className, {
      btn: true,
      'btn-xs': !big,
      [`btn-${btnStyle}`]: btnStyle,
    }),
    big,
    btnStyle,
    ...rest,
  })),
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
  ])
)(Control);
