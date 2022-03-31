/* @flow */
import classnames from 'classnames';
import React from 'react';
import compose from 'recompose/compose';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';
import Flex from '../Flex';
import EditableCell from './editable_cell';
import FixedRow from './fixed_row';
import Tr from './row';
import { Tbody, Tfooter, Thead } from './section';
import Td from './td';
import Th from './th';

type Props = {
  children: any;
  className?: string;
  condensed?: string;
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  fixed?: boolean;
  info?: boolean;
  height?: string | number;
  marginBottom?: number;
  width?: number | string;
  clean?: boolean;
};

let Table: Function = ({
  children,
  fixed,
  striped,
  hover,
  condensed,
  bordered,
  clean,
  className,
  height,
  marginBottom,
  info,
  width,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> =>
  fixed ? (
    <Flex className="table-wrapper">
      {React.Children.map(
        children,
        // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
        (child: Object): React.Element<any> =>
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          React.cloneElement(child, {
            fixed,
            striped,
            hover,
            condensed,
            bordered,
            className,
            height,
            clean,
            marginBottom: marginBottom || 0,
          })
      )}
    </Flex>
  ) : (
    <table
      tabIndex={1}
      className={classnames(
        'table',
        {
          'table--data': !info,
          'table-striped': striped,
          'table-condensed': condensed,
          'table-hover': hover,
          'table-bordered-our': bordered,
          'table--info': info,
          'table-clean': clean,
        },
        className
      )}
      style={{
        width,
      }}
    >
      {React.Children.map(
        children,
        // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
        (child: Object): React.Element<any> =>
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          React.cloneElement(child, { fixed })
      )}
    </table>
  );

Table = compose(updateOnlyForKeys(['children', 'className', 'marginBottom', 'height', 'width']))(
  Table
);

export { Table, Thead, Tbody, Tfooter, Tr, Th, Td, EditableCell, FixedRow };
