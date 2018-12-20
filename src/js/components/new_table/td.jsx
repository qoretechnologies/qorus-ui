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
}: Props): React.Element<any> => (
  <td colSpan={colspan} className={className} title={title}>
    {children || '-'}
  </td>
);

export default compose(
  updateOnlyForKeys(['className', 'children', 'colspan', 'title'])
)(Td);
