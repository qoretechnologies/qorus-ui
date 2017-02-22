/* @flow */
import React from 'react';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';

type Props = {
  className: string,
  children: any,
  colspan: number,
}

const Td: Function = ({ colspan, className, children }: Props): React.Element<any> => (
  <td
    colSpan={colspan}
    className={className}
  >
    { children }
  </td>
);

export default compose(
  updateOnlyForKeys([
    'className',
    'children',
    'colspan',
  ])
)(Td);
