/* @flow */
import React from 'react';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';

type Props = {
  className: string,
  children: any,
}

const Td: Function = ({ className, children }: Props): React.Element<any> => (
  <td className={className}>
    { children }
  </td>
);

export default compose(
  updateOnlyForKeys([
    'className',
    'children',
  ])
)(Td);
