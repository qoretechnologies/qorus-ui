/* @flow */
import { Icon } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

type Props = {
  children?: any;
  name?: string;
  className?: string;
  colspan?: number;
  handleClick: Function;
  direction: number;
  historyDirection: number;
  onSortChange?: Function;
  onClick?: Function;
  sortData?: Object;
  title?: string;
  fixed?: boolean;
  icon?: string;
  iconName?: string;
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
      // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
      onClick={handleClick}
      title={title}
    >
      {/* @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'IconName ... Remove this comment to see the full error message */}
      {icon && <Icon icon={icon} iconSize={10} className="header-icon" />}
      {icon && ' '}
      <span>{children}</span>
      {direction && direction > 0 && <Icon icon="caret-down" iconSize={10} />}
      {direction && direction < 0 && <Icon icon="caret-up" iconSize={10} />}
      {historyDirection && historyDirection > 0 && <Icon icon="caret-down" iconSize={10} />}
      {historyDirection && historyDirection < 0 && <Icon icon="caret-up" iconSize={10} />}
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
      // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
      onClick={handleClick}
      title={title}
      colSpan={colspan}
    >
      {/* @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'IconName ... Remove this comment to see the full error message */}
      {icon && <Icon iconSize={10} icon={icon} className="header-icon" />}
      {icon && ' '}
      {children}
      {direction && direction > 0 && <Icon icon="caret-down" iconSize={10} />}
      {direction && direction < 0 && <Icon icon="caret-up" iconSize={10} />}
      {historyDirection && historyDirection > 0 && <Icon icon="caret-down" iconSize={10} />}
      {historyDirection && historyDirection < 0 && <Icon icon="caret-up" iconSize={10} />}
    </th>
  );

export default compose(
  withHandlers({
    handleClick:
      ({ onSortChange, onClick, name }: Props) =>
      () => {
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
      // @ts-ignore ts-migrate(2339) FIXME: Property 'sortBy' does not exist on type 'Object'.
      sortData && sortData.sortBy === name
        ? // @ts-ignore ts-migrate(2339) FIXME: Property 'sortByKey' does not exist on type 'Objec... Remove this comment to see the full error message
          sortData.sortByKey.direction
        : null,
    historyDirection:
      // @ts-ignore ts-migrate(2339) FIXME: Property 'historySortBy' does not exist on type 'O... Remove this comment to see the full error message
      sortData && sortData.historySortBy && sortData.historySortBy === name
        ? // @ts-ignore ts-migrate(2339) FIXME: Property 'historySortByKey' does not exist on type... Remove this comment to see the full error message
          sortData.historySortByKey.direction
        : null,
    name,
    icon: icon || iconName,
    ...rest,
  })),
  updateOnlyForKeys(['children', 'className', 'direction', 'historyDirection', 'colspan'])
)(Th);
