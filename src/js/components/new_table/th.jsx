/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';
import classNames from 'classnames';

type Props = {
  children?: any,
  name?: string,
  className?: string,
  colspan?: number,
  handleClick: Function,
  direction: number,
  onSortChange?: Function,
  onClick?: Function,
  sortData?: Object,
}

const Th: Function = ({
  children,
  direction,
  handleClick,
  className,
}: Props) => (
  <th
    className={
      classNames({
        sort: direction,
        'sort-asc': direction && direction > 0,
        'sort-desc': direction && direction < 0,
      }, className)
    }
    onClick={handleClick}
  >
    { children }
  </th>
);

export default compose(
  withHandlers({
    handleClick: ({ onSortChange, onClick, name }: Props) => () => {
      if (name) {
        if (onSortChange) onSortChange({ sortBy: name });
        if (onClick) onClick();
      }
    },
  }),
  mapProps(({ sortData, name, ...rest }: Props) => ({
    direction: sortData && sortData.sortBy === name ? sortData.sortByKey.direction : null,
    ...rest,
  })),
  updateOnlyForKeys([
    'children',
    'className',
    'direction',
  ])
)(Th);
