// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';
import DateComponent from '../date';
import DatePicker from '../datepicker';

type DateColumnProps = {
  children: any,
  className: string,
  editable?: boolean,
  onDateChange?: Function,
};

const DateColumn: Function = compose(onlyUpdateForKeys(['children']))(
  ({
    children,
    className: className = 'date',
    editable,
    onDateChange,
  }: DateColumnProps): React.Element<any> => (
    <Td className={editable ? 'big' : className}>
      {editable ? (
        <DatePicker
          date={children}
          small
          onApplyDate={onDateChange}
          futureOnly
          className="pt-fill"
          icon="outdated"
        />
      ) : children ? (
        <DateComponent date={children} />
      ) : (
        '-'
      )}
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
    <Th iconName={icon} name={name} {...rest}>
      {children}
    </Th>
  )
);

export { DateColumn, DateColumnHeader };
