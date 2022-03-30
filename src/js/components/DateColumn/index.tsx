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
    className = 'date',
    editable,
    onDateChange,
  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  }: DateColumnProps): React.Element<any> => (
    <Td className={editable ? 'big' : className}>
      {editable ? (
        <DatePicker
          date={children}
          small
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
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
    name = 'created',
    icon = 'calendar',
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'DateColumn... Remove this comment to see the full error message
    intl,
    ...rest
  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  }: DateColumnHeaderProps): React.Element<any> => (
    <Th icon={icon} name={name} {...rest}>
      {children || intl.formatMessage({ id: 'table.created' })}
    </Th>
  )
);

export { DateColumn, DateColumnHeader };
