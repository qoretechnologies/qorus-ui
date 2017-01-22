/* @flow */
import React from 'react';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';
import classnames from 'classnames';

import { Thead, Tbody, Tfooter } from './section';
import Tr from './row';
import Th from './th';
import Td from './td';

type Props = {
  children: any,
  className: string,
  condensed: string,
  striped: boolean,
  hover: boolean,
  fixed: boolean,
  height: string | number,
}

let Table: Function = ({
  children,
  fixed,
  striped,
  hover,
  condensed,
  className,
  height,
}: Props): React.Element<any> => (
  fixed ?
    <div
      className="table-wrapper"
    >
      {React.Children.map(children, (child: Object): React.Element<any> => (
        React.cloneElement(child, { fixed, striped, hover, condensed, className, height })
      ))}
    </div> :
    <table
      className={
        classnames(
          'table',
          'table--data',
          {
            'table-striped': striped,
            'table-condensed': condensed,
            'table-hover': hover,
          },
          className
        )
      }
    >
      {React.Children.map(children, (child: Object): React.Element<any> => (
        React.cloneElement(child, { fixed })
      ))}
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
