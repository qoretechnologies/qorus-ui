/* @flow */
import React from 'react';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';
import classnames from 'classnames';

import { Thead, Tbody, Tfooter } from './section';
import Tr from './row';
import Th from './th';
import Td from './td';
import EditableCell from './editable_cell';

type Props = {
  children: any,
  className?: string,
  condensed?: string,
  striped?: boolean,
  bordered?: boolean,
  hover?: boolean,
  fixed?: boolean,
  height?: string | number,
  marginBottom?: number
}

let Table: Function = ({
  children,
  fixed,
  striped,
  hover,
  condensed,
  bordered,
  className,
  height,
  marginBottom,
}: Props): React.Element<any> => (
  fixed ?
    <div
      className="table-wrapper"
    >
      {React.Children.map(children, (child: Object): React.Element<any> => (
        React.cloneElement(child, {
          fixed,
          striped,
          hover,
          condensed,
          bordered,
          className,
          height,
          marginBottom: marginBottom || 0,
        })
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
            'table-bordered': bordered,
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
  'marginBottom',
  'height',
])(Table);

export {
  Table,
  Thead,
  Tbody,
  Tfooter,
  Tr,
  Th,
  Td,
  EditableCell,
};
