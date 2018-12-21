/* @flow */
import React from 'react';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import classnames from 'classnames';

import { Thead, Tbody, Tfooter } from './section';
import Tr from './row';
import FixedRow from './fixed_row';
import Th from './th';
import Td from './td';
import EditableCell from './editable_cell';
import Flex from '../Flex';

type Props = {
  children: any,
  className?: string,
  condensed?: string,
  striped?: boolean,
  bordered?: boolean,
  hover?: boolean,
  fixed?: boolean,
  info?: boolean,
  height?: string | number,
  marginBottom?: number,
  width?: number | string,
};

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
  info,
  width,
}: Props): React.Element<any> =>
  fixed ? (
    <Flex className="table-wrapper">
      {React.Children.map(
        children,
        (child: Object): React.Element<any> =>
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
      )}
    </Flex>
  ) : (
    <table
      className={classnames(
        'table',
        {
          'table--data': !info,
          'table-striped': striped,
          'table-condensed': condensed,
          'table-hover': hover,
          'table-bordered-our': bordered,
          'table--info': info,
        },
        className
      )}
      style={{
        width,
      }}
    >
      {React.Children.map(
        children,
        (child: Object): React.Element<any> =>
          React.cloneElement(child, { fixed })
      )}
    </table>
  );

Table = compose(
  updateOnlyForKeys([
    'children',
    'className',
    'marginBottom',
    'height',
    'width',
  ])
)(Table);

export { Table, Thead, Tbody, Tfooter, Tr, Th, Td, EditableCell, FixedRow };
