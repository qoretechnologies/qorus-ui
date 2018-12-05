// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import Flex from '../Flex';

type Props = {
  noPadding: boolean,
  top: boolean,
  noTransition: boolean,
  children: any,
  column: number,
  style?: Object,
  width: string | number,
  scrollX?: boolean,
  scrollY?: boolean,
};

const Box: Function = ({
  noPadding,
  children,
  top,
  column,
  noTransition,
  style,
  scrollX,
  scrollY,
  width: width = 'initial',
}: Props): React.Element<any> =>
  noTransition ? (
    <div
      className="white-box"
      style={{
        padding: noPadding ? 0 : null,
        marginTop: top ? 0 : null,
        width: column ? `${100 / column - 0.3 * column}%` : width,
        overflowX: scrollX ? 'auto' : 'hidden',
        overflowY: scrollY ? 'auto' : 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  ) : (
    <Flex
      className="white-box"
      flex="0 1 auto"
      style={{
        padding: noPadding ? 0 : null,
        marginTop: top ? 0 : null,
        width: column ? `${100 / (column + column * 0.1)}%` : width,
        overflowX: scrollX ? 'auto' : 'hidden',
        overflowY: scrollY ? 'auto' : 'hidden',
        ...style,
      }}
    >
      {children}
    </Flex>
  );

export default pure(['noPadding', 'children', 'top'])(Box);
