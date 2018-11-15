// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  noPadding: boolean,
  top: boolean,
  noTransition: boolean,
  children: any,
  column: number,
  style?: Object,
  width: string | number,
};

const Box: Function = ({
  noPadding,
  children,
  top,
  column,
  noTransition,
  style,
  width: width = 'initial',
}: Props): React.Element<any> =>
  noTransition ? (
    <div
      className="white-box"
      style={{
        padding: noPadding ? 0 : null,
        marginTop: top ? 0 : null,
        width: column ? `${100 / column - 0.3 * column}%` : width,
        ...style,
      }}
    >
      {children}
    </div>
  ) : (
    <div
      className="white-box"
      style={{
        padding: noPadding ? 0 : null,
        marginTop: top ? 0 : null,
        width: column ? `${100 / (column + column * 0.1)}%` : width,
        ...style,
      }}
    >
      {children}
    </div>
  );

export default pure(['noPadding', 'children', 'top'])(Box);
