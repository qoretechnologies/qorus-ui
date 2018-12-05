/* @flow */
import React from 'react';
import mapProps from 'recompose/mapProps';
import updateOnlyForKeys from 'recompose/onlyUpdateForKeys';
import setDisplayName from 'recompose/setDisplayName';
import compose from 'recompose/compose';
import classNames from 'classnames';
import Flex from '../Flex';

type Props = {
  type: string,
  children: any,
  className?: string,
  hover?: boolean,
  striped?: boolean,
  bordered?: boolean,
  height?: number | string,
  fixed?: boolean,
  Tag: string,
  marginBottom: number,
  hasFooter: boolean,
};

let Section: Function = ({
  type,
  hover,
  striped,
  children,
  className,
  fixed,
  Tag,
  bordered,
  height,
}: Props): React.Element<any> => {
  if (!fixed) {
    return <Tag>{children}</Tag>;
  }

  if (type === 'header') {
    return (
      <Flex flex="0 1 auto" className="table-header-wrapper">
        {children}
      </Flex>
    );
  }

  if (type === 'body') {
    return (
      <Flex
        className="table-body-wrapper"
        style={{
          maxHeight: height || 'auto',
        }}
      >
        <table
          className={classNames(
            'table table-condensed table--data table-body',
            {
              'table-hover': hover,
              'table-striped': striped,
              'table-bordered-our': bordered,
              'fixed-table': true,
            },
            className
          )}
        >
          <tbody
            style={{
              maxHeight: height || 'auto',
            }}
          >
            {children}
          </tbody>
        </table>
      </Flex>
    );
  }

  return (
    <Flex flexStyle="0 1 auto" className="table-footer-wrapper">
      {children}
    </Flex>
  );
};

// Section = updateOnlyForKeys(['children', 'height'])(Section);

const Thead = compose(
  setDisplayName('Thead'),
  mapProps((props: Object) => ({ ...props, type: 'header', Tag: 'thead' }))
)(Section);

const Tbody = compose(
  setDisplayName('Tbody'),
  mapProps((props: Object) => ({ ...props, type: 'body', Tag: 'tbody' }))
)(Section);

const Tfooter = compose(
  setDisplayName('Tfoot'),
  mapProps((props: Object) => ({ ...props, type: 'footer', Tag: 'tfoot' }))
)(Section);

export { Thead, Tbody, Tfooter };
