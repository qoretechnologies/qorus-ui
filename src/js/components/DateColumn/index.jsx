// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';
import DateComponent from '../date';
import DatePicker from '../datepicker';
import { injectIntl } from 'react-intl';

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
          className="bp3-fill"
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
  onlyUpdateForKeys(['children', 'sortData']),
  injectIntl
)(
  ({
    children,
    name: name = 'created',
    icon: icon = 'calendar',
    intl,
    ...rest
  }: DateColumnHeaderProps): React.Element<any> => (
    <Th icon={icon} name={name} {...rest}>
      {children || intl.formatMessage({ id: 'table.created' })}
    </Th>
  )
);

export { DateColumn, DateColumnHeader };
