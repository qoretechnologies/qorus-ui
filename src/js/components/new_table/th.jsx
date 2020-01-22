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
  iconName?: string,
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
      {icon && <Icon icon={icon} iconSize={10} className="header-icon" />}
      {icon && ' '}
      <span>{children}</span>
      {(direction && direction > 0) && (
        <Icon icon="caret-down" iconSize={10} />
      )}
      {(direction && direction < 0) && (
        <Icon icon="caret-up" iconSize={10} />
      )}
      {(historyDirection && historyDirection > 0) && (
        <Icon icon="caret-down" iconSize={10} />
      )}
      {(historyDirection && historyDirection < 0) && (
        <Icon icon="caret-up" iconSize={10} />
      )}
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
      {icon && <Icon iconSize={10} icon={icon} className="header-icon" />}
      {icon && ' '}
      {children}
      {(direction && direction > 0) && (
        <Icon icon="caret-down" iconSize={10} />
      )}
      {(direction && direction < 0) && (
        <Icon icon="caret-up" iconSize={10} />
      )}
      {(historyDirection && historyDirection > 0) && (
        <Icon icon="caret-down" iconSize={10} />
      )}
      {(historyDirection && historyDirection < 0) && (
        <Icon icon="caret-up" iconSize={10} />
      )}
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
  mapProps(({ sortData, name, icon, iconName, ...rest }: Props) => ({
    direction:
      sortData && sortData.sortBy === name
        ? sortData.sortByKey.direction
        : null,
    historyDirection:
      sortData && sortData.historySortBy && sortData.historySortBy === name
        ? sortData.historySortByKey.direction
        : null,
    name,
    icon: icon || iconName,
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
