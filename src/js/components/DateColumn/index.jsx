// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';
import DateComponent from '../date';

type DateColumnProps = {
  children: any,
  className: string,
};

const DateColumn: Function = compose(onlyUpdateForKeys(['children']))(
  ({
    children,
    className: className = 'big',
  }: DateColumnProps): React.Element<any> => (
    <Td className={className}>
      {children ? <DateComponent date={children} /> : '-'}
    </Td>
  )
);

type DateColumnHeaderProps = {
  children: any,
  name: string,
  icon: string,
};

const DateColumnHeader: Function = compose(
  onlyUpdateForKeys(['children', 'sortData'])
)(
  ({
    children: children = 'Created',
    name: name = 'created',
    icon: icon = 'calendar',
    ...rest
  }: DateColumnHeaderProps): React.Element<any> => (
    <Th icon={icon} name={name} {...rest}>
      {children}
    </Th>
  )
);

export { DateColumn, DateColumnHeader };
