/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';
import classNames from 'classnames';
import { Icon } from '@blueprintjs/core';

type Props = {
  children?: any,
  name?: string,
  className?: string,
  colspan?: number,
  handleClick: Function,
  direction: number,
  historyDirection: number,
  onSortChange?: Function,
  onClick?: Function,
  sortData?: Object,
  title?: string,
  fixed?: boolean,
  icon?: string,
};

const Th: Function = ({
  children,
  direction,
  historyDirection,
  handleClick,
  className,
  name,
  title,
  colspan,
  fixed,
  onClick,
  icon,
}: Props) =>
  fixed ? (
    <div
      className={classNames(
        {
          sort: direction,
          'history-sort': historyDirection,
          'has-sort': name || !!onClick,
          'sort-asc': direction && direction > 0,
          'sort-desc': direction && direction < 0,
          'history-sort-asc': historyDirection && historyDirection > 0,
          'history-sort-desc': historyDirection && historyDirection < 0,
        },
        className,
        'fixed-table-header'
      )}
      data-colspan={colspan}
      onClick={handleClick}
      title={title}
    >
      {icon && <Icon iconName={icon} className="header-icon" />}
      {icon && ' '}
      <span>{children}</span>
    </div>
  ) : (
    <th
      className={classNames(
        {
          sort: direction,
          'history-sort': historyDirection,
          'has-sort': name || !!onClick,
          'sort-asc': direction && direction > 0,
          'sort-desc': direction && direction < 0,
          'history-sort-asc': historyDirection && historyDirection > 0,
          'history-sort-desc': historyDirection && historyDirection < 0,
        },
        className
      )}
      onClick={handleClick}
      title={title}
      colSpan={colspan}
    >
      {icon && <Icon iconName={icon} className="header-icon" />}
      {icon && ' '}
      {children}
    </th>
  );

export default compose(
  withHandlers({
    handleClick: ({ onSortChange, onClick, name }: Props) => () => {
      if (name) {
        if (onSortChange) onSortChange({ sortBy: name });
        if (onClick) onClick(name);
      } else {
        if (onClick) onClick();
      }
    },
  }),
  mapProps(({ sortData, name, ...rest }: Props) => ({
    direction:
      sortData && sortData.sortBy === name
        ? sortData.sortByKey.direction
        : null,
    historyDirection:
      sortData && sortData.historySortBy && sortData.historySortBy === name
        ? sortData.historySortByKey.direction
        : null,
    name,
    ...rest,
  })),
  updateOnlyForKeys([
    'children',
    'className',
    'direction',
    'historyDirection',
    'colspan',
  ])
)(Th);
