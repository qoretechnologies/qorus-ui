/* @flow */
import React from 'react';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';

type Props = {
  className: string,
  children: any,
  colspan: number,
  title: string,
};

const Td: Function = ({
  colspan,
  className,
  children,
  title,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <td colSpan={colspan} className={className} title={title}>
    {children || '-'}
  </td>
);

export default compose(
  updateOnlyForKeys(['className', 'children', 'colspan', 'title'])
)(Td);
