/* @flow */
import React from 'react';
import classnames from 'classnames';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';

import { Thead, Tbody, Tfooter } from './section';
import Tr from './row';
import Th from './th';
import Td from './td';

type Props = {
  children: any,
  className: string,
  striped: boolean,
  condensed: boolean,
  hover: boolean,
  fixed: boolean,
}

let Table: Function = ({
  children,
  className,
  striped,
  condensed,
  hover,
  fixed,
}: Props): React.Element<any> => (
  <table
    className={
      classnames(
        'table',
        'table--data',
        {
          'table-striped': striped,
          'table-condensed': condensed,
          'table-hover': hover,
          'table-fixed': fixed,
        },
        className
      )
    }
  >
    { children }
  </table>
);

Table = updateOnlyForKeys([
  'children',
  'className',
])(Table);

export {
  Table,
  Thead,
  Tbody,
  Tfooter,
  Tr,
  Th,
  Td,
};
